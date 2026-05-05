import { z } from "zod";

export const createLeafSettingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  leavesPerStrip: z.number().int().min(1, "Leaves per strip must be at least 1"),
  stripsPerBox: z.number().int().min(1, "Strips per box must be at least 1"),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateLeafSettingSchema = z.object({
  name: z.string().min(1).optional(),
  leavesPerStrip: z.number().int().min(1).optional(),
  stripsPerBox: z.number().int().min(1).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type CreateLeafSettingInput = z.infer<typeof createLeafSettingSchema>;
export type UpdateLeafSettingInput = z.infer<typeof updateLeafSettingSchema>;
