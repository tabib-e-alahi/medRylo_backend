-- AlterTable
ALTER TABLE "staff"
ADD COLUMN     "canManageInventory" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canManageSales" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "canManageCustomers" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "canViewReports" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canManagePurchases" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "staff_pharmacyId_isActive_idx" ON "staff"("pharmacyId", "isActive");
