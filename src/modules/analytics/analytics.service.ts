import { PharmacyStatus, UserRole, PharmacyInventoryStatus, PaymentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { getApprovedOperationalPharmacyForUser } from "../customers/customer.service";
import { AnalyticsQueryInput } from "./analytics.validation";

const EXPIRING_SOON_DAYS = 30;

const toNumber = (value: unknown) => Number(value || 0);

const getDateRange = (query: AnalyticsQueryInput, field: string) => {
  if (!query.dateFrom && !query.dateTo) return {};

  const range: Record<string, Date> = {};
  if (query.dateFrom) range.gte = new Date(query.dateFrom);
  if (query.dateTo) {
    const end = new Date(query.dateTo);
    end.setHours(23, 59, 59, 999);
    range.lte = end;
  }

  return { [field]: range };
};

const monthKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const makeMonthlyMap = (dateFrom?: string, dateTo?: string) => {
  const now = new Date();
  const start = dateFrom ? new Date(dateFrom) : new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const end = dateTo ? new Date(dateTo) : now;
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
  const result = new Map<string, number>();

  while (cursor <= end) {
    result.set(monthKey(cursor), 0);
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return result;
};

export async function getAdminOverview(query: AnalyticsQueryInput) {
  const [pharmacyStatus, totalUsers, totalMedicines, totalCategories, totalSuppliers, totalMedicineRequests, requestStatus, recentPharmacies] =
    await Promise.all([
      prisma.pharmacy.groupBy({ by: ["status"], _count: { id: true } }),
      prisma.user.count({ where: { isDeleted: false } }),
      prisma.medicine.count({ where: { isDeleted: false } }),
      prisma.category.count({ where: { isDeleted: false } }),
      prisma.supplier.count({ where: { isDeleted: false } }),
      prisma.medicineRequest.count(),
      prisma.medicineRequest.groupBy({ by: ["status"], _count: { id: true } }),
      prisma.pharmacy.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { owner: true },
      }),
    ]);

  const statusCount = (status: PharmacyStatus) => pharmacyStatus.find((item) => item.status === status)?._count.id ?? 0;

  const salesWhere = getDateRange(query, "saleDate");
  const purchaseWhere = getDateRange(query, "purchaseDate");
  const [invoiceAggregate, purchaseAggregate] = await Promise.all([
    prisma.invoice.aggregate({
      where: salesWhere,
      _sum: { totalAmount: true, paidAmount: true, dueAmount: true },
    }),
    prisma.purchase.aggregate({
      where: purchaseWhere,
      _sum: { totalAmount: true },
    }),
  ]);

  return {
    totals: {
      pharmacies: pharmacyStatus.reduce((sum, item) => sum + item._count.id, 0),
      pendingPharmacies: statusCount(PharmacyStatus.PENDING),
      approvedPharmacies: statusCount(PharmacyStatus.APPROVED),
      rejectedPharmacies: statusCount(PharmacyStatus.REJECTED),
      users: totalUsers,
      medicines: totalMedicines,
      categories: totalCategories,
      suppliers: totalSuppliers,
      medicineRequests: totalMedicineRequests,
      platformSales: toNumber(invoiceAggregate._sum.totalAmount),
      platformPaid: toNumber(invoiceAggregate._sum.paidAmount),
      platformDue: toNumber(invoiceAggregate._sum.dueAmount),
      platformPurchases: toNumber(purchaseAggregate._sum.totalAmount),
    },
    pharmacyStatus: pharmacyStatus.map((item) => ({ status: item.status, count: item._count.id })),
    medicineRequestStatus: requestStatus.map((item) => ({ status: item.status, count: item._count.id })),
    recentPharmacies,
  };
}

export async function getAdminPharmacyAnalytics() {
  const status = await prisma.pharmacy.groupBy({ by: ["status"], _count: { id: true } });
  const recent = await prisma.pharmacy.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
    include: { owner: true },
  });
  return { status: status.map((item) => ({ status: item.status, count: item._count.id })), recent };
}

export async function getAdminMedicineAnalytics() {
  const [totalMedicines, totalCategories, totalSuppliers, requestStatus] = await Promise.all([
    prisma.medicine.count({ where: { isDeleted: false } }),
    prisma.category.count({ where: { isDeleted: false } }),
    prisma.supplier.count({ where: { isDeleted: false } }),
    prisma.medicineRequest.groupBy({ by: ["status"], _count: { id: true } }),
  ]);

  return {
    totalMedicines,
    totalCategories,
    totalSuppliers,
    medicineRequestStatus: requestStatus.map((item) => ({ status: item.status, count: item._count.id })),
  };
}

export async function getAdminSalesSummary(query: AnalyticsQueryInput) {
  const [invoiceAggregate, paymentAggregate, purchaseAggregate] = await Promise.all([
    prisma.invoice.aggregate({
      where: getDateRange(query, "saleDate"),
      _sum: { totalAmount: true, paidAmount: true, dueAmount: true },
      _count: { id: true },
    }),
    prisma.payment.aggregate({
      where: getDateRange(query, "paymentDate"),
      _sum: { amount: true },
      _count: { id: true },
    }),
    prisma.purchase.aggregate({
      where: getDateRange(query, "purchaseDate"),
      _sum: { totalAmount: true },
      _count: { id: true },
    }),
  ]);

  return {
    invoiceCount: invoiceAggregate._count.id,
    paymentCount: paymentAggregate._count.id,
    purchaseCount: purchaseAggregate._count.id,
    totalSales: toNumber(invoiceAggregate._sum.totalAmount),
    totalPaid: toNumber(invoiceAggregate._sum.paidAmount),
    totalDue: toNumber(invoiceAggregate._sum.dueAmount),
    totalCollected: toNumber(paymentAggregate._sum.amount),
    totalPurchases: toNumber(purchaseAggregate._sum.totalAmount),
  };
}

export async function getPharmacyOverview(userId: string, role: UserRole, query: AnalyticsQueryInput) {
  const pharmacy = await getApprovedOperationalPharmacyForUser(userId, role);
  const now = new Date();
  const expiringUntil = new Date(now);
  expiringUntil.setDate(now.getDate() + EXPIRING_SOON_DAYS);

  const invoiceWhere = { pharmacyId: pharmacy.id, ...getDateRange(query, "saleDate") };
  const paymentWhere = { pharmacyId: pharmacy.id, ...getDateRange(query, "paymentDate") };
  const purchaseWhere = { pharmacyId: pharmacy.id, ...getDateRange(query, "purchaseDate") };

  const [
    totalInventoryItems,
    lowStockItems,
    expiringSoonItems,
    totalCustomers,
    totalPurchases,
    purchaseAggregate,
    totalInvoices,
    invoiceAggregate,
    paymentAggregate,
    invoiceStatus,
    recentInvoices,
    recentPayments,
    recentPurchases,
  ] = await Promise.all([
    prisma.pharmacyInventory.count({ where: { pharmacyId: pharmacy.id, status: { not: PharmacyInventoryStatus.ARCHIVED } } }),
    prisma.pharmacyInventory.count({
      where: {
        pharmacyId: pharmacy.id,
        status: { not: PharmacyInventoryStatus.ARCHIVED },
        stockQuantity: { lte: prisma.pharmacyInventory.fields.lowStockAlertQuantity },
      },
    }),
    prisma.pharmacyInventory.count({
      where: {
        pharmacyId: pharmacy.id,
        status: { not: PharmacyInventoryStatus.ARCHIVED },
        expiryDate: { gte: now, lte: expiringUntil },
      },
    }),
    prisma.customer.count({ where: { pharmacyId: pharmacy.id, isDeleted: false } }),
    prisma.purchase.count({ where: purchaseWhere }),
    prisma.purchase.aggregate({ where: purchaseWhere, _sum: { totalAmount: true } }),
    prisma.invoice.count({ where: invoiceWhere }),
    prisma.invoice.aggregate({ where: invoiceWhere, _sum: { totalAmount: true, paidAmount: true, dueAmount: true } }),
    prisma.payment.aggregate({ where: paymentWhere, _sum: { amount: true }, _count: { id: true } }),
    prisma.invoice.groupBy({ by: ["paymentStatus"], where: invoiceWhere, _count: { id: true } }),
    prisma.invoice.findMany({ where: { pharmacyId: pharmacy.id }, take: 6, orderBy: { saleDate: "desc" }, include: { customer: true } }),
    prisma.payment.findMany({ where: { pharmacyId: pharmacy.id }, take: 6, orderBy: { paymentDate: "desc" }, include: { invoice: true } }),
    prisma.purchase.findMany({ where: { pharmacyId: pharmacy.id }, take: 6, orderBy: { purchaseDate: "desc" }, include: { supplier: true } }),
  ]);

  const statusCount = (status: PaymentStatus) => invoiceStatus.find((item) => item.paymentStatus === status)?._count.id ?? 0;

  return {
    pharmacy,
    totals: {
      inventoryItems: totalInventoryItems,
      lowStockItems,
      expiringSoonItems,
      customers: totalCustomers,
      purchases: totalPurchases,
      purchaseAmount: toNumber(purchaseAggregate._sum.totalAmount),
      invoices: totalInvoices,
      salesAmount: toNumber(invoiceAggregate._sum.totalAmount),
      paidAmount: toNumber(invoiceAggregate._sum.paidAmount),
      dueAmount: toNumber(invoiceAggregate._sum.dueAmount),
      collectedAmount: toNumber(paymentAggregate._sum.amount),
      paymentCount: paymentAggregate._count.id,
      unpaidInvoices: statusCount(PaymentStatus.UNPAID),
      partialInvoices: statusCount(PaymentStatus.PARTIAL),
      paidInvoices: statusCount(PaymentStatus.PAID),
    },
    invoiceStatus: invoiceStatus.map((item) => ({ status: item.paymentStatus, count: item._count.id })),
    recentInvoices,
    recentPayments,
    recentPurchases,
  };
}

export async function getPharmacySalesAnalytics(userId: string, role: UserRole, query: AnalyticsQueryInput) {
  const pharmacy = await getApprovedOperationalPharmacyForUser(userId, role);
  const monthlySales = makeMonthlyMap(query.dateFrom, query.dateTo);
  const monthlyPayments = makeMonthlyMap(query.dateFrom, query.dateTo);

  const [invoices, payments, topItems] = await Promise.all([
    prisma.invoice.findMany({
      where: { pharmacyId: pharmacy.id, ...getDateRange(query, "saleDate") },
      select: { saleDate: true, totalAmount: true },
    }),
    prisma.payment.findMany({
      where: { pharmacyId: pharmacy.id, ...getDateRange(query, "paymentDate") },
      select: { paymentDate: true, amount: true },
    }),
    prisma.invoiceItem.groupBy({
      by: ["medicineId"],
      where: {
        invoice: {
          pharmacyId: pharmacy.id,
          ...getDateRange(query, "saleDate"),
        },
      },
      _sum: { quantity: true, total: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 8,
    }),
  ]);

  for (const invoice of invoices) {
    const key = monthKey(invoice.saleDate);
    monthlySales.set(key, (monthlySales.get(key) ?? 0) + toNumber(invoice.totalAmount));
  }

  for (const payment of payments) {
    const key = monthKey(payment.paymentDate);
    monthlyPayments.set(key, (monthlyPayments.get(key) ?? 0) + toNumber(payment.amount));
  }

  const medicineIds = topItems.map((item) => item.medicineId);
  const medicines = await prisma.medicine.findMany({
    where: { id: { in: medicineIds } },
    select: { id: true, name: true, genericName: true, strength: true },
  });
  const medicineById = new Map(medicines.map((medicine) => [medicine.id, medicine]));

  return {
    monthlySales: Array.from(monthlySales.entries()).map(([month, amount]) => ({ month, amount })),
    monthlyPayments: Array.from(monthlyPayments.entries()).map(([month, amount]) => ({ month, amount })),
    topSellingMedicines: topItems.map((item) => ({
      medicine: medicineById.get(item.medicineId),
      quantity: item._sum.quantity ?? 0,
      total: toNumber(item._sum.total),
    })),
  };
}

export async function getPharmacyPurchaseAnalytics(userId: string, role: UserRole, query: AnalyticsQueryInput) {
  const pharmacy = await getApprovedOperationalPharmacyForUser(userId, role);
  const monthlyPurchases = makeMonthlyMap(query.dateFrom, query.dateTo);
  const purchases = await prisma.purchase.findMany({
    where: { pharmacyId: pharmacy.id, ...getDateRange(query, "purchaseDate") },
    select: { purchaseDate: true, totalAmount: true },
  });

  for (const purchase of purchases) {
    const key = monthKey(purchase.purchaseDate);
    monthlyPurchases.set(key, (monthlyPurchases.get(key) ?? 0) + toNumber(purchase.totalAmount));
  }

  const aggregate = await prisma.purchase.aggregate({
    where: { pharmacyId: pharmacy.id, ...getDateRange(query, "purchaseDate") },
    _sum: { totalAmount: true },
    _count: { id: true },
  });

  return {
    totalPurchases: aggregate._count.id,
    totalPurchaseAmount: toNumber(aggregate._sum.totalAmount),
    monthlyPurchases: Array.from(monthlyPurchases.entries()).map(([month, amount]) => ({ month, amount })),
  };
}

export async function getPharmacyInventoryAnalytics(userId: string, role: UserRole) {
  const pharmacy = await getApprovedOperationalPharmacyForUser(userId, role);
  const now = new Date();
  const expiringUntil = new Date(now);
  expiringUntil.setDate(now.getDate() + EXPIRING_SOON_DAYS);

  const [lowStockItems, expiringSoonItems] = await Promise.all([
    prisma.pharmacyInventory.findMany({
      where: {
        pharmacyId: pharmacy.id,
        status: { not: PharmacyInventoryStatus.ARCHIVED },
        stockQuantity: { lte: prisma.pharmacyInventory.fields.lowStockAlertQuantity },
      },
      take: 10,
      orderBy: { stockQuantity: "asc" },
      include: { medicine: true },
    }),
    prisma.pharmacyInventory.findMany({
      where: {
        pharmacyId: pharmacy.id,
        status: { not: PharmacyInventoryStatus.ARCHIVED },
        expiryDate: { gte: now, lte: expiringUntil },
      },
      take: 10,
      orderBy: { expiryDate: "asc" },
      include: { medicine: true },
    }),
  ]);

  return { lowStockItems, expiringSoonItems };
}

export async function getPharmacyPaymentAnalytics(userId: string, role: UserRole, query: AnalyticsQueryInput) {
  const pharmacy = await getApprovedOperationalPharmacyForUser(userId, role);
  const payments = await prisma.payment.findMany({
    where: { pharmacyId: pharmacy.id, ...getDateRange(query, "paymentDate") },
    orderBy: { paymentDate: "desc" },
    include: { invoice: true },
  });
  const aggregate = await prisma.payment.aggregate({
    where: { pharmacyId: pharmacy.id, ...getDateRange(query, "paymentDate") },
    _sum: { amount: true },
    _count: { id: true },
  });

  return {
    totalCollected: toNumber(aggregate._sum.amount),
    paymentCount: aggregate._count.id,
    payments,
  };
}
