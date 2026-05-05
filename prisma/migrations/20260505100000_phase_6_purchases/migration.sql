-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PARTIAL', 'PAID', 'CANCELLED');

-- AlterTable
ALTER TABLE "purchases"
ADD COLUMN     "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "vatAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "discount" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
ADD COLUMN     "createdByUserId" TEXT;

UPDATE "purchases"
SET "subtotal" = "totalAmount",
    "paymentStatus" = CASE
      WHEN "status" = 'CANCELLED' THEN 'CANCELLED'::"PaymentStatus"
      WHEN "dueAmount" <= 0 THEN 'PAID'::"PaymentStatus"
      WHEN "paidAmount" > 0 THEN 'PARTIAL'::"PaymentStatus"
      ELSE 'UNPAID'::"PaymentStatus"
    END;

-- AlterTable
ALTER TABLE "purchase_items"
ADD COLUMN     "inventoryId" TEXT,
ADD COLUMN     "sellingPrice" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "expiryDate" TIMESTAMP(3),
ADD COLUMN     "batchNumber" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Existing pre-Phase-6 purchase items cannot safely identify a pharmacy inventory row.
-- This migration keeps the column nullable at SQL level for old rows; Phase 6 writes always provide it.

-- CreateIndex
CREATE UNIQUE INDEX "purchases_pharmacyId_invoiceNo_key" ON "purchases"("pharmacyId", "invoiceNo");

-- CreateIndex
CREATE INDEX "purchases_pharmacyId_status_idx" ON "purchases"("pharmacyId", "status");

-- CreateIndex
CREATE INDEX "purchases_supplierId_idx" ON "purchases"("supplierId");

-- CreateIndex
CREATE INDEX "purchase_items_inventoryId_idx" ON "purchase_items"("inventoryId");

-- CreateIndex
CREATE INDEX "purchase_items_medicineId_idx" ON "purchase_items"("medicineId");

-- AddForeignKey
ALTER TABLE "purchase_items" ADD CONSTRAINT "purchase_items_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "pharmacy_inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
