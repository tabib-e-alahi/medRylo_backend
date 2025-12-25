-- DropForeignKey
ALTER TABLE "invoice_items"
DROP CONSTRAINT IF EXISTS "invoice_items_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "purchase_items"
DROP CONSTRAINT IF EXISTS "purchase_items_inventoryId_fkey";

-- DropIndex
DROP INDEX IF EXISTS "invoices_invoiceNo_key";

-- Alter invoice_items numeric columns only if table/columns exist
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'invoice_items'
      AND column_name = 'discount'
  ) THEN
    ALTER TABLE "invoice_items"
    ALTER COLUMN "discount" SET DATA TYPE DECIMAL(10,2);
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'invoice_items'
      AND column_name = 'vatPercent'
  ) THEN
    ALTER TABLE "invoice_items"
    ALTER COLUMN "vatPercent" SET DATA TYPE DECIMAL(10,2);
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'invoice_items'
      AND column_name = 'updatedAt'
  ) THEN
    ALTER TABLE "invoice_items"
    ALTER COLUMN "updatedAt" DROP DEFAULT;
  END IF;
END $$;

-- Alter purchase_items updatedAt only if column exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'purchase_items'
      AND column_name = 'updatedAt'
  ) THEN
    ALTER TABLE "purchase_items"
    ALTER COLUMN "updatedAt" DROP DEFAULT;
  END IF;
END $$;

-- Add purchase_items FK only if inventoryId column exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'purchase_items'
      AND column_name = 'inventoryId'
  ) THEN
    ALTER TABLE "purchase_items"
    ADD CONSTRAINT "purchase_items_inventoryId_fkey"
    FOREIGN KEY ("inventoryId")
    REFERENCES "pharmacy_inventory"("id")
    ON DELETE SET NULL
    ON UPDATE CASCADE;
  END IF;
END $$;

-- Add invoice_items FK only if inventoryId column exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'invoice_items'
      AND column_name = 'inventoryId'
  ) THEN
    ALTER TABLE "invoice_items"
    ADD CONSTRAINT "invoice_items_inventoryId_fkey"
    FOREIGN KEY ("inventoryId")
    REFERENCES "pharmacy_inventory"("id")
    ON DELETE SET NULL
    ON UPDATE CASCADE;
  END IF;
END $$;