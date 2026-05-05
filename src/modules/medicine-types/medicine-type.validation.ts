import { z } from "zod";

export const createMedicineTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateMedicineTypeSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type CreateMedicineTypeInput = z.infer<typeof createMedicineTypeSchema>;
export type UpdateMedicineTypeInput = z.infer<typeof updateMedicineTypeSchema>;
