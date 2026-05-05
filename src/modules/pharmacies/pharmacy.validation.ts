import { z } from "zod";

export const resubmitPharmacySchema = z.object({
  name: z.string().min(2).optional(),
  licenseNumber: z.string().min(2).optional(),
  binVat: z.string().optional(),
  pharmacyType: z.enum(["RETAIL", "WHOLESALE", "HOSPITAL", "CLINIC"]).optional(),
  establishedYear: z.number().optional(),
  staffCount: z.number().optional(),
  openingHours: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  logo: z.string().url().optional().or(z.literal("")),
});

export const approvePharmacySchema = z.object({
  id: z.string().uuid(),
});

export const rejectPharmacySchema = z.object({
  id: z.string().uuid(),
  reason: z.string().min(5, "Reason must be at least 5 characters"),
});
