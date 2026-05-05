import { z } from "zod";

const permissionSchema = {
  canManageInventory: z.coerce.boolean().optional(),
  canManageSales: z.coerce.boolean().optional(),
  canManageCustomers: z.coerce.boolean().optional(),
  canViewReports: z.coerce.boolean().optional(),
  canManagePurchases: z.coerce.boolean().optional(),
};

export const createStaffSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().trim().optional(),
  ...permissionSchema,
});

export const updateStaffSchema = z.object({
  name: z.string().trim().min(1).optional(),
  phone: z.string().trim().optional(),
  isActive: z.coerce.boolean().optional(),
  ...permissionSchema,
});

export const staffQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  searchTerm: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
});

export type CreateStaffInput = z.infer<typeof createStaffSchema>;
export type UpdateStaffInput = z.infer<typeof updateStaffSchema>;
export type StaffQueryInput = z.infer<typeof staffQuerySchema>;
