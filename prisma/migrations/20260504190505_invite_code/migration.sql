/*
  Warnings:

  - You are about to drop the column `isActive` on the `medicines` table. All the data in the column will be lost.
  - You are about to drop the column `vatPercent` on the `medicines` table. All the data in the column will be lost.
  - You are about to drop the column `company` on the `suppliers` table. All the data in the column will be lost.
  - You are about to drop the column `shortName` on the `units` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[inviteCode]` on the table `pharmacies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbol` to the `units` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MedicineStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DISCONTINUED');

-- DropForeignKey
ALTER TABLE "medicines" DROP CONSTRAINT "medicines_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "medicines" DROP CONSTRAINT "medicines_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "medicines" DROP CONSTRAINT "medicines_typeId_fkey";

-- DropForeignKey
ALTER TABLE "medicines" DROP CONSTRAINT "medicines_unitId_fkey";

-- DropIndex
DROP INDEX "categories_name_key";

-- DropIndex
DROP INDEX "suppliers_email_idx";

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "medicine_types" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "medicines" DROP COLUMN "isActive",
DROP COLUMN "vatPercent",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "leafSettingId" TEXT,
ADD COLUMN     "status" "MedicineStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "vat" DECIMAL(5,2) DEFAULT 0,
ALTER COLUMN "categoryId" DROP NOT NULL,
ALTER COLUMN "typeId" DROP NOT NULL,
ALTER COLUMN "supplierId" DROP NOT NULL,
ALTER COLUMN "unitId" DROP NOT NULL,
ALTER COLUMN "boxSize" SET DATA TYPE TEXT,
ALTER COLUMN "supplierPrice" DROP NOT NULL;

-- AlterTable
ALTER TABLE "pharmacies" ADD COLUMN     "inviteCode" TEXT;

-- AlterTable
ALTER TABLE "suppliers" DROP COLUMN "company",
ADD COLUMN     "contactPerson" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "phone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "units" DROP COLUMN "shortName",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "symbol" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "leaf_settings" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "leavesPerStrip" INTEGER NOT NULL,
    "stripsPerBox" INTEGER NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leaf_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "leaf_settings_name_key" ON "leaf_settings"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "pharmacies_inviteCode_key" ON "pharmacies"("inviteCode");

-- AddForeignKey
ALTER TABLE "medicines" ADD CONSTRAINT "medicines_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicines" ADD CONSTRAINT "medicines_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "medicine_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicines" ADD CONSTRAINT "medicines_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicines" ADD CONSTRAINT "medicines_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicines" ADD CONSTRAINT "medicines_leafSettingId_fkey" FOREIGN KEY ("leafSettingId") REFERENCES "leaf_settings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
