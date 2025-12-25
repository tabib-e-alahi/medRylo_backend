-- DropForeignKey
ALTER TABLE "invoice_items" DROP CONSTRAINT "invoice_items_inventoryId_fkey";

-- AlterTable
ALTER TABLE "invoice_items" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "pharmacy_inventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
