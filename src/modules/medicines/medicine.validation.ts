import { z } from "zod";
import { MEDICINE_STATUS } from "../../constant/enum";

export const createMedicineSchema = z.object({
  name: z.string().min(1, "Name is required"),
  genericName: z.string().optional(),
  strength: z.string().optional(),
  boxSize: z.string().optional(),
  shelf: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  supplierPrice: z.coerce.number().min(0, "Supplier price must be positive").optional(),
  vat: z.coerce.number().min(0, "VAT must be positive").optional(),
  expiryDate: z.string().datetime().optional().or(z.literal("")),
  stockQuantity: z.coerce.number().int().min(0).optional(),
  description: z.string().optional(),
  status: z.enum([
    MEDICINE_STATUS.ACTIVE,
    MEDICINE_STATUS.INACTIVE,
    MEDICINE_STATUS.DISCONTINUED,
  ]).optional(),
  categoryId: z.string().optional(),
  typeId: z.string().optional(),
  supplierId: z.string().optional(),
  unitId: z.string().optional(),
  leafSettingId: z.string().optional(),
});

export const updateMedicineSchema = z.object({
  name: z.string().min(1).optional(),
  genericName: z.string().optional(),
  strength: z.string().optional(),
  boxSize: z.string().optional(),
  shelf: z.string().optional(),
  price: z.coerce.number().min(0).optional(),
  supplierPrice: z.coerce.number().min(0).optional(),
  vat: z.coerce.number().min(0).optional(),
  expiryDate: z.string().datetime().optional().or(z.literal("")),
  stockQuantity: z.coerce.number().int().min(0).optional(),
  description: z.string().optional(),
  status: z.enum([
    MEDICINE_STATUS.ACTIVE,
    MEDICINE_STATUS.INACTIVE,
    MEDICINE_STATUS.DISCONTINUED,
  ]).optional(),
  categoryId: z.string().optional(),
  typeId: z.string().optional(),
  supplierId: z.string().optional(),
  unitId: z.string().optional(),
  leafSettingId: z.string().optional(),
  image: z.string().optional(),
  removeImage: z.coerce.boolean().optional(),
});

export type CreateMedicineInput = z.infer<typeof createMedicineSchema>;
export type UpdateMedicineInput = z.infer<typeof updateMedicineSchema>;
