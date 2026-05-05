import { z } from "zod";

export const createUnitSchema = z.object({
  name: z.string().min(1, "Name is required"),
  symbol: z.string().min(1, "Symbol is required"),
  isActive: z.boolean().optional(),
});

export const updateUnitSchema = z.object({
  name: z.string().min(1).optional(),
  symbol: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
});

export type CreateUnitInput = z.infer<typeof createUnitSchema>;
export type UpdateUnitInput = z.infer<typeof updateUnitSchema>;
