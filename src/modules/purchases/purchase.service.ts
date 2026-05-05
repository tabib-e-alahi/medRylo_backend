import { prisma } from "../../lib/prisma";
import { BadRequestError, ConflictError, NotFoundError } from "../../errors/AppError";
import { MedicineStatus, PaymentStatus, PharmacyInventoryStatus, PurchaseStatus } from "../../../generated/prisma/enums";
import { getApprovedPharmacyForUser } from "../inventory/inventory.service";
import {
  CreatePurchaseInput,
  PurchaseQueryInput,
  UpdatePaymentInput,
  UpdatePurchaseStatusInput,
} from "./purchase.validation";

const purchaseInclude = {
  supplier: true,
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
};

const normalizeDate = (value?: string) => {
  if (!value) return undefined;
  return new Date(value);
};

const derivePaymentStatus = (totalAmount: number, paidAmount: number): PaymentStatus => {
  if (paidAmount <= 0) return PaymentStatus.UNPAID;
  if (paidAmount >= totalAmount) return PaymentStatus.PAID;
  return PaymentStatus.PARTIAL;
};

const buildAmounts = (data: CreatePurchaseInput) => {
  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.purchasePrice, 0);
  const vatAmount = data.vatAmount ?? 0;
  const discount = data.discount ?? 0;
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

async function getPurchaseForPharmacy(userId: string, purchaseId: string) {
  const pharmacy = await getApprovedPharmacyForUser(userId);
  const purchase = await prisma.purchase.findFirst({
    where: {
      id: purchaseId,
      pharmacyId: pharmacy.id,
    },
    include: purchaseInclude,
  });

  if (!purchase) {
    throw new NotFoundError("Purchase not found.");
  }

  return { pharmacy, purchase };
}

async function validateSupplier(supplierId: string) {
  const supplier = await prisma.supplier.findFirst({
    where: {
      id: supplierId,
      isDeleted: false,
      isActive: true,
    },
  });

  if (!supplier) {
    throw new NotFoundError("Active supplier not found.");
  }
}

export async function getActiveSuppliers(userId: string, query: { searchTerm?: string; limit?: number }) {
  await getApprovedPharmacyForUser(userId);

  const where: any = {
    isDeleted: false,
    isActive: true,
  };

  if (query.searchTerm) {
    where.OR = [
      { name: { contains: query.searchTerm, mode: "insensitive" } },
      { contactPerson: { contains: query.searchTerm, mode: "insensitive" } },
      { phone: { contains: query.searchTerm, mode: "insensitive" } },
    ];
  }

  return prisma.supplier.findMany({
    where,
    take: query.limit ?? 100,
    orderBy: { name: "asc" },
  });
}

export async function createPurchase(userId: string, data: CreatePurchaseInput) {
  const pharmacy = await getApprovedPharmacyForUser(userId);
  await validateSupplier(data.supplierId);

  const duplicateInvoice = await prisma.purchase.findUnique({
    where: {
      pharmacyId_invoiceNumber: {
        pharmacyId: pharmacy.id,
        invoiceNumber: data.invoiceNumber,
      },
    },
  });

  if (duplicateInvoice) {
    throw new ConflictError("A purchase with this invoice number already exists for your pharmacy.");
  }

  const inventoryIds = data.items.map((item) => item.inventoryId);
  const inventoryItems = await prisma.pharmacyInventory.findMany({
    where: {
      id: { in: inventoryIds },
      pharmacyId: pharmacy.id,
      status: { not: PharmacyInventoryStatus.ARCHIVED },
      medicine: {
        isDeleted: false,
        status: MedicineStatus.ACTIVE,
      },
    },
    include: { medicine: true },
  });
  const inventoryById = new Map(inventoryItems.map((item) => [item.id, item]));

  if (inventoryById.size !== inventoryIds.length) {
    throw new BadRequestError("One or more inventory items are invalid for this pharmacy.");
  }

  for (const item of data.items) {
    const inventory = inventoryById.get(item.inventoryId);
    if (!inventory || inventory.medicineId !== item.medicineId) {
      throw new BadRequestError("Purchase item medicine must match the selected inventory item.");
    }
  }

  const amounts = buildAmounts(data);
  const shouldReceive = data.purchaseStatus === PurchaseStatus.RECEIVED;

  return prisma.$transaction(async (tx) => {
    const purchase = await tx.purchase.create({
      data: {
        pharmacyId: pharmacy.id,
        supplierId: data.supplierId,
        invoiceNumber: data.invoiceNumber,
        purchaseDate: new Date(data.purchaseDate),
        subtotal: amounts.subtotal,
        vatAmount: amounts.vatAmount,
        discount: amounts.discount,
        totalAmount: amounts.totalAmount,
        paidAmount: amounts.paidAmount,
        dueAmount: amounts.dueAmount,
        paymentStatus: amounts.paymentStatus,
        purchaseStatus: data.purchaseStatus,
        note: data.note || null,
        createdByUserId: userId,
        items: {
          create: data.items.map((item) => ({
            inventory: { connect: { id: item.inventoryId } },
            medicine: { connect: { id: item.medicineId } },
            quantity: item.quantity,
            purchasePrice: item.purchasePrice,
            sellingPrice: item.sellingPrice,
            ...(item.expiryDate ? { expiryDate: new Date(item.expiryDate) } : {}),
            batchNumber: item.batchNumber || null,
            total: item.quantity * item.purchasePrice,
          })),
        },
      },
      include: purchaseInclude,
    });

    if (shouldReceive) {
      for (const item of data.items) {
        await tx.pharmacyInventory.update({
          where: { id: item.inventoryId },
          data: {
            stockQuantity: { increment: item.quantity },
            purchasePrice: item.purchasePrice,
            sellingPrice: item.sellingPrice,
            ...(item.expiryDate ? { expiryDate: new Date(item.expiryDate) } : {}),
            ...(item.batchNumber ? { batchNumber: item.batchNumber } : {}),
          },
        });
      }
    }

    return purchase;
  });
}

export async function getPurchases(userId: string, query: PurchaseQueryInput) {
  const pharmacy = await getApprovedPharmacyForUser(userId);
  const {
    page = 1,
    limit = 10,
    searchTerm,
    supplierId,
    paymentStatus,
    purchaseStatus,
    dateFrom,
    dateTo,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;
  const skip = (page - 1) * limit;

  const where: any = {
    pharmacyId: pharmacy.id,
  };

  if (supplierId) where.supplierId = supplierId;
  if (paymentStatus) where.paymentStatus = paymentStatus;
  if (purchaseStatus) where.purchaseStatus = purchaseStatus;

  if (dateFrom || dateTo) {
    where.purchaseDate = {};
    if (dateFrom) where.purchaseDate.gte = new Date(dateFrom);
    if (dateTo) where.purchaseDate.lte = new Date(dateTo);
  }

  if (searchTerm) {
    where.OR = [
      { invoiceNumber: { contains: searchTerm, mode: "insensitive" } },
      { supplier: { name: { contains: searchTerm, mode: "insensitive" } } },
    ];
  }

  const [purchases, total] = await Promise.all([
    prisma.purchase.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        supplier: true,
        items: true,
      },
    }),
    prisma.purchase.count({ where }),
  ]);

  return {
    purchases,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getPurchaseById(userId: string, purchaseId: string) {
  const { purchase } = await getPurchaseForPharmacy(userId, purchaseId);
  return purchase;
}

export async function updatePurchasePayment(userId: string, purchaseId: string, data: UpdatePaymentInput) {
  const { purchase } = await getPurchaseForPharmacy(userId, purchaseId);

  if (purchase.purchaseStatus === PurchaseStatus.CANCELLED) {
    throw new BadRequestError("Cancelled purchases cannot receive payments.");
  }

  const totalAmount = Number(purchase.totalAmount);
  const paidAmount = Math.min(data.paidAmount, totalAmount);
  const dueAmount = Math.max(0, totalAmount - paidAmount);
  const paymentStatus = data.paymentStatus ?? derivePaymentStatus(totalAmount, paidAmount);

  return prisma.purchase.update({
    where: { id: purchaseId },
    data: {
      paidAmount,
      dueAmount,
      paymentStatus,
    },
    include: purchaseInclude,
  });
}

export async function updatePurchaseStatus(userId: string, purchaseId: string, data: UpdatePurchaseStatusInput) {
  const { purchase } = await getPurchaseForPharmacy(userId, purchaseId);

  if (purchase.purchaseStatus === data.purchaseStatus) {
    return purchase;
  }

  if (purchase.purchaseStatus === PurchaseStatus.RECEIVED && data.purchaseStatus === PurchaseStatus.CANCELLED) {
    throw new BadRequestError("Received purchases cannot be cancelled because stock has already been added.");
  }

  if (purchase.purchaseStatus !== PurchaseStatus.PENDING || data.purchaseStatus !== PurchaseStatus.RECEIVED) {
    throw new BadRequestError("Only pending purchases can be marked as received.");
  }

  return prisma.$transaction(async (tx) => {
    for (const item of purchase.items) {
      if (!item.inventoryId) {
        throw new BadRequestError("Purchase item is missing an inventory reference.");
      }

      await tx.pharmacyInventory.update({
        where: { id: item.inventoryId },
        data: {
          stockQuantity: { increment: item.quantity },
          purchasePrice: item.purchasePrice,
          sellingPrice: item.sellingPrice,
          ...(item.expiryDate ? { expiryDate: item.expiryDate } : {}),
          ...(item.batchNumber ? { batchNumber: item.batchNumber } : {}),
        },
      });
    }

    return tx.purchase.update({
      where: { id: purchaseId },
      data: {
        purchaseStatus: PurchaseStatus.RECEIVED,
      },
      include: purchaseInclude,
    });
  });
}
