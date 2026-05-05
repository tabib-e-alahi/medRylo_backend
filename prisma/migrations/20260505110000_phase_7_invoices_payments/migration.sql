-- AlterTable
ALTER TABLE "customers"
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "invoices"
ADD COLUMN     "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
ADD COLUMN     "createdByUserId" TEXT;

UPDATE "invoices"
SET "subtotal" = COALESCE("totalAmount", "netAmount", 0),
    "paymentStatus" = CASE
      WHEN "status" = 'CANCELLED' THEN 'CANCELLED'::"PaymentStatus"
      WHEN "dueAmount" <= 0 THEN 'PAID'::"PaymentStatus"
      WHEN "paidAmount" > 0 THEN 'PARTIAL'::"PaymentStatus"
      ELSE 'UNPAID'::"PaymentStatus"
    END;

-- AlterTable
ALTER TABLE "invoice_items"
ADD COLUMN     "inventoryId" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "pharmacyId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "paymentMode" "PaymentMode" NOT NULL DEFAULT 'CASH',
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "receivedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invoices_pharmacyId_invoiceNo_key" ON "invoices"("pharmacyId", "invoiceNo");

-- CreateIndex
CREATE INDEX "invoices_pharmacyId_paymentStatus_idx" ON "invoices"("pharmacyId", "paymentStatus");

-- CreateIndex
CREATE INDEX "invoices_customerId_idx" ON "invoices"("customerId");

-- CreateIndex
CREATE INDEX "invoice_items_inventoryId_idx" ON "invoice_items"("inventoryId");

-- CreateIndex
CREATE INDEX "invoice_items_medicineId_idx" ON "invoice_items"("medicineId");

-- CreateIndex
CREATE INDEX "payments_invoiceId_idx" ON "payments"("invoiceId");

-- CreateIndex
CREATE INDEX "payments_pharmacyId_idx" ON "payments"("pharmacyId");

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "pharmacy_inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_pharmacyId_fkey" FOREIGN KEY ("pharmacyId") REFERENCES "pharmacies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
