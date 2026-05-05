import { z } from "zod";

const optionalString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().trim().optional()
);

const optionalNumber = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.coerce.number().min(0).optional()
);

export const publicMedicineQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(48).optional(),
  searchTerm: optionalString,
  categoryId: optionalString,
  typeId: optionalString,
  pharmacyId: optionalString,
  minPrice: optionalNumber,
  maxPrice: optionalNumber,
  availability: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.enum(["inStock", "lowStock"]).optional()
  ),
  sortBy: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.enum(["name", "price", "recent"]).optional()
  ),
  sortOrder: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.enum(["asc", "desc"]).optional()
  ),
});

export const publicPharmacyQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(48).optional(),
  searchTerm: optionalString,
  sortBy: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.enum(["name", "recent"]).optional()
  ),
  sortOrder: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.enum(["asc", "desc"]).optional()
  ),
});

export const publicIdParamSchema = z.object({
  id: z.string().min(1),
});

export type PublicMedicineQuery = z.infer<typeof publicMedicineQuerySchema>;
export type PublicPharmacyQuery = z.infer<typeof publicPharmacyQuerySchema>;
