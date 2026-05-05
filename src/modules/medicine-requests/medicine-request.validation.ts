import { z } from "zod";
import { MEDICINE_REQUEST_STATUS } from "../../constant/enum";

const requestStatusEnum = z.enum([
  MEDICINE_REQUEST_STATUS.PENDING,
  MEDICINE_REQUEST_STATUS.APPROVED,
  MEDICINE_REQUEST_STATUS.REJECTED,
]);

export const createMedicineRequestSchema = z.object({
  requestedName: z.string().trim().min(1, "Medicine name is required"),
  genericName: z.string().trim().optional(),
  categorySuggestion: z.string().trim().optional(),
  typeSuggestion: z.string().trim().optional(),
  unitSuggestion: z.string().trim().optional(),
  strength: z.string().trim().optional(),
  companyName: z.string().trim().optional(),
  note: z.string().trim().optional(),
});

export const medicineRequestQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  searchTerm: z.string().optional(),
  status: requestStatusEnum.optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "requestedName", "status"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const approveMedicineRequestSchema = z.object({
  adminNote: z.string().trim().optional(),
  medicine: z
    .object({
      name: z.string().trim().optional(),
      genericName: z.string().trim().optional(),
      strength: z.string().trim().optional(),
      price: z.coerce.number().min(0).optional(),
      supplierPrice: z.coerce.number().min(0).optional(),
      categoryId: z.string().trim().optional(),
      typeId: z.string().trim().optional(),
      unitId: z.string().trim().optional(),
      supplierId: z.string().trim().optional(),
      description: z.string().trim().optional(),
    })
    .optional(),
});

export const rejectMedicineRequestSchema = z.object({
  adminNote: z.string().trim().min(1, "Rejection reason is required"),
});

export type CreateMedicineRequestInput = z.infer<typeof createMedicineRequestSchema>;
export type MedicineRequestQueryInput = z.infer<typeof medicineRequestQuerySchema>;
export type ApproveMedicineRequestInput = z.infer<typeof approveMedicineRequestSchema>;
export type RejectMedicineRequestInput = z.infer<typeof rejectMedicineRequestSchema>;
