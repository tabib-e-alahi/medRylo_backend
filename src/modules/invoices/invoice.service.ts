import {
  InvoiceStatus,
  MedicineStatus,
  PaymentMode,
  PaymentStatus,
  PharmacyInventoryStatus,
  UserRole,
} from "../../../generated/prisma/enums";
import { BadRequestError, ConflictError, NotFoundError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { getApprovedOperationalPharmacyForUser } from "../customers/customer.service";
import { CreateInvoiceInput, CreatePaymentInput, InvoiceQueryInput } from "./invoice.validation";

const invoiceInclude = {
  customer: true,
  items: {
    include: {
      inventory: {
        include: {
          medicine: {
            include: {
              category: true,
              type: true,
              unit: true,
            },
          },
        },
      },
      medicine: {
        include: {
          category: true,
          type: true,
          unit: true,
        },
      },
    },
  },
  payments: {
    orderBy: { paymentDate: "desc" as const },
  },
};

const derivePaymentStatus = (totalAmount: number, totalPaid: number): PaymentStatus => {
  if (totalPaid <= 0) return PaymentStatus.UNPAID;
  if (totalPaid >= totalAmount) return PaymentStatus.PAID;
  return PaymentStatus.PARTIAL;
};

const buildInvoiceAmounts = (data: CreateInvoiceInput) => {
  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const vatAmount = data.items.reduce((sum, item) => sum + (item.vat ?? 0), 0);
  const discount = data.items.reduce((sum, item) => sum + (item.discount ?? 0), 0);
  const totalAmount = Math.max(0, subtotal + vatAmount - discount);
  const paidAmount = Math.min(data.paidAmount ?? 0, totalAmount);
  const dueAmount = Math.max(0, totalAmount - paidAmount);

  return {
    subtotal,
    vatAmount,
    discount,
    totalAmount,
    paidAmount,
    dueAmount,
    paymentStatus: derivePaymentStatus(totalAmount, paidAmount),
  };
};

async function getInvoiceForPharmacy(userId: string, role: UserRole, invoiceId: string) {
  const pharmacy = await getApprovedOperationalPharmacyForUser(userId, role);
  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      pharmacyId: pharmacy.id,
    },
    include: invoiceInclude,
  });

  if (!invoice) {
    throw new NotFoundError("Invoice not found.");
  }

  return { pharmacy, invoice };
}

export async function createInvoice(userId: string, role: UserRole, data: CreateInvoiceInput) {
  const pharmacy = await getApprovedOperationalPharmacyForUser(userId, role, "canManageSales");

  const duplicateInvoice = await prisma.invoice.findUnique({
    where: {
      pharmacyId_invoiceNumber: {
        pharmacyId: pharmacy.id,
        invoiceNumber: data.invoiceNumber,
      },
    },
  });

  if (duplicateInvoice) {
    throw new ConflictError("An invoice with this number already exists for your pharmacy.");
  }

  if (data.customerId) {
    const customer = await prisma.customer.findFirst({
      where: {
        id: data.customerId,
        pharmacyId: pharmacy.id,
        isDeleted: false,
      },
    });

    if (!customer) {
      throw new NotFoundError("Customer not found.");
    }
  }

  const inventoryIds = data.items.map((item) => item.inventoryId);
  const inventoryItems = await prisma.pharmacyInventory.findMany({
    where: {
      id: { in: inventoryIds },
      pharmacyId: pharmacy.id,
      status: PharmacyInventoryStatus.ACTIVE,
      medicine: {
        isDeleted: false,
        status: MedicineStatus.ACTIVE,
      },
    },
    include: { medicine: true },
  });
  const inventoryById = new Map(inventoryItems.map((item) => [item.id, item]));

  if (inventoryById.size !== inventoryIds.length) {
    throw new BadRequestError("One or more invoice items are invalid for this pharmacy.");
  }

  for (const item of data.items) {
    const inventory = inventoryById.get(item.inventoryId);
    if (!inventory || inventory.medicineId !== item.medicineId) {
      throw new BadRequestError("Invoice item medicine must match the selected inventory item.");
    }

    if (inventory.stockQuantity < item.quantity) {
      throw new BadRequestError(`Insufficient stock for ${inventory.medicine.name}. Available stock is ${inventory.stockQuantity}.`);
    }
  }

  const amounts = buildInvoiceAmounts(data);

  if ((data.paidAmount ?? 0) > amounts.totalAmount) {
    throw new BadRequestError("Initial payment cannot be greater than invoice total.");
  }

  return prisma.$transaction(async (tx) => {
    const invoice = await tx.invoice.create({
      data: {
        pharmacyId: pharmacy.id,
        customerId: data.customerId || null,
        invoiceNumber: data.invoiceNumber,
        saleDate: new Date(data.saleDate),
        subtotal: amounts.subtotal,
        vatAmount: amounts.vatAmount,
        discount: amounts.discount,
        totalAmount: amounts.totalAmount,
        netAmount: amounts.totalAmount,
        paidAmount: amounts.paidAmount,
        dueAmount: amounts.dueAmount,
        paymentStatus: amounts.paymentStatus,
        paymentMode: (data.paymentMode as PaymentMode | undefined) ?? PaymentMode.CASH,
        status: amounts.paymentStatus === PaymentStatus.PAID ? InvoiceStatus.PAID : InvoiceStatus.ISSUED,
        note: data.note || null,
        createdByUserId: userId,
        items: {
          create: data.items.map((item) => ({
            inventory: { connect: { id: item.inventoryId } },
            medicine: { connect: { id: item.medicineId } },
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            vat: item.vat ?? 0,
            discount: item.discount ?? 0,
            total: Math.max(0, item.quantity * item.unitPrice + (item.vat ?? 0) - (item.discount ?? 0)),
          })),
        },
      },
      include: invoiceInclude,
    });

    for (const item of data.items) {
      await tx.pharmacyInventory.update({
        where: { id: item.inventoryId },
        data: {
          stockQuantity: { decrement: item.quantity },
        },
      });
    }

    if (amounts.paidAmount > 0) {
      await tx.payment.create({
        data: {
          invoiceId: invoice.id,
          pharmacyId: pharmacy.id,
          amount: amounts.paidAmount,
          paymentMode: data.paymentMode ?? PaymentMode.CASH,
          paymentDate: new Date(data.saleDate),
          note: data.paymentNote || null,
          receivedByUserId: userId,
        },
      });
    }

    return tx.invoice.findUniqueOrThrow({
      where: { id: invoice.id },
      include: invoiceInclude,
    });
  });
}

export async function getInvoices(userId: string, role: UserRole, query: InvoiceQueryInput) {
  const pharmacy = await getApprovedOperationalPharmacyForUser(userId, role, "canManageSales");
  const {
    page = 1,
    limit = 10,
    searchTerm,
    paymentStatus,
    dateFrom,
    dateTo,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;
  const skip = (page - 1) * limit;

  const where: any = {
    pharmacyId: pharmacy.id,
  };

  if (paymentStatus) where.paymentStatus = paymentStatus;

  if (dateFrom || dateTo) {
    where.saleDate = {};
    if (dateFrom) where.saleDate.gte = new Date(dateFrom);
    if (dateTo) where.saleDate.lte = new Date(dateTo);
  }

  if (searchTerm) {
    where.OR = [
      { invoiceNumber: { contains: searchTerm, mode: "insensitive" } },
      { customer: { name: { contains: searchTerm, mode: "insensitive" } } },
      { customer: { phone: { contains: searchTerm, mode: "insensitive" } } },
    ];
  }

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        customer: true,
        items: true,
      },
    }),
    prisma.invoice.count({ where }),
  ]);

  return {
    invoices,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getInvoiceById(userId: string, role: UserRole, invoiceId: string) {
  const { invoice } = await getInvoiceForPharmacy(userId, role, invoiceId);
  return invoice;
}

export async function createPayment(userId: string, role: UserRole, invoiceId: string, data: CreatePaymentInput) {
  if (role === UserRole.STAFF) {
    await getApprovedOperationalPharmacyForUser(userId, role, "canManageSales");
  }
  const { pharmacy, invoice } = await getInvoiceForPharmacy(userId, role, invoiceId);

  if (invoice.paymentStatus === PaymentStatus.CANCELLED || invoice.status === InvoiceStatus.CANCELLED) {
    throw new BadRequestError("Cancelled invoices cannot receive payments.");
  }

  const dueAmount = Number(invoice.dueAmount);
  if (data.amount > dueAmount) {
    throw new BadRequestError("Payment amount cannot be greater than current due amount.");
  }

  return prisma.$transaction(async (tx) => {
    await tx.payment.create({
      data: {
        invoiceId: invoice.id,
        pharmacyId: pharmacy.id,
        amount: data.amount,
        paymentMode: data.paymentMode,
        paymentDate: new Date(data.paymentDate),
        note: data.note || null,
        receivedByUserId: userId,
      },
    });

    const paymentAggregate = await tx.payment.aggregate({
      where: { invoiceId: invoice.id },
      _sum: { amount: true },
    });

    const totalAmount = Number(invoice.totalAmount);
    const totalPaid = Number(paymentAggregate._sum.amount || 0);
    const nextDueAmount = Math.max(0, totalAmount - totalPaid);
    const nextPaymentStatus = derivePaymentStatus(totalAmount, totalPaid);

    return tx.invoice.update({
      where: { id: invoice.id },
      data: {
        paidAmount: totalPaid,
        dueAmount: nextDueAmount,
        paymentStatus: nextPaymentStatus,
        status: nextPaymentStatus === PaymentStatus.PAID ? InvoiceStatus.PAID : InvoiceStatus.ISSUED,
        paymentMode: data.paymentMode,
      },
      include: invoiceInclude,
    });
  });
}

export async function getInvoicePayments(userId: string, role: UserRole, invoiceId: string) {
  const { invoice } = await getInvoiceForPharmacy(userId, role, invoiceId);

  const payments = await prisma.payment.findMany({
    where: { invoiceId: invoice.id },
    orderBy: { paymentDate: "desc" },
  });

  const totalPaid = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);

  return {
    payments,
    summary: {
      totalAmount: Number(invoice.totalAmount),
      totalPaid,
      dueAmount: Math.max(0, Number(invoice.totalAmount) - totalPaid),
      paymentStatus: derivePaymentStatus(Number(invoice.totalAmount), totalPaid),
    },
  };
}

export async function cancelInvoice(userId: string, role: UserRole, invoiceId: string) {
  const { invoice } = await getInvoiceForPharmacy(userId, role, invoiceId);

  if (invoice.status === InvoiceStatus.CANCELLED) {
    return invoice;
  }

  if (Number(invoice.paidAmount) > 0) {
    throw new BadRequestError("Invoices with payments cannot be cancelled.");
  }

  return prisma.$transaction(async (tx) => {
    for (const item of invoice.items) {
      if (!item.inventoryId) {
        throw new BadRequestError("Invoice item is missing an inventory reference.");
      }

      await tx.pharmacyInventory.update({
        where: { id: item.inventoryId },
        data: {
          stockQuantity: { increment: item.quantity },
        },
      });
    }

    return tx.invoice.update({
      where: { id: invoice.id },
      data: {
        status: InvoiceStatus.CANCELLED,
        paymentStatus: PaymentStatus.CANCELLED,
      },
      include: invoiceInclude,
    });
  });
}
