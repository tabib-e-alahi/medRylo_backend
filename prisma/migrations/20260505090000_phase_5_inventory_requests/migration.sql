-- CreateEnum
CREATE TYPE "PharmacyInventoryStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MedicineRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropIndex
DROP INDEX "pharmacy_inventory_pharmacyId_medicineId_key";

-- AlterTable
ALTER TABLE "pharmacy_inventory"
ADD COLUMN     "batchNumber" TEXT,
ADD COLUMN     "purchasePrice" DECIMAL(10,2),
ADD COLUMN     "expiryDate" TIMESTAMP(3),
ADD COLUMN     "shelf" TEXT,
ADD COLUMN     "status" "PharmacyInventoryStatus" NOT NULL DEFAULT 'ACTIVE';

-- Preserve existing low-stock settings while moving to the Phase 5 field name.
ALTER TABLE "pharmacy_inventory" RENAME COLUMN "minStockLevel" TO "lowStockAlertQuantity";

UPDATE "pharmacy_inventory"
SET "status" = CASE WHEN "isActive" = true THEN 'ACTIVE'::"PharmacyInventoryStatus" ELSE 'INACTIVE'::"PharmacyInventoryStatus" END;

ALTER TABLE "pharmacy_inventory" DROP COLUMN "isActive";

-- CreateTable
CREATE TABLE "medicine_requests" (
    "id" TEXT NOT NULL,
    "pharmacyId" TEXT NOT NULL,
    "requestedName" TEXT NOT NULL,
    "genericName" TEXT,
    "categorySuggestion" TEXT,
    "typeSuggestion" TEXT,
    "unitSuggestion" TEXT,
    "strength" TEXT,
    "companyName" TEXT,
    "note" TEXT,
    "status" "MedicineRequestStatus" NOT NULL DEFAULT 'PENDING',
    "adminNote" TEXT,
    "medicineId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medicine_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pharmacy_inventory_pharmacyId_status_idx" ON "pharmacy_inventory"("pharmacyId", "status");

-- CreateIndex
CREATE INDEX "pharmacy_inventory_medicineId_idx" ON "pharmacy_inventory"("medicineId");

-- CreateIndex
CREATE INDEX "medicine_requests_pharmacyId_status_idx" ON "medicine_requests"("pharmacyId", "status");

-- CreateIndex
CREATE INDEX "medicine_requests_status_idx" ON "medicine_requests"("status");

-- AddForeignKey
ALTER TABLE "medicine_requests" ADD CONSTRAINT "medicine_requests_pharmacyId_fkey" FOREIGN KEY ("pharmacyId") REFERENCES "pharmacies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicine_requests" ADD CONSTRAINT "medicine_requests_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "medicines"("id") ON DELETE SET NULL ON UPDATE CASCADE;
