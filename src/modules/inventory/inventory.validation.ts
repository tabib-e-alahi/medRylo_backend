import { z } from "zod";
import { PHARMACY_INVENTORY_STATUS } from "../../constant/enum";

const statusEnum = z.enum([
  PHARMACY_INVENTORY_STATUS.ACTIVE,
  PHARMACY_INVENTORY_STATUS.INACTIVE,
  PHARMACY_INVENTORY_STATUS.ARCHIVED,
]);

const dateString = z.string().min(1).optional().or(z.literal(""));

export const createInventorySchema = z.object({
  medicineId: z.string().min(1, "Medicine is required"),
  batchNumber: z.string().trim().optional(),
  stockQuantity: z.coerce.number().int().min(0, "Stock quantity must be zero or more"),
  sellingPrice: z.coerce.number().min(0, "Selling price must be zero or more"),
  purchasePrice: z.coerce.number().min(0, "Purchase price must be zero or more").optional(),
  expiryDate: dateString,
  shelf: z.string().trim().optional(),
  lowStockAlertQuantity: z.coerce.number().int().min(0).optional(),
  status: statusEnum.optional(),
});

export const updateInventorySchema = createInventorySchema
  .omit({ medicineId: true })
  .partial()
  .extend({
    medicineId: z.string().min(1).optional(),
  });

export const inventoryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  searchTerm: z.string().optional(),
  categoryId: z.string().optional(),
  status: statusEnum.optional(),
  lowStock: z.coerce.boolean().optional(),
  expiringSoon: z.coerce.boolean().optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "stockQuantity", "sellingPrice", "expiryDate", "medicineName"])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const globalMedicineQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  searchTerm: z.string().optional(),
  categoryId: z.string().optional(),
  typeId: z.string().optional(),
  sortBy: z.enum(["createdAt", "name", "genericName", "price"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type CreateInventoryInput = z.infer<typeof createInventorySchema>;
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>;
export type InventoryQueryInput = z.infer<typeof inventoryQuerySchema>;
export type GlobalMedicineQueryInput = z.infer<typeof globalMedicineQuerySchema>;
