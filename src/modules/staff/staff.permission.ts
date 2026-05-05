import { ForbiddenError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";

export type StaffPermission =
  | "canManageInventory"
  | "canManageSales"
  | "canManageCustomers"
  | "canViewReports"
  | "canManagePurchases";

export async function assertStaffPermission(userId: string, permission: StaffPermission) {
  const staff = await prisma.staff.findUnique({
    where: { userId },
  });

  if (!staff || staff.isDeleted || !staff.isActive) {
    throw new ForbiddenError("This staff account is inactive or not assigned to a pharmacy.");
  }

  if (!staff[permission]) {
    throw new ForbiddenError("You do not have permission to perform this staff action.");
  }

  return staff;
}
