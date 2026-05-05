import { z } from "zod";
import { PAYMENT_STATUS, PURCHASE_STATUS } from "../../constant/enum";

const purchaseStatusEnum = z.enum([
  PURCHASE_STATUS.PENDING,
  PURCHASE_STATUS.RECEIVED,
  PURCHASE_STATUS.PARTIAL,
  PURCHASE_STATUS.CANCELLED,
]);

const paymentStatusEnum = z.enum([
  PAYMENT_STATUS.UNPAID,
  PAYMENT_STATUS.PARTIAL,
  PAYMENT_STATUS.PAID,
  PAYMENT_STATUS.CANCELLED,
]);

const createPurchaseStatusEnum = z.enum([
  PURCHASE_STATUS.PENDING,
  PURCHASE_STATUS.RECEIVED,
]);

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);
const dateString = z.string().min(1).optional().or(z.literal(""));

export const createPurchaseItemSchema = z.object({
  inventoryId: z.string().min(1, "Inventory item is required"),
  medicineId: z.string().min(1, "Medicine is required"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  purchasePrice: z.coerce.number().min(0, "Purchase price must be zero or more"),
  sellingPrice: z.coerce.number().min(0, "Selling price must be zero or more"),
  expiryDate: dateString,
  batchNumber: z.string().trim().optional(),
});

export const createPurchaseSchema = z.object({
  supplierId: z.string().min(1, "Supplier is required"),
  invoiceNumber: z.string().trim().min(1, "Invoice number is required"),
  purchaseDate: z.string().min(1, "Purchase date is required"),
  vatAmount: z.coerce.number().min(0, "VAT amount must be zero or more").optional(),
  discount: z.coerce.number().min(0, "Discount must be zero or more").optional(),
  paidAmount: z.coerce.number().min(0, "Paid amount must be zero or more").optional(),
  purchaseStatus: createPurchaseStatusEnum.default(PURCHASE_STATUS.PENDING),
  note: z.string().trim().optional(),
  items: z.array(createPurchaseItemSchema).min(1, "Add at least one purchase item"),
});

export const purchaseQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  searchTerm: z.preprocess(emptyToUndefined, z.string().optional()),
  supplierId: z.preprocess(emptyToUndefined, z.string().optional()),
  paymentStatus: z.preprocess(emptyToUndefined, paymentStatusEnum.optional()),
  purchaseStatus: z.preprocess(emptyToUndefined, purchaseStatusEnum.optional()),
  dateFrom: z.preprocess(emptyToUndefined, z.string().optional()),
  dateTo: z.preprocess(emptyToUndefined, z.string().optional()),
  sortBy: z
    .enum(["createdAt", "purchaseDate", "invoiceNumber", "totalAmount", "paidAmount", "dueAmount"])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const updatePaymentSchema = z.object({
  paidAmount: z.coerce.number().min(0, "Paid amount must be zero or more"),
  paymentStatus: paymentStatusEnum.optional(),
});

export const updatePurchaseStatusSchema = z.object({
  purchaseStatus: purchaseStatusEnum,
});

export type CreatePurchaseInput = z.infer<typeof createPurchaseSchema>;
export type PurchaseQueryInput = z.infer<typeof purchaseQuerySchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
export type UpdatePurchaseStatusInput = z.infer<typeof updatePurchaseStatusSchema>;
