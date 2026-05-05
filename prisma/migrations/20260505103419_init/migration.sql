-- DropForeignKey
ALTER TABLE "invoice_items" DROP CONSTRAINT "invoice_items_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "purchase_items" DROP CONSTRAINT "purchase_items_inventoryId_fkey";

-- DropIndex
DROP INDEX "invoices_invoiceNo_key";

-- AlterTable
ALTER TABLE "invoice_items" ALTER COLUMN "discount" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "vatPercent" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "purchase_items" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "purchase_items" ADD CONSTRAINT "purchase_items_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "pharmacy_inventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "pharmacy_inventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
