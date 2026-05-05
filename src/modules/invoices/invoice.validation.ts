import { z } from "zod";
import { PAYMENT_MODE, PAYMENT_STATUS } from "../../constant/enum";

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);

const paymentStatusEnum = z.enum([
  PAYMENT_STATUS.UNPAID,
  PAYMENT_STATUS.PARTIAL,
  PAYMENT_STATUS.PAID,
  PAYMENT_STATUS.CANCELLED,
]);

const paymentModeEnum = z.enum([
  PAYMENT_MODE.CASH,
  PAYMENT_MODE.CARD,
  PAYMENT_MODE.MOBILE_BANKING,
  PAYMENT_MODE.BANK_TRANSFER,
]);

const invoiceItemSchema = z.object({
  inventoryId: z.string().min(1, "Inventory item is required"),
  medicineId: z.string().min(1, "Medicine is required"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  unitPrice: z.coerce.number().min(0, "Unit price must be zero or more"),
  vat: z.coerce.number().min(0, "VAT must be zero or more").optional(),
  discount: z.coerce.number().min(0, "Discount must be zero or more").optional(),
});

export const createInvoiceSchema = z
  .object({
    customerId: z.preprocess(emptyToUndefined, z.string().optional()),
    invoiceNumber: z.string().trim().min(1, "Invoice number is required"),
    saleDate: z.string().min(1, "Sale date is required"),
    note: z.string().trim().optional(),
    paidAmount: z.coerce.number().min(0, "Paid amount must be zero or more").optional(),
    paymentMode: paymentModeEnum.optional(),
    paymentNote: z.string().trim().optional(),
    items: z.array(invoiceItemSchema).min(1, "Add at least one invoice item"),
  })
  .superRefine((data, ctx) => {
    if ((data.paidAmount ?? 0) > 0 && !data.paymentMode) {
      ctx.addIssue({
        code: "custom",
        message: "Payment mode is required when recording an initial payment",
        path: ["paymentMode"],
      });
    }
  });

export const invoiceQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  searchTerm: z.preprocess(emptyToUndefined, z.string().optional()),
  paymentStatus: z.preprocess(emptyToUndefined, paymentStatusEnum.optional()),
  dateFrom: z.preprocess(emptyToUndefined, z.string().optional()),
  dateTo: z.preprocess(emptyToUndefined, z.string().optional()),
  sortBy: z.enum(["createdAt", "saleDate", "invoiceNumber", "totalAmount", "paidAmount", "dueAmount"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const createPaymentSchema = z.object({
  amount: z.coerce.number().min(0.01, "Payment amount must be greater than zero"),
  paymentMode: paymentModeEnum,
  paymentDate: z.string().min(1, "Payment date is required"),
  note: z.string().trim().optional(),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type InvoiceQueryInput = z.infer<typeof invoiceQuerySchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
