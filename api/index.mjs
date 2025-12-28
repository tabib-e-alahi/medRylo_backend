var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/config/route.config.ts
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });
var envConfig = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 5e3,
  DATABASE_URL: process.env.DATABASE_URL,
  BACKEND_BASE_URL: process.env.BACKEND_BASE_URL,
  BACKEND_URL: process.env.BACKEND_URL,
  FRONTEND_URL: process.env.FRONTEND_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  DEMO_USER_PASSWORD: process.env.DEMO_USER_PASSWORD || "DemoPass@2024!",
  CLAUDINARY_CLOUD_NAME: process.env.CLAUDINARY_CLOUD_NAME,
  CLAUDINARY_API_KEY: process.env.CLAUDINARY_API_KEY,
  CLAUDINARY_API_SECRET: process.env.CLAUDINARY_API_SECRET,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: Number(process.env.SMTP_PORT) || 2525,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM,
  SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL,
  ADMIN_Name: process.env.ADMIN_Name,
  ADMIN_Email: process.env.ADMIN_Email,
  ADMIN_Password: process.env.ADMIN_Password,
  PHARMACY_Name: process.env.PHARMACY_Name,
  PHARMACY_Email: process.env.PHARMACY_Email,
  PHARMACY_Password: process.env.PHARMACY_Password,
  STAFF_Name: process.env.STAFF_Name,
  STAFF_Email: process.env.STAFF_Email,
  STAFF_Password: process.env.STAFF_Password,
  USER_Name: process.env.USER_Name,
  USER_Email: process.env.USER_Email,
  USER_Password: process.env.USER_Password,
  PENDING_OWNER_EMAIL: process.env.PENDING_OWNER_EMAIL,
  REJECTED_OWNER_EMAIL: process.env.REJECTED_OWNER_EMAIL
};
var route_config_default = envConfig;

// generated/prisma/client.ts
import * as path2 from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.8.0",
  "engineVersion": "3c6e192761c0362d496ed980de936e2f3cebcd3a",
  "activeProvider": "postgresql",
  "inlineSchema": 'model User {\n  id                 String            @id\n  name               String\n  email              String\n  emailVerified      Boolean           @default(false)\n  image              String?\n  imagePublicId      String?\n  role               UserRole          @default(USER)\n  status             UserAccountStatus @default(ACTIVE)\n  phone              String?\n  needPasswordChange Boolean           @default(false)\n  isDeleted          Boolean           @default(false)\n  deletedAt          DateTime?\n  createdAt          DateTime          @default(now())\n  updatedAt          DateTime          @updatedAt\n  sessions           Session[]\n  accounts           Account[]\n  pharmacy           Pharmacy?         @relation("PharmacyOwner")\n  staffProfile       Staff?\n  verifications      Verification[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n  user       User?    @relation(fields: [userId], references: [id])\n  userId     String?\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nenum UserRole {\n  ADMIN\n  PHARMACY\n  STAFF\n  USER\n}\n\nenum UserAccountStatus {\n  ACTIVE\n  SUSPENDED\n}\n\nenum MedicineStatus {\n  ACTIVE\n  INACTIVE\n  DISCONTINUED\n}\n\nenum PharmacyInventoryStatus {\n  ACTIVE\n  INACTIVE\n  ARCHIVED\n}\n\nenum MedicineRequestStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nenum PharmacyStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nenum PharmacyType {\n  RETAIL\n  WHOLESALE\n  HOSPITAL\n  CLINIC\n}\n\nenum PurchaseStatus {\n  PENDING\n  RECEIVED\n  PARTIAL\n  CANCELLED\n}\n\nenum PaymentStatus {\n  UNPAID\n  PARTIAL\n  PAID\n  CANCELLED\n}\n\nenum InvoiceStatus {\n  DRAFT\n  ISSUED\n  PAID\n  PARTIAL\n  CANCELLED\n}\n\nenum PaymentMode {\n  CASH\n  CARD\n  MOBILE_BANKING\n  BANK_TRANSFER\n}\n\n// \u2500\u2500 LeafSetting \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n// Tracks packaging format (e.g. "10 leaves / 10 strips per box")\nmodel LeafSetting {\n  id             String    @id @default(cuid())\n  name           String    @unique\n  leavesPerStrip Int\n  stripsPerBox   Int\n  description    String?\n  isActive       Boolean   @default(true)\n  isDeleted      Boolean   @default(false)\n  deletedAt      DateTime?\n  createdAt      DateTime  @default(now())\n  updatedAt      DateTime  @updatedAt\n\n  medicines Medicine[]\n\n  @@map("leaf_settings")\n}\n\nmodel Medicine {\n  id            String         @id @default(cuid())\n  name          String\n  genericName   String?\n  strength      String?\n  boxSize       String?\n  shelf         String?\n  price         Decimal        @db.Decimal(10, 2)\n  supplierPrice Decimal?       @db.Decimal(10, 2)\n  vat           Decimal?       @default(0) @db.Decimal(5, 2)\n  expiryDate    DateTime?\n  stockQuantity Int            @default(0)\n  image         String?\n  imagePublicId String?\n  description   String?\n  status        MedicineStatus @default(ACTIVE)\n  isDeleted     Boolean        @default(false)\n  deletedAt     DateTime?\n  createdAt     DateTime       @default(now())\n  updatedAt     DateTime       @updatedAt\n\n  categoryId String?\n  category   Category? @relation(fields: [categoryId], references: [id])\n\n  typeId String?\n  type   MedicineType? @relation(fields: [typeId], references: [id])\n\n  supplierId String?\n  supplier   Supplier? @relation(fields: [supplierId], references: [id])\n\n  unitId String?\n  unit   Unit?   @relation(fields: [unitId], references: [id])\n\n  leafSettingId String?\n  leafSetting   LeafSetting? @relation(fields: [leafSettingId], references: [id])\n\n  inventory     PharmacyInventory[]\n  requests      MedicineRequest[]\n  purchaseItems PurchaseItem[]\n  invoiceItems  InvoiceItem[]\n\n  @@map("medicines")\n}\n\nmodel Category {\n  id          String    @id @default(cuid())\n  name        String\n  slug        String    @unique\n  description String?\n  isActive    Boolean   @default(true)\n  isDeleted   Boolean   @default(false)\n  deletedAt   DateTime?\n  createdAt   DateTime  @default(now())\n  updatedAt   DateTime  @updatedAt\n\n  medicines Medicine[]\n\n  @@map("categories")\n}\n\nmodel MedicineType {\n  id          String    @id @default(cuid())\n  name        String    @unique\n  description String?\n  isActive    Boolean   @default(true)\n  isDeleted   Boolean   @default(false)\n  deletedAt   DateTime?\n  createdAt   DateTime  @default(now())\n  updatedAt   DateTime  @updatedAt\n\n  medicines Medicine[]\n\n  @@map("medicine_types")\n}\n\nmodel Unit {\n  id        String    @id @default(cuid())\n  name      String    @unique\n  symbol    String\n  isActive  Boolean   @default(true)\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n\n  medicines Medicine[]\n\n  @@map("units")\n}\n\nmodel PharmacyInventory {\n  id                    String                  @id @default(cuid())\n  pharmacyId            String\n  medicineId            String\n  batchNumber           String?\n  stockQuantity         Int                     @default(0)\n  sellingPrice          Decimal                 @db.Decimal(10, 2)\n  purchasePrice         Decimal?                @db.Decimal(10, 2)\n  expiryDate            DateTime?\n  shelf                 String?\n  lowStockAlertQuantity Int                     @default(10)\n  status                PharmacyInventoryStatus @default(ACTIVE)\n  createdAt             DateTime                @default(now())\n  updatedAt             DateTime                @updatedAt\n\n  pharmacy      Pharmacy       @relation(fields: [pharmacyId], references: [id], onDelete: Cascade)\n  medicine      Medicine       @relation(fields: [medicineId], references: [id])\n  purchaseItems PurchaseItem[]\n  invoiceItems  InvoiceItem[]\n\n  @@index([pharmacyId, status])\n  @@index([medicineId])\n  @@map("pharmacy_inventory")\n}\n\nmodel MedicineRequest {\n  id                 String                @id @default(cuid())\n  pharmacyId         String\n  requestedName      String\n  genericName        String?\n  categorySuggestion String?\n  typeSuggestion     String?\n  unitSuggestion     String?\n  strength           String?\n  companyName        String?\n  note               String?\n  status             MedicineRequestStatus @default(PENDING)\n  adminNote          String?\n  medicineId         String?\n  createdAt          DateTime              @default(now())\n  updatedAt          DateTime              @updatedAt\n\n  pharmacy Pharmacy  @relation(fields: [pharmacyId], references: [id], onDelete: Cascade)\n  medicine Medicine? @relation(fields: [medicineId], references: [id], onDelete: SetNull)\n\n  @@index([pharmacyId, status])\n  @@index([status])\n  @@map("medicine_requests")\n}\n\nmodel Pharmacy {\n  id              String         @id @default(uuid())\n  ownerId         String         @unique\n  name            String\n  licenseNumber   String         @unique\n  binVat          String?\n  pharmacyType    PharmacyType   @default(RETAIL)\n  establishedYear Int?\n  staffCount      Int?\n  openingHours    String?\n  website         String?\n  phone           String\n  address         String\n  logo            String?\n  logoPublicId    String?\n  status          PharmacyStatus @default(PENDING)\n  rejectionReason String?\n  inviteCode      String?        @unique\n  createdAt       DateTime       @default(now())\n  updatedAt       DateTime       @updatedAt\n\n  // Relations\n  owner            User                @relation("PharmacyOwner", fields: [ownerId], references: [id])\n  staff            Staff[]\n  inventory        PharmacyInventory[]\n  medicineRequests MedicineRequest[]\n  purchases        Purchase[]\n  invoices         Invoice[]\n  customers        Customer[]\n  payments         Payment[]\n\n  @@map("pharmacies")\n}\n\nmodel Staff {\n  id                 String    @id @default(uuid())\n  userId             String    @unique\n  pharmacyId         String\n  canManageInventory Boolean   @default(false)\n  canManageSales     Boolean   @default(true)\n  canManageCustomers Boolean   @default(true)\n  canViewReports     Boolean   @default(false)\n  canManagePurchases Boolean   @default(false)\n  isActive           Boolean   @default(true)\n  isDeleted          Boolean   @default(false)\n  deletedAt          DateTime?\n  createdAt          DateTime  @default(now())\n  updatedAt          DateTime  @updatedAt\n\n  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  pharmacy Pharmacy @relation(fields: [pharmacyId], references: [id], onDelete: Cascade)\n\n  @@index([pharmacyId, isActive])\n  @@map("staff")\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Supplier {\n  id            String    @id @default(cuid())\n  name          String\n  contactPerson String?\n  email         String?   @unique\n  phone         String?\n  address       String?\n  isActive      Boolean   @default(true)\n  isDeleted     Boolean   @default(false)\n  deletedAt     DateTime?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n\n  medicines Medicine[]\n  purchases Purchase[]\n\n  @@map("suppliers")\n}\n\nmodel Customer {\n  id         String    @id @default(cuid())\n  pharmacyId String\n  name       String\n  email      String?\n  phone      String?\n  address    String?\n  isDeleted  Boolean   @default(false)\n  deletedAt  DateTime?\n  createdAt  DateTime  @default(now())\n  updatedAt  DateTime  @updatedAt\n\n  pharmacy Pharmacy  @relation(fields: [pharmacyId], references: [id], onDelete: Cascade)\n  invoices Invoice[]\n\n  @@map("customers")\n}\n\nmodel Purchase {\n  id              String         @id @default(cuid())\n  pharmacyId      String\n  supplierId      String\n  invoiceNumber   String         @map("invoiceNo")\n  purchaseDate    DateTime       @default(now())\n  subtotal        Decimal        @default(0) @db.Decimal(12, 2)\n  vatAmount       Decimal        @default(0) @db.Decimal(12, 2)\n  discount        Decimal        @default(0) @db.Decimal(12, 2)\n  totalAmount     Decimal        @db.Decimal(12, 2)\n  paidAmount      Decimal        @default(0) @db.Decimal(12, 2)\n  dueAmount       Decimal        @default(0) @db.Decimal(12, 2)\n  paymentStatus   PaymentStatus  @default(UNPAID)\n  purchaseStatus  PurchaseStatus @default(PENDING) @map("status")\n  note            String?        @map("notes")\n  createdByUserId String?\n  createdAt       DateTime       @default(now())\n  updatedAt       DateTime       @updatedAt\n\n  pharmacy Pharmacy       @relation(fields: [pharmacyId], references: [id], onDelete: Cascade)\n  supplier Supplier       @relation(fields: [supplierId], references: [id])\n  items    PurchaseItem[]\n\n  @@unique([pharmacyId, invoiceNumber])\n  @@index([pharmacyId, purchaseStatus])\n  @@index([supplierId])\n  @@map("purchases")\n}\n\nmodel PurchaseItem {\n  id            String    @id @default(cuid())\n  purchaseId    String\n  inventoryId   String?\n  medicineId    String\n  quantity      Int\n  purchasePrice Decimal   @map("unitPrice") @db.Decimal(10, 2)\n  sellingPrice  Decimal   @default(0) @db.Decimal(10, 2)\n  expiryDate    DateTime?\n  batchNumber   String?\n  total         Decimal   @map("totalPrice") @db.Decimal(10, 2)\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n\n  purchase  Purchase           @relation(fields: [purchaseId], references: [id], onDelete: Cascade)\n  inventory PharmacyInventory? @relation(fields: [inventoryId], references: [id])\n  medicine  Medicine           @relation(fields: [medicineId], references: [id])\n\n  @@index([inventoryId])\n  @@index([medicineId])\n  @@map("purchase_items")\n}\n\nmodel Invoice {\n  id              String        @id @default(cuid())\n  pharmacyId      String\n  customerId      String?\n  invoiceNumber   String        @map("invoiceNo")\n  saleDate        DateTime      @default(now()) @map("invoiceDate")\n  subtotal        Decimal       @default(0) @db.Decimal(12, 2)\n  vatAmount       Decimal       @default(0) @db.Decimal(10, 2)\n  discount        Decimal       @default(0) @db.Decimal(10, 2)\n  totalAmount     Decimal       @db.Decimal(12, 2)\n  netAmount       Decimal       @db.Decimal(12, 2)\n  paidAmount      Decimal       @default(0) @db.Decimal(12, 2)\n  dueAmount       Decimal       @default(0) @db.Decimal(12, 2)\n  paymentMode     PaymentMode   @default(CASH)\n  paymentStatus   PaymentStatus @default(UNPAID)\n  status          InvoiceStatus @default(DRAFT)\n  note            String?       @map("notes")\n  createdByUserId String?\n  createdAt       DateTime      @default(now())\n  updatedAt       DateTime      @updatedAt\n\n  pharmacy Pharmacy      @relation(fields: [pharmacyId], references: [id], onDelete: Cascade)\n  customer Customer?     @relation(fields: [customerId], references: [id])\n  items    InvoiceItem[]\n  payments Payment[]\n\n  @@unique([pharmacyId, invoiceNumber])\n  @@index([pharmacyId, paymentStatus])\n  @@index([customerId])\n  @@map("invoices")\n}\n\nmodel InvoiceItem {\n  id          String   @id @default(cuid())\n  invoiceId   String\n  inventoryId String?\n  medicineId  String\n  quantity    Int\n  unitPrice   Decimal  @db.Decimal(10, 2)\n  vat         Decimal  @default(0) @map("vatPercent") @db.Decimal(10, 2)\n  discount    Decimal  @default(0) @db.Decimal(10, 2)\n  total       Decimal  @map("totalPrice") @db.Decimal(10, 2)\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  invoice   Invoice            @relation(fields: [invoiceId], references: [id], onDelete: Cascade)\n  inventory PharmacyInventory? @relation(fields: [inventoryId], references: [id])\n  medicine  Medicine           @relation(fields: [medicineId], references: [id])\n\n  @@index([inventoryId])\n  @@index([medicineId])\n  @@map("invoice_items")\n}\n\nmodel Payment {\n  id               String      @id @default(cuid())\n  invoiceId        String\n  pharmacyId       String\n  amount           Decimal     @db.Decimal(12, 2)\n  paymentMode      PaymentMode @default(CASH)\n  paymentDate      DateTime    @default(now())\n  note             String?\n  receivedByUserId String?\n  createdAt        DateTime    @default(now())\n  updatedAt        DateTime    @updatedAt\n\n  invoice  Invoice  @relation(fields: [invoiceId], references: [id], onDelete: Cascade)\n  pharmacy Pharmacy @relation(fields: [pharmacyId], references: [id], onDelete: Cascade)\n\n  @@index([invoiceId])\n  @@index([pharmacyId])\n  @@map("payments")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"imagePublicId","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"status","kind":"enum","type":"UserAccountStatus"},{"name":"phone","kind":"scalar","type":"String"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"pharmacy","kind":"object","type":"Pharmacy","relationName":"PharmacyOwner"},{"name":"staffProfile","kind":"object","type":"Staff","relationName":"StaffToUser"},{"name":"verifications","kind":"object","type":"Verification","relationName":"UserToVerification"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"UserToVerification"},{"name":"userId","kind":"scalar","type":"String"}],"dbName":"verification"},"LeafSetting":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"leavesPerStrip","kind":"scalar","type":"Int"},{"name":"stripsPerBox","kind":"scalar","type":"Int"},{"name":"description","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"LeafSettingToMedicine"}],"dbName":"leaf_settings"},"Medicine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"genericName","kind":"scalar","type":"String"},{"name":"strength","kind":"scalar","type":"String"},{"name":"boxSize","kind":"scalar","type":"String"},{"name":"shelf","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"supplierPrice","kind":"scalar","type":"Decimal"},{"name":"vat","kind":"scalar","type":"Decimal"},{"name":"expiryDate","kind":"scalar","type":"DateTime"},{"name":"stockQuantity","kind":"scalar","type":"Int"},{"name":"image","kind":"scalar","type":"String"},{"name":"imagePublicId","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"MedicineStatus"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMedicine"},{"name":"typeId","kind":"scalar","type":"String"},{"name":"type","kind":"object","type":"MedicineType","relationName":"MedicineToMedicineType"},{"name":"supplierId","kind":"scalar","type":"String"},{"name":"supplier","kind":"object","type":"Supplier","relationName":"MedicineToSupplier"},{"name":"unitId","kind":"scalar","type":"String"},{"name":"unit","kind":"object","type":"Unit","relationName":"MedicineToUnit"},{"name":"leafSettingId","kind":"scalar","type":"String"},{"name":"leafSetting","kind":"object","type":"LeafSetting","relationName":"LeafSettingToMedicine"},{"name":"inventory","kind":"object","type":"PharmacyInventory","relationName":"MedicineToPharmacyInventory"},{"name":"requests","kind":"object","type":"MedicineRequest","relationName":"MedicineToMedicineRequest"},{"name":"purchaseItems","kind":"object","type":"PurchaseItem","relationName":"MedicineToPurchaseItem"},{"name":"invoiceItems","kind":"object","type":"InvoiceItem","relationName":"InvoiceItemToMedicine"}],"dbName":"medicines"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"CategoryToMedicine"}],"dbName":"categories"},"MedicineType":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"MedicineToMedicineType"}],"dbName":"medicine_types"},"Unit":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"symbol","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"MedicineToUnit"}],"dbName":"units"},"PharmacyInventory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"pharmacyId","kind":"scalar","type":"String"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"batchNumber","kind":"scalar","type":"String"},{"name":"stockQuantity","kind":"scalar","type":"Int"},{"name":"sellingPrice","kind":"scalar","type":"Decimal"},{"name":"purchasePrice","kind":"scalar","type":"Decimal"},{"name":"expiryDate","kind":"scalar","type":"DateTime"},{"name":"shelf","kind":"scalar","type":"String"},{"name":"lowStockAlertQuantity","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"PharmacyInventoryStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"pharmacy","kind":"object","type":"Pharmacy","relationName":"PharmacyToPharmacyInventory"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToPharmacyInventory"},{"name":"purchaseItems","kind":"object","type":"PurchaseItem","relationName":"PharmacyInventoryToPurchaseItem"},{"name":"invoiceItems","kind":"object","type":"InvoiceItem","relationName":"InvoiceItemToPharmacyInventory"}],"dbName":"pharmacy_inventory"},"MedicineRequest":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"pharmacyId","kind":"scalar","type":"String"},{"name":"requestedName","kind":"scalar","type":"String"},{"name":"genericName","kind":"scalar","type":"String"},{"name":"categorySuggestion","kind":"scalar","type":"String"},{"name":"typeSuggestion","kind":"scalar","type":"String"},{"name":"unitSuggestion","kind":"scalar","type":"String"},{"name":"strength","kind":"scalar","type":"String"},{"name":"companyName","kind":"scalar","type":"String"},{"name":"note","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"MedicineRequestStatus"},{"name":"adminNote","kind":"scalar","type":"String"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"pharmacy","kind":"object","type":"Pharmacy","relationName":"MedicineRequestToPharmacy"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToMedicineRequest"}],"dbName":"medicine_requests"},"Pharmacy":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"ownerId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"licenseNumber","kind":"scalar","type":"String"},{"name":"binVat","kind":"scalar","type":"String"},{"name":"pharmacyType","kind":"enum","type":"PharmacyType"},{"name":"establishedYear","kind":"scalar","type":"Int"},{"name":"staffCount","kind":"scalar","type":"Int"},{"name":"openingHours","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"logo","kind":"scalar","type":"String"},{"name":"logoPublicId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PharmacyStatus"},{"name":"rejectionReason","kind":"scalar","type":"String"},{"name":"inviteCode","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"owner","kind":"object","type":"User","relationName":"PharmacyOwner"},{"name":"staff","kind":"object","type":"Staff","relationName":"PharmacyToStaff"},{"name":"inventory","kind":"object","type":"PharmacyInventory","relationName":"PharmacyToPharmacyInventory"},{"name":"medicineRequests","kind":"object","type":"MedicineRequest","relationName":"MedicineRequestToPharmacy"},{"name":"purchases","kind":"object","type":"Purchase","relationName":"PharmacyToPurchase"},{"name":"invoices","kind":"object","type":"Invoice","relationName":"InvoiceToPharmacy"},{"name":"customers","kind":"object","type":"Customer","relationName":"CustomerToPharmacy"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToPharmacy"}],"dbName":"pharmacies"},"Staff":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"pharmacyId","kind":"scalar","type":"String"},{"name":"canManageInventory","kind":"scalar","type":"Boolean"},{"name":"canManageSales","kind":"scalar","type":"Boolean"},{"name":"canManageCustomers","kind":"scalar","type":"Boolean"},{"name":"canViewReports","kind":"scalar","type":"Boolean"},{"name":"canManagePurchases","kind":"scalar","type":"Boolean"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"StaffToUser"},{"name":"pharmacy","kind":"object","type":"Pharmacy","relationName":"PharmacyToStaff"}],"dbName":"staff"},"Supplier":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"contactPerson","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"MedicineToSupplier"},{"name":"purchases","kind":"object","type":"Purchase","relationName":"PurchaseToSupplier"}],"dbName":"suppliers"},"Customer":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"pharmacyId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"pharmacy","kind":"object","type":"Pharmacy","relationName":"CustomerToPharmacy"},{"name":"invoices","kind":"object","type":"Invoice","relationName":"CustomerToInvoice"}],"dbName":"customers"},"Purchase":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"pharmacyId","kind":"scalar","type":"String"},{"name":"supplierId","kind":"scalar","type":"String"},{"name":"invoiceNumber","kind":"scalar","type":"String","dbName":"invoiceNo"},{"name":"purchaseDate","kind":"scalar","type":"DateTime"},{"name":"subtotal","kind":"scalar","type":"Decimal"},{"name":"vatAmount","kind":"scalar","type":"Decimal"},{"name":"discount","kind":"scalar","type":"Decimal"},{"name":"totalAmount","kind":"scalar","type":"Decimal"},{"name":"paidAmount","kind":"scalar","type":"Decimal"},{"name":"dueAmount","kind":"scalar","type":"Decimal"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"purchaseStatus","kind":"enum","type":"PurchaseStatus","dbName":"status"},{"name":"note","kind":"scalar","type":"String","dbName":"notes"},{"name":"createdByUserId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"pharmacy","kind":"object","type":"Pharmacy","relationName":"PharmacyToPurchase"},{"name":"supplier","kind":"object","type":"Supplier","relationName":"PurchaseToSupplier"},{"name":"items","kind":"object","type":"PurchaseItem","relationName":"PurchaseToPurchaseItem"}],"dbName":"purchases"},"PurchaseItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"purchaseId","kind":"scalar","type":"String"},{"name":"inventoryId","kind":"scalar","type":"String"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"purchasePrice","kind":"scalar","type":"Decimal","dbName":"unitPrice"},{"name":"sellingPrice","kind":"scalar","type":"Decimal"},{"name":"expiryDate","kind":"scalar","type":"DateTime"},{"name":"batchNumber","kind":"scalar","type":"String"},{"name":"total","kind":"scalar","type":"Decimal","dbName":"totalPrice"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"purchase","kind":"object","type":"Purchase","relationName":"PurchaseToPurchaseItem"},{"name":"inventory","kind":"object","type":"PharmacyInventory","relationName":"PharmacyInventoryToPurchaseItem"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToPurchaseItem"}],"dbName":"purchase_items"},"Invoice":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"pharmacyId","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"invoiceNumber","kind":"scalar","type":"String","dbName":"invoiceNo"},{"name":"saleDate","kind":"scalar","type":"DateTime","dbName":"invoiceDate"},{"name":"subtotal","kind":"scalar","type":"Decimal"},{"name":"vatAmount","kind":"scalar","type":"Decimal"},{"name":"discount","kind":"scalar","type":"Decimal"},{"name":"totalAmount","kind":"scalar","type":"Decimal"},{"name":"netAmount","kind":"scalar","type":"Decimal"},{"name":"paidAmount","kind":"scalar","type":"Decimal"},{"name":"dueAmount","kind":"scalar","type":"Decimal"},{"name":"paymentMode","kind":"enum","type":"PaymentMode"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"status","kind":"enum","type":"InvoiceStatus"},{"name":"note","kind":"scalar","type":"String","dbName":"notes"},{"name":"createdByUserId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"pharmacy","kind":"object","type":"Pharmacy","relationName":"InvoiceToPharmacy"},{"name":"customer","kind":"object","type":"Customer","relationName":"CustomerToInvoice"},{"name":"items","kind":"object","type":"InvoiceItem","relationName":"InvoiceToInvoiceItem"},{"name":"payments","kind":"object","type":"Payment","relationName":"InvoiceToPayment"}],"dbName":"invoices"},"InvoiceItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"invoiceId","kind":"scalar","type":"String"},{"name":"inventoryId","kind":"scalar","type":"String"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"unitPrice","kind":"scalar","type":"Decimal"},{"name":"vat","kind":"scalar","type":"Decimal","dbName":"vatPercent"},{"name":"discount","kind":"scalar","type":"Decimal"},{"name":"total","kind":"scalar","type":"Decimal","dbName":"totalPrice"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"invoice","kind":"object","type":"Invoice","relationName":"InvoiceToInvoiceItem"},{"name":"inventory","kind":"object","type":"PharmacyInventory","relationName":"InvoiceItemToPharmacyInventory"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"InvoiceItemToMedicine"}],"dbName":"invoice_items"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"invoiceId","kind":"scalar","type":"String"},{"name":"pharmacyId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"paymentMode","kind":"enum","type":"PaymentMode"},{"name":"paymentDate","kind":"scalar","type":"DateTime"},{"name":"note","kind":"scalar","type":"String"},{"name":"receivedByUserId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"invoice","kind":"object","type":"Invoice","relationName":"InvoiceToPayment"},{"name":"pharmacy","kind":"object","type":"Pharmacy","relationName":"PaymentToPharmacy"}],"dbName":"payments"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","owner","pharmacy","staff","medicines","_count","category","type","supplier","purchase","inventory","medicine","items","purchases","unit","leafSetting","requests","purchaseItems","invoices","customer","invoice","payments","invoiceItems","medicineRequests","customers","staffProfile","verifications","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","LeafSetting.findUnique","LeafSetting.findUniqueOrThrow","LeafSetting.findFirst","LeafSetting.findFirstOrThrow","LeafSetting.findMany","LeafSetting.createOne","LeafSetting.createMany","LeafSetting.createManyAndReturn","LeafSetting.updateOne","LeafSetting.updateMany","LeafSetting.updateManyAndReturn","LeafSetting.upsertOne","LeafSetting.deleteOne","LeafSetting.deleteMany","_avg","_sum","LeafSetting.groupBy","LeafSetting.aggregate","Medicine.findUnique","Medicine.findUniqueOrThrow","Medicine.findFirst","Medicine.findFirstOrThrow","Medicine.findMany","Medicine.createOne","Medicine.createMany","Medicine.createManyAndReturn","Medicine.updateOne","Medicine.updateMany","Medicine.updateManyAndReturn","Medicine.upsertOne","Medicine.deleteOne","Medicine.deleteMany","Medicine.groupBy","Medicine.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","MedicineType.findUnique","MedicineType.findUniqueOrThrow","MedicineType.findFirst","MedicineType.findFirstOrThrow","MedicineType.findMany","MedicineType.createOne","MedicineType.createMany","MedicineType.createManyAndReturn","MedicineType.updateOne","MedicineType.updateMany","MedicineType.updateManyAndReturn","MedicineType.upsertOne","MedicineType.deleteOne","MedicineType.deleteMany","MedicineType.groupBy","MedicineType.aggregate","Unit.findUnique","Unit.findUniqueOrThrow","Unit.findFirst","Unit.findFirstOrThrow","Unit.findMany","Unit.createOne","Unit.createMany","Unit.createManyAndReturn","Unit.updateOne","Unit.updateMany","Unit.updateManyAndReturn","Unit.upsertOne","Unit.deleteOne","Unit.deleteMany","Unit.groupBy","Unit.aggregate","PharmacyInventory.findUnique","PharmacyInventory.findUniqueOrThrow","PharmacyInventory.findFirst","PharmacyInventory.findFirstOrThrow","PharmacyInventory.findMany","PharmacyInventory.createOne","PharmacyInventory.createMany","PharmacyInventory.createManyAndReturn","PharmacyInventory.updateOne","PharmacyInventory.updateMany","PharmacyInventory.updateManyAndReturn","PharmacyInventory.upsertOne","PharmacyInventory.deleteOne","PharmacyInventory.deleteMany","PharmacyInventory.groupBy","PharmacyInventory.aggregate","MedicineRequest.findUnique","MedicineRequest.findUniqueOrThrow","MedicineRequest.findFirst","MedicineRequest.findFirstOrThrow","MedicineRequest.findMany","MedicineRequest.createOne","MedicineRequest.createMany","MedicineRequest.createManyAndReturn","MedicineRequest.updateOne","MedicineRequest.updateMany","MedicineRequest.updateManyAndReturn","MedicineRequest.upsertOne","MedicineRequest.deleteOne","MedicineRequest.deleteMany","MedicineRequest.groupBy","MedicineRequest.aggregate","Pharmacy.findUnique","Pharmacy.findUniqueOrThrow","Pharmacy.findFirst","Pharmacy.findFirstOrThrow","Pharmacy.findMany","Pharmacy.createOne","Pharmacy.createMany","Pharmacy.createManyAndReturn","Pharmacy.updateOne","Pharmacy.updateMany","Pharmacy.updateManyAndReturn","Pharmacy.upsertOne","Pharmacy.deleteOne","Pharmacy.deleteMany","Pharmacy.groupBy","Pharmacy.aggregate","Staff.findUnique","Staff.findUniqueOrThrow","Staff.findFirst","Staff.findFirstOrThrow","Staff.findMany","Staff.createOne","Staff.createMany","Staff.createManyAndReturn","Staff.updateOne","Staff.updateMany","Staff.updateManyAndReturn","Staff.upsertOne","Staff.deleteOne","Staff.deleteMany","Staff.groupBy","Staff.aggregate","Supplier.findUnique","Supplier.findUniqueOrThrow","Supplier.findFirst","Supplier.findFirstOrThrow","Supplier.findMany","Supplier.createOne","Supplier.createMany","Supplier.createManyAndReturn","Supplier.updateOne","Supplier.updateMany","Supplier.updateManyAndReturn","Supplier.upsertOne","Supplier.deleteOne","Supplier.deleteMany","Supplier.groupBy","Supplier.aggregate","Customer.findUnique","Customer.findUniqueOrThrow","Customer.findFirst","Customer.findFirstOrThrow","Customer.findMany","Customer.createOne","Customer.createMany","Customer.createManyAndReturn","Customer.updateOne","Customer.updateMany","Customer.updateManyAndReturn","Customer.upsertOne","Customer.deleteOne","Customer.deleteMany","Customer.groupBy","Customer.aggregate","Purchase.findUnique","Purchase.findUniqueOrThrow","Purchase.findFirst","Purchase.findFirstOrThrow","Purchase.findMany","Purchase.createOne","Purchase.createMany","Purchase.createManyAndReturn","Purchase.updateOne","Purchase.updateMany","Purchase.updateManyAndReturn","Purchase.upsertOne","Purchase.deleteOne","Purchase.deleteMany","Purchase.groupBy","Purchase.aggregate","PurchaseItem.findUnique","PurchaseItem.findUniqueOrThrow","PurchaseItem.findFirst","PurchaseItem.findFirstOrThrow","PurchaseItem.findMany","PurchaseItem.createOne","PurchaseItem.createMany","PurchaseItem.createManyAndReturn","PurchaseItem.updateOne","PurchaseItem.updateMany","PurchaseItem.updateManyAndReturn","PurchaseItem.upsertOne","PurchaseItem.deleteOne","PurchaseItem.deleteMany","PurchaseItem.groupBy","PurchaseItem.aggregate","Invoice.findUnique","Invoice.findUniqueOrThrow","Invoice.findFirst","Invoice.findFirstOrThrow","Invoice.findMany","Invoice.createOne","Invoice.createMany","Invoice.createManyAndReturn","Invoice.updateOne","Invoice.updateMany","Invoice.updateManyAndReturn","Invoice.upsertOne","Invoice.deleteOne","Invoice.deleteMany","Invoice.groupBy","Invoice.aggregate","InvoiceItem.findUnique","InvoiceItem.findUniqueOrThrow","InvoiceItem.findFirst","InvoiceItem.findFirstOrThrow","InvoiceItem.findMany","InvoiceItem.createOne","InvoiceItem.createMany","InvoiceItem.createManyAndReturn","InvoiceItem.updateOne","InvoiceItem.updateMany","InvoiceItem.updateManyAndReturn","InvoiceItem.upsertOne","InvoiceItem.deleteOne","InvoiceItem.deleteMany","InvoiceItem.groupBy","InvoiceItem.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","AND","OR","NOT","id","invoiceId","pharmacyId","amount","PaymentMode","paymentMode","paymentDate","note","receivedByUserId","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","contains","startsWith","endsWith","not","inventoryId","medicineId","quantity","unitPrice","vat","discount","total","customerId","invoiceNumber","saleDate","subtotal","vatAmount","totalAmount","netAmount","paidAmount","dueAmount","PaymentStatus","paymentStatus","InvoiceStatus","status","createdByUserId","purchaseId","purchasePrice","sellingPrice","expiryDate","batchNumber","supplierId","purchaseDate","PurchaseStatus","purchaseStatus","name","email","phone","address","isDeleted","deletedAt","contactPerson","isActive","every","some","none","userId","canManageInventory","canManageSales","canManageCustomers","canViewReports","canManagePurchases","ownerId","licenseNumber","binVat","PharmacyType","pharmacyType","establishedYear","staffCount","openingHours","website","logo","logoPublicId","PharmacyStatus","rejectionReason","inviteCode","requestedName","genericName","categorySuggestion","typeSuggestion","unitSuggestion","strength","companyName","MedicineRequestStatus","adminNote","stockQuantity","shelf","lowStockAlertQuantity","PharmacyInventoryStatus","symbol","description","slug","boxSize","price","supplierPrice","image","imagePublicId","MedicineStatus","categoryId","typeId","unitId","leafSettingId","leavesPerStrip","stripsPerBox","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","emailVerified","UserRole","role","UserAccountStatus","needPasswordChange","pharmacyId_invoiceNumber","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "kAu_AcACFgQAALYFACAFAAC3BQAgBwAAuAUAIB4AALkFACAfAAC6BQAg6AIAALMFADDpAgAAbAAQ6gIAALMFADDrAgEAAAAB9AJAAPgEACH1AkAA-AQAIZQDAAC1Be0DIp8DAQD0BAAhoAMBAAAAAaEDAQD1BAAhowMgAPYEACGkA0AA9wQAIdEDAQD1BAAh0gMBAPUEACHpAyAA9gQAIesDAAC0BesDIu0DIAD2BAAhAQAAAAEAIAwDAACKBQAg6AIAAOIFADDpAgAAAwAQ6gIAAOIFADDrAgEA9AQAIfQCQAD4BAAh9QJAAPgEACGqAwEA9AQAIdwDQAD4BAAh5gMBAPQEACHnAwEA9QQAIegDAQD1BAAhAwMAAL4IACDnAwAA4wUAIOgDAADjBQAgDAMAAIoFACDoAgAA4gUAMOkCAAADABDqAgAA4gUAMOsCAQAAAAH0AkAA-AQAIfUCQAD4BAAhqgMBAPQEACHcA0AA-AQAIeYDAQAAAAHnAwEA9QQAIegDAQD1BAAhAwAAAAMAIAEAAAQAMAIAAAUAIBEDAACKBQAg6AIAAOEFADDpAgAABwAQ6gIAAOEFADDrAgEA9AQAIfQCQAD4BAAh9QJAAPgEACGqAwEA9AQAId0DAQD0BAAh3gMBAPQEACHfAwEA9QQAIeADAQD1BAAh4QMBAPUEACHiA0AA9wQAIeMDQAD3BAAh5AMBAPUEACHlAwEA9QQAIQgDAAC-CAAg3wMAAOMFACDgAwAA4wUAIOEDAADjBQAg4gMAAOMFACDjAwAA4wUAIOQDAADjBQAg5QMAAOMFACARAwAAigUAIOgCAADhBQAw6QIAAAcAEOoCAADhBQAw6wIBAAAAAfQCQAD4BAAh9QJAAPgEACGqAwEA9AQAId0DAQD0BAAh3gMBAPQEACHfAwEA9QQAIeADAQD1BAAh4QMBAPUEACHiA0AA9wQAIeMDQAD3BAAh5AMBAPUEACHlAwEA9QQAIQMAAAAHACABAAAIADACAAAJACAeBgAAigUAIAgAAIsFACAPAACMBQAgEgAA-gQAIBcAAI4FACAaAACQBQAgHAAAjQUAIB0AAI8FACDoAgAAhgUAMOkCAAALABDqAgAAhgUAMOsCAQD0BAAh9AJAAPgEACH1AkAA-AQAIZQDAACJBbwDIp8DAQD0BAAhoQMBAPQEACGiAwEA9AQAIbADAQD0BAAhsQMBAPQEACGyAwEA9QQAIbQDAACHBbQDIrUDAgCIBQAhtgMCAIgFACG3AwEA9QQAIbgDAQD1BAAhuQMBAPUEACG6AwEA9QQAIbwDAQD1BAAhvQMBAPUEACEBAAAACwAgEgMAAIoFACAHAAC-BQAg6AIAAOAFADDpAgAADQAQ6gIAAOAFADDrAgEA9AQAIe0CAQD0BAAh9AJAAPgEACH1AkAA-AQAIaMDIAD2BAAhpANAAPcEACGmAyAA9gQAIaoDAQD0BAAhqwMgAPYEACGsAyAA9gQAIa0DIAD2BAAhrgMgAPYEACGvAyAA9gQAIQMDAAC-CAAgBwAA3AkAIKQDAADjBQAgEgMAAIoFACAHAAC-BQAg6AIAAOAFADDpAgAADQAQ6gIAAOAFADDrAgEAAAAB7QIBAPQEACH0AkAA-AQAIfUCQAD4BAAhowMgAPYEACGkA0AA9wQAIaYDIAD2BAAhqgMBAAAAAasDIAD2BAAhrAMgAPYEACGtAyAA9gQAIa4DIAD2BAAhrwMgAPYEACEDAAAADQAgAQAADgAwAgAADwAgFAcAAL4FACAQAADLBQAgFgAA1QUAIBsAAMgFACDoAgAA3gUAMOkCAAARABDqAgAA3gUAMOsCAQD0BAAh7QIBAPQEACH0AkAA-AQAIfUCQAD4BAAhggMBAPQEACGUAwAA3wXLAyKXAxAA1wUAIZgDEADABQAhmQNAAPcEACGaAwEA9QQAIccDAgCoBQAhyAMBAPUEACHJAwIAqAUAIQgHAADcCQAgEAAA4wkAIBYAAOYJACAbAADhCQAglwMAAOMFACCZAwAA4wUAIJoDAADjBQAgyAMAAOMFACAUBwAAvgUAIBAAAMsFACAWAADVBQAgGwAAyAUAIOgCAADeBQAw6QIAABEAEOoCAADeBQAw6wIBAAAAAe0CAQD0BAAh9AJAAPgEACH1AkAA-AQAIYIDAQD0BAAhlAMAAN8FywMilwMQANcFACGYAxAAwAUAIZkDQAD3BAAhmgMBAPUEACHHAwIAqAUAIcgDAQD1BAAhyQMCAKgFACEDAAAAEQAgAQAAEgAwAgAAEwAgDQkAAPkEACDoAgAAoQUAMOkCAAAVABDqAgAAoQUAMOsCAQD0BAAh9AJAAPgEACH1AkAA-AQAIZ8DAQD0BAAhowMgAPYEACGkA0AA9wQAIaYDIAD2BAAhzAMBAPUEACHNAwEA9AQAIQEAAAAVACAkCwAA2QUAIAwAANoFACANAADbBQAgDwAAjAUAIBMAANwFACAUAADdBQAgFQAAjQUAIBYAANUFACAbAADIBQAg6AIAANYFADDpAgAAFwAQ6gIAANYFADDrAgEA9AQAIfQCQAD4BAAh9QJAAPgEACGFAxAA1wUAIZQDAADYBdQDIpkDQAD3BAAhmwMBAPUEACGfAwEA9AQAIaMDIAD2BAAhpANAAPcEACG_AwEA9QQAIcMDAQD1BAAhxwMCAKgFACHIAwEA9QQAIcwDAQD1BAAhzgMBAPUEACHPAxAAwAUAIdADEADXBQAh0QMBAPUEACHSAwEA9QQAIdQDAQD1BAAh1QMBAPUEACHWAwEA9QQAIdcDAQD1BAAhGQsAAOcJACAMAADoCQAgDQAA5QkAIA8AAMAIACATAADpCQAgFAAA6gkAIBUAAMEIACAWAADmCQAgGwAA4QkAIIUDAADjBQAgmQMAAOMFACCbAwAA4wUAIKQDAADjBQAgvwMAAOMFACDDAwAA4wUAIMgDAADjBQAgzAMAAOMFACDOAwAA4wUAINADAADjBQAg0QMAAOMFACDSAwAA4wUAINQDAADjBQAg1QMAAOMFACDWAwAA4wUAINcDAADjBQAgJAsAANkFACAMAADaBQAgDQAA2wUAIA8AAIwFACATAADcBQAgFAAA3QUAIBUAAI0FACAWAADVBQAgGwAAyAUAIOgCAADWBQAw6QIAABcAEOoCAADWBQAw6wIBAAAAAfQCQAD4BAAh9QJAAPgEACGFAxAA1wUAIZQDAADYBdQDIpkDQAD3BAAhmwMBAPUEACGfAwEA9AQAIaMDIAD2BAAhpANAAPcEACG_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-AQAIfUCQAD4BAAhggMBAPUEACGUAwAAzQXGAyK-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-ACABAAA_ADACAABAACABAAAAJwAgAQAAAD4AIAMAAAA4ACABAAA5ADACAAA6ACADAAAAIwAgAQAAJAAwAgAAJQAgAwAAAEQAIAEAAEUAMAIAAEYAIAYHAADcCQAgFwAAwggAIKADAADjBQAgoQMAAOMFACCiAwAA4wUAIKQDAADjBQAgDwcAAL4FACAXAACOBQAg6AIAAL0FADDpAgAAQgAQ6gIAAL0FADDrAgEAAAAB7QIBAPQEACH0AkAA-AQAIfUCQAD4BAAhnwMBAPQEACGgAwEA9QQAIaEDAQD1BAAhogMBAPUEACGjAyAA9gQAIaQDQAD3BAAhAwAAAEIAIAEAAFwAMAIAAF0AIAMAAABKACABAABLADACAABMACABAAAADQAgAQAAABEAIAEAAAA4ACABAAAAIwAgAQAAAEQAIAEAAABCACABAAAASgAgAQAAAA0AIAsDAAC8BQAg6AIAALsFADDpAgAAaAAQ6gIAALsFADDrAgEA9AQAIfQCQAD4BAAh9QJAAPgEACGqAwEA9QQAIdoDAQD0BAAh2wMBAPQEACHcA0AA-AQAIQIDAAC-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-AQAgB-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_gYAIBUAAIAHACAWAACBBwAgGwAAggcAIOsCAQDpBQAh9AJAAOwFACH1AkAA7AUAIYUDEAD4BgAhlAMAAPkG1AMimQNAAKoGACGbAwEA7QUAIZ8DAQDpBQAhowMgAMwGACGkA0AAqgYAIb8DAQDtBQAhwwMBAO0FACHHAwIA9wUAIcgDAQDtBQAhzAMBAO0FACHOAwEA7QUAIc8DEADqBQAh0AMQAPgGACHRAwEA7QUAIdIDAQDtBQAh1AMBAO0FACHVAwEA7QUAIdYDAQDtBQAh1wMBAO0FACECAAAAGQAgJQAA8gEAIBjrAgEA6QUAIfQCQADsBQAh9QJAAOwFACGFAxAA-AYAIZQDAAD5BtQDIpkDQACqBgAhmwMBAO0FACGfAwEA6QUAIaMDIADMBgAhpANAAKoGACG_AwEA7QUAIcMDAQDtBQAhxwMCAPcFACHIAwEA7QUAIcwDAQDtBQAhzgMBAO0FACHPAxAA6gUAIdADEAD4BgAh0QMBAO0FACHSAwEA7QUAIdQDAQDtBQAh1QMBAO0FACHWAwEA7QUAIdcDAQDtBQAhAgAAABcAICUAAPQBACACAAAAFwAgJQAA9AEAIAEAAAAVACABAAAAHAAgAQAAACAAIAEAAAAvACABAAAAMwAgAwAAABkAICwAAOgBACAtAADyAQAgAQAAABkAIAEAAAAXACAVCgAA-QgAIDIAAPwIACAzAAD7CAAgdAAA-ggAIHUAAP0IACCFAwAA4wUAIJkDAADjBQAgmwMAAOMFACCkAwAA4wUAIL8DAADjBQAgwwMAAOMFACDIAwAA4wUAIMwDAADjBQAgzgMAAOMFACDQAwAA4wUAINEDAADjBQAg0gMAAOMFACDUAwAA4wUAINUDAADjBQAg1gMAAOMFACDXAwAA4wUAIBvoAgAAogUAMOkCAACAAgAQ6gIAAKIFADDrAgEAygQAIfQCQADNBAAh9QJAAM0EACGFAxAAlgUAIZQDAACjBdQDIpkDQADnBAAhmwMBAM4EACGfAwEAygQAIaMDIADvBAAhpANAAOcEACG_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_rAgEA6QUAIe0CAQDpBQAh8gIBAO0FACH0AkAA7AUAIfUCQADsBQAhggMBAO0FACGUAwAAnwfGAyK-AwEA6QUAIb8DAQDtBQAhwAMBAO0FACHBAwEA7QUAIcIDAQDtBQAhwwMBAO0FACHEAwEA7QUAIcYDAQDtBQAhAgAAADgAICUAAO4CACACAAAAOAAgJQAA7gIAIAEAAAAXACADAAAAOgAgLAAA5gIAIC0AAOwCACABAAAAOgAgAQAAADgAIAwKAADFCAAgMgAAxwgAIDMAAMYIACDyAgAA4wUAIIIDAADjBQAgvwMAAOMFACDAAwAA4wUAIMEDAADjBQAgwgMAAOMFACDDAwAA4wUAIMQDAADjBQAgxgMAAOMFACAS6AIAAJEFADDpAgAA9gIAEOoCAACRBQAw6wIBAMoEACHtAgEAygQAIfICAQDOBAAh9AJAAM0EACH1AkAAzQQAIYIDAQDOBAAhlAMAAJIFxgMivgMBAMoEACG_AwEAzgQAIcADAQDOBAAhwQMBAM4EACHCAwEAzgQAIcMDAQDOBAAhxAMBAM4EACHGAwEAzgQAIQMAAAA4ACABAAD1AgAwMQAA9gIAIAMAAAA4ACABAAA5ADACAAA6ACAeBgAAigUAIAgAAIsFACAPAACMBQAgEgAA-gQAIBcAAI4FACAaAACQBQAgHAAAjQUAIB0AAI8FACDoAgAAhgUAMOkCAAALABDqAgAAhgUAMOsCAQAAAAH0AkAA-AQAIfUCQAD4BAAhlAMAAIkFvAMinwMBAPQEACGhAwEA9AQAIaIDAQD0BAAhsAMBAAAAAbEDAQAAAAGyAwEA9QQAIbQDAACHBbQDIrUDAgCIBQAhtgMCAIgFACG3AwEA9QQAIbgDAQD1BAAhuQMBAPUEACG6AwEA9QQAIbwDAQD1BAAhvQMBAAAAAQEAAAD5AgAgAQAAAPkCACARBgAAvggAIAgAAL8IACAPAADACAAgEgAA1QcAIBcAAMIIACAaAADECAAgHAAAwQgAIB0AAMMIACCyAwAA4wUAILUDAADjBQAgtgMAAOMFACC3AwAA4wUAILgDAADjBQAguQMAAOMFACC6AwAA4wUAILwDAADjBQAgvQMAAOMFACADAAAACwAgAQAA_AIAMAIAAPkCACADAAAACwAgAQAA_AIAMAIAAPkCACADAAAACwAgAQAA_AIAMAIAAPkCACAbBgAAtggAIAgAALcIACAPAAC4CAAgEgAAuggAIBcAALsIACAaAAC9CAAgHAAAuQgAIB0AALwIACDrAgEAAAAB9AJAAAAAAfUCQAAAAAGUAwAAALwDAp8DAQAAAAGhAwEAAAABogMBAAAAAbADAQAAAAGxAwEAAAABsgMBAAAAAbQDAAAAtAMCtQMCAAAAAbYDAgAAAAG3AwEAAAABuAMBAAAAAbkDAQAAAAG6AwEAAAABvAMBAAAAAb0DAQAAAAEBJQAAgAMAIBPrAgEAAAAB9AJAAAAAAfUCQAAAAAGUAwAAALwDAp8DAQAAAAGhAwEAAAABogMBAAAAAbADAQAAAAGxAwEAAAABsgMBAAAAAbQDAAAAtAMCtQMCAAAAAbYDAgAAAAG3AwEAAAABuAMBAAAAAbkDAQAAAAG6AwEAAAABvAMBAAAAAb0DAQAAAAEBJQAAggMAMAElAACCAwAwGwYAAOUHACAIAADmBwAgDwAA5wcAIBIAAOkHACAXAADqBwAgGgAA7AcAIBwAAOgHACAdAADrBwAg6wIBAOkFACH0AkAA7AUAIfUCQADsBQAhlAMAAOQHvAMinwMBAOkFACGhAwEA6QUAIaIDAQDpBQAhsAMBAOkFACGxAwEA6QUAIbIDAQDtBQAhtAMAAOIHtAMitQMCAOMHACG2AwIA4wcAIbcDAQDtBQAhuAMBAO0FACG5AwEA7QUAIboDAQDtBQAhvAMBAO0FACG9AwEA7QUAIQIAAAD5AgAgJQAAhQMAIBPrAgEA6QUAIfQCQADsBQAh9QJAAOwFACGUAwAA5Ae8AyKfAwEA6QUAIaEDAQDpBQAhogMBAOkFACGwAwEA6QUAIbEDAQDpBQAhsgMBAO0FACG0AwAA4ge0AyK1AwIA4wcAIbYDAgDjBwAhtwMBAO0FACG4AwEA7QUAIbkDAQDtBQAhugMBAO0FACG8AwEA7QUAIb0DAQDtBQAhAgAAAAsAICUAAIcDACACAAAACwAgJQAAhwMAIAMAAAD5AgAgLAAAgAMAIC0AAIUDACABAAAA-QIAIAEAAAALACAOCgAA3QcAIDIAAOAHACAzAADfBwAgdAAA3gcAIHUAAOEHACCyAwAA4wUAILUDAADjBQAgtgMAAOMFACC3AwAA4wUAILgDAADjBQAguQMAAOMFACC6AwAA4wUAILwDAADjBQAgvQMAAOMFACAW6AIAAPwEADDpAgAAjgMAEOoCAAD8BAAw6wIBAMoEACH0AkAAzQQAIfUCQADNBAAhlAMAAP8EvAMinwMBAMoEACGhAwEAygQAIaIDAQDKBAAhsAMBAMoEACGxAwEAygQAIbIDAQDOBAAhtAMAAP0EtAMitQMCAP4EACG2AwIA_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_oAgAA5gQAMOkCAACABAAQ6gIAAOYEADDrAgEAygQAIfQCQADNBAAh9QJAAM0EACGBAwEAzgQAIYIDAQDKBAAhgwMCANwEACGHAxAAywQAIZYDAQDKBAAhlwMQAMsEACGYAxAAywQAIZkDQADnBAAhmgMBAM4EACEDAAAAJwAgAQAA_wMAMDEAAIAEACADAAAAJwAgAQAAKAAwAgAAKQAgAQAAAEYAIAEAAABGACADAAAARAAgAQAARQAwAgAARgAgAwAAAEQAIAEAAEUAMAIAAEYAIAMAAABEACABAABFADACAABGACAXBwAAoQYAIBEAAKMGACAYAACiBgAgGgAApAYAIOsCAQAAAAHtAgEAAAAB8AIAAADwAgLyAgEAAAAB9AJAAAAAAfUCQAAAAAGGAxAAAAABiAMBAAAAAYkDAQAAAAGKA0AAAAABiwMQAAAAAYwDEAAAAAGNAxAAAAABjgMQAAAAAY8DEAAAAAGQAxAAAAABkgMAAACSAwKUAwAAAJQDApUDAQAAAAEBJQAAiAQAIBPrAgEAAAAB7QIBAAAAAfACAAAA8AIC8gIBAAAAAfQCQAAAAAH1AkAAAAABhgMQAAAAAYgDAQAAAAGJAwEAAAABigNAAAAAAYsDEAAAAAGMAxAAAAABjQMQAAAAAY4DEAAAAAGPAxAAAAABkAMQAAAAAZIDAAAAkgMClAMAAACUAwKVAwEAAAABASUAAIoEADABJQAAigQAMAEAAABCACAXBwAAhQYAIBEAAIcGACAYAACGBgAgGgAAiAYAIOsCAQDpBQAh7QIBAOkFACHwAgAA6wXwAiLyAgEA7QUAIfQCQADsBQAh9QJAAOwFACGGAxAA6gUAIYgDAQDtBQAhiQMBAOkFACGKA0AA7AUAIYsDEADqBQAhjAMQAOoFACGNAxAA6gUAIY4DEADqBQAhjwMQAOoFACGQAxAA6gUAIZIDAACDBpIDIpQDAACEBpQDIpUDAQDtBQAhAgAAAEYAICUAAI4EACAT6wIBAOkFACHtAgEA6QUAIfACAADrBfACIvICAQDtBQAh9AJAAOwFACH1AkAA7AUAIYYDEADqBQAhiAMBAO0FACGJAwEA6QUAIYoDQADsBQAhiwMQAOoFACGMAxAA6gUAIY0DEADqBQAhjgMQAOoFACGPAxAA6gUAIZADEADqBQAhkgMAAIMGkgMilAMAAIQGlAMilQMBAO0FACECAAAARAAgJQAAkAQAIAIAAABEACAlAACQBAAgAQAAAEIAIAMAAABGACAsAACIBAAgLQAAjgQAIAEAAABGACABAAAARAAgCAoAAP4FACAyAACBBgAgMwAAgAYAIHQAAP8FACB1AACCBgAg8gIAAOMFACCIAwAA4wUAIJUDAADjBQAgFugCAADfBAAw6QIAAJgEABDqAgAA3wQAMOsCAQDKBAAh7QIBAMoEACHwAgAAzATwAiLyAgEAzgQAIfQCQADNBAAh9QJAAM0EACGGAxAAywQAIYgDAQDOBAAhiQMBAMoEACGKA0AAzQQAIYsDEADLBAAhjAMQAMsEACGNAxAAywQAIY4DEADLBAAhjwMQAMsEACGQAxAAywQAIZIDAADgBJIDIpQDAADhBJQDIpUDAQDOBAAhAwAAAEQAIAEAAJcEADAxAACYBAAgAwAAAEQAIAEAAEUAMAIAAEYAIAEAAABAACABAAAAQAAgAwAAAD4AIAEAAD8AMAIAAEAAIAMAAAA-ACABAAA_ADACAABAACADAAAAPgAgAQAAPwAwAgAAQAAgDg8AAPwFACAQAAD9BQAgGQAA-wUAIOsCAQAAAAHsAgEAAAAB9AJAAAAAAfUCQAAAAAGBAwEAAAABggMBAAAAAYMDAgAAAAGEAxAAAAABhQMQAAAAAYYDEAAAAAGHAxAAAAABASUAAKAEACAL6wIBAAAAAewCAQAAAAH0AkAAAAAB9QJAAAAAAYEDAQAAAAGCAwEAAAABgwMCAAAAAYQDEAAAAAGFAxAAAAABhgMQAAAAAYcDEAAAAAEBJQAAogQAMAElAACiBAAwAQAAABEAIA4PAAD5BQAgEAAA-gUAIBkAAPgFACDrAgEA6QUAIewCAQDpBQAh9AJAAOwFACH1AkAA7AUAIYEDAQDtBQAhggMBAOkFACGDAwIA9wUAIYQDEADqBQAhhQMQAOoFACGGAxAA6gUAIYcDEADqBQAhAgAAAEAAICUAAKYEACAL6wIBAOkFACHsAgEA6QUAIfQCQADsBQAh9QJAAOwFACGBAwEA7QUAIYIDAQDpBQAhgwMCAPcFACGEAxAA6gUAIYUDEADqBQAhhgMQAOoFACGHAxAA6gUAIQIAAAA-ACAlAACoBAAgAgAAAD4AICUAAKgEACABAAAAEQAgAwAAAEAAICwAAKAEACAtAACmBAAgAQAAAEAAIAEAAAA-ACAGCgAA8gUAIDIAAPUFACAzAAD0BQAgdAAA8wUAIHUAAPYFACCBAwAA4wUAIA7oAgAA2wQAMOkCAACwBAAQ6gIAANsEADDrAgEAygQAIewCAQDKBAAh9AJAAM0EACH1AkAAzQQAIYEDAQDOBAAhggMBAMoEACGDAwIA3AQAIYQDEADLBAAhhQMQAMsEACGGAxAAywQAIYcDEADLBAAhAwAAAD4AIAEAAK8EADAxAACwBAAgAwAAAD4AIAEAAD8AMAIAAEAAIAEAAABMACABAAAATAAgAwAAAEoAIAEAAEsAMAIAAEwAIAMAAABKACABAABLADACAABMACADAAAASgAgAQAASwAwAgAATAAgDAcAAPEFACAZAADwBQAg6wIBAAAAAewCAQAAAAHtAgEAAAAB7gIQAAAAAfACAAAA8AIC8QJAAAAAAfICAQAAAAHzAgEAAAAB9AJAAAAAAfUCQAAAAAEBJQAAuAQAIArrAgEAAAAB7AIBAAAAAe0CAQAAAAHuAhAAAAAB8AIAAADwAgLxAkAAAAAB8gIBAAAAAfMCAQAAAAH0AkAAAAAB9QJAAAAAAQElAAC6BAAwASUAALoEADAMBwAA7wUAIBkAAO4FACDrAgEA6QUAIewCAQDpBQAh7QIBAOkFACHuAhAA6gUAIfACAADrBfACIvECQADsBQAh8gIBAO0FACHzAgEA7QUAIfQCQADsBQAh9QJAAOwFACECAAAATAAgJQAAvQQAIArrAgEA6QUAIewCAQDpBQAh7QIBAOkFACHuAhAA6gUAIfACAADrBfACIvECQADsBQAh8gIBAO0FACHzAgEA7QUAIfQCQADsBQAh9QJAAOwFACECAAAASgAgJQAAvwQAIAIAAABKACAlAAC_BAAgAwAAAEwAICwAALgEACAtAAC9BAAgAQAAAEwAIAEAAABKACAHCgAA5AUAIDIAAOcFACAzAADmBQAgdAAA5QUAIHUAAOgFACDyAgAA4wUAIPMCAADjBQAgDegCAADJBAAw6QIAAMYEABDqAgAAyQQAMOsCAQDKBAAh7AIBAMoEACHtAgEAygQAIe4CEADLBAAh8AIAAMwE8AIi8QJAAM0EACHyAgEAzgQAIfMCAQDOBAAh9AJAAM0EACH1AkAAzQQAIQMAAABKACABAADFBAAwMQAAxgQAIAMAAABKACABAABLADACAABMACAN6AIAAMkEADDpAgAAxgQAEOoCAADJBAAw6wIBAMoEACHsAgEAygQAIe0CAQDKBAAh7gIQAMsEACHwAgAAzATwAiLxAkAAzQQAIfICAQDOBAAh8wIBAM4EACH0AkAAzQQAIfUCQADNBAAhDgoAANMEACAyAADaBAAgMwAA2gQAIPYCAQAAAAH3AgEAAAAE-AIBAAAABPkCAQAAAAH6AgEAAAAB-wIBAAAAAfwCAQAAAAH9AgEAAAAB_gIBAAAAAf8CAQAAAAGAAwEA2QQAIQ0KAADTBAAgMgAA2AQAIDMAANgEACB0AADYBAAgdQAA2AQAIPYCEAAAAAH3AhAAAAAE-AIQAAAABPkCEAAAAAH6AhAAAAAB-wIQAAAAAfwCEAAAAAGAAxAA1wQAIQcKAADTBAAgMgAA1gQAIDMAANYEACD2AgAAAPACAvcCAAAA8AII-AIAAADwAgiAAwAA1QTwAiILCgAA0wQAIDIAANQEACAzAADUBAAg9gJAAAAAAfcCQAAAAAT4AkAAAAAE-QJAAAAAAfoCQAAAAAH7AkAAAAAB_AJAAAAAAYADQADSBAAhDgoAANAEACAyAADRBAAgMwAA0QQAIPYCAQAAAAH3AgEAAAAF-AIBAAAABfkCAQAAAAH6AgEAAAAB-wIBAAAAAfwCAQAAAAH9AgEAAAAB_gIBAAAAAf8CAQAAAAGAAwEAzwQAIQ4KAADQBAAgMgAA0QQAIDMAANEEACD2AgEAAAAB9wIBAAAABfgCAQAAAAX5AgEAAAAB-gIBAAAAAfsCAQAAAAH8AgEAAAAB_QIBAAAAAf4CAQAAAAH_AgEAAAABgAMBAM8EACEI9gICAAAAAfcCAgAAAAX4AgIAAAAF-QICAAAAAfoCAgAAAAH7AgIAAAAB_AICAAAAAYADAgDQBAAhC_YCAQAAAAH3AgEAAAAF-AIBAAAABfkCAQAAAAH6AgEAAAAB-wIBAAAAAfwCAQAAAAH9AgEAAAAB_gIBAAAAAf8CAQAAAAGAAwEA0QQAIQsKAADTBAAgMgAA1AQAIDMAANQEACD2AkAAAAAB9wJAAAAABPgCQAAAAAT5AkAAAAAB-gJAAAAAAfsCQAAAAAH8AkAAAAABgANAANIEACEI9gICAAAAAfcCAgAAAAT4AgIAAAAE-QICAAAAAfoCAgAAAAH7AgIAAAAB_AICAAAAAYADAgDTBAAhCPYCQAAAAAH3AkAAAAAE-AJAAAAABPkCQAAAAAH6AkAAAAAB-wJAAAAAAfwCQAAAAAGAA0AA1AQAIQcKAADTBAAgMgAA1gQAIDMAANYEACD2AgAAAPACAvcCAAAA8AII-AIAAADwAgiAAwAA1QTwAiIE9gIAAADwAgL3AgAAAPACCPgCAAAA8AIIgAMAANYE8AIiDQoAANMEACAyAADYBAAgMwAA2AQAIHQAANgEACB1AADYBAAg9gIQAAAAAfcCEAAAAAT4AhAAAAAE-QIQAAAAAfoCEAAAAAH7AhAAAAAB_AIQAAAAAYADEADXBAAhCPYCEAAAAAH3AhAAAAAE-AIQAAAABPkCEAAAAAH6AhAAAAAB-wIQAAAAAfwCEAAAAAGAAxAA2AQAIQ4KAADTBAAgMgAA2gQAIDMAANoEACD2AgEAAAAB9wIBAAAABPgCAQAAAAT5AgEAAAAB-gIBAAAAAfsCAQAAAAH8AgEAAAAB_QIBAAAAAf4CAQAAAAH_AgEAAAABgAMBANkEACEL9gIBAAAAAfcCAQAAAAT4AgEAAAAE-QIBAAAAAfoCAQAAAAH7AgEAAAAB_AIBAAAAAf0CAQAAAAH-AgEAAAAB_wIBAAAAAYADAQDaBAAhDugCAADbBAAw6QIAALAEABDqAgAA2wQAMOsCAQDKBAAh7AIBAMoEACH0AkAAzQQAIfUCQADNBAAhgQMBAM4EACGCAwEAygQAIYMDAgDcBAAhhAMQAMsEACGFAxAAywQAIYYDEADLBAAhhwMQAMsEACENCgAA0wQAIDIAANMEACAzAADTBAAgdAAA3gQAIHUAANMEACD2AgIAAAAB9wICAAAABPgCAgAAAAT5AgIAAAAB-gICAAAAAfsCAgAAAAH8AgIAAAABgAMCAN0EACENCgAA0wQAIDIAANMEACAzAADTBAAgdAAA3gQAIHUAANMEACD2AgIAAAAB9wICAAAABPgCAgAAAAT5AgIAAAAB-gICAAAAAfsCAgAAAAH8AgIAAAABgAMCAN0EACEI9gIIAAAAAfcCCAAAAAT4AggAAAAE-QIIAAAAAfoCCAAAAAH7AggAAAAB_AIIAAAAAYADCADeBAAhFugCAADfBAAw6QIAAJgEABDqAgAA3wQAMOsCAQDKBAAh7QIBAMoEACHwAgAAzATwAiLyAgEAzgQAIfQCQADNBAAh9QJAAM0EACGGAxAAywQAIYgDAQDOBAAhiQMBAMoEACGKA0AAzQQAIYsDEADLBAAhjAMQAMsEACGNAxAAywQAIY4DEADLBAAhjwMQAMsEACGQAxAAywQAIZIDAADgBJIDIpQDAADhBJQDIpUDAQDOBAAhBwoAANMEACAyAADlBAAgMwAA5QQAIPYCAAAAkgMC9wIAAACSAwj4AgAAAJIDCIADAADkBJIDIgcKAADTBAAgMgAA4wQAIDMAAOMEACD2AgAAAJQDAvcCAAAAlAMI-AIAAACUAwiAAwAA4gSUAyIHCgAA0wQAIDIAAOMEACAzAADjBAAg9gIAAACUAwL3AgAAAJQDCPgCAAAAlAMIgAMAAOIElAMiBPYCAAAAlAMC9wIAAACUAwj4AgAAAJQDCIADAADjBJQDIgcKAADTBAAgMgAA5QQAIDMAAOUEACD2AgAAAJIDAvcCAAAAkgMI-AIAAACSAwiAAwAA5ASSAyIE9gIAAACSAwL3AgAAAJIDCPgCAAAAkgMIgAMAAOUEkgMiD-gCAADmBAAw6QIAAIAEABDqAgAA5gQAMOsCAQDKBAAh9AJAAM0EACH1AkAAzQQAIYEDAQDOBAAhggMBAMoEACGDAwIA3AQAIYcDEADLBAAhlgMBAMoEACGXAxAAywQAIZgDEADLBAAhmQNAAOcEACGaAwEAzgQAIQsKAADQBAAgMgAA6QQAIDMAAOkEACD2AkAAAAAB9wJAAAAABfgCQAAAAAX5AkAAAAAB-gJAAAAAAfsCQAAAAAH8AkAAAAABgANAAOgEACELCgAA0AQAIDIAAOkEACAzAADpBAAg9gJAAAAAAfcCQAAAAAX4AkAAAAAF-QJAAAAAAfoCQAAAAAH7AkAAAAAB_AJAAAAAAYADQADoBAAhCPYCQAAAAAH3AkAAAAAF-AJAAAAABfkCQAAAAAH6AkAAAAAB-wJAAAAAAfwCQAAAAAGAA0AA6QQAIRToAgAA6gQAMOkCAADoAwAQ6gIAAOoEADDrAgEAygQAIe0CAQDKBAAh8gIBAM4EACH0AkAAzQQAIfUCQADNBAAhhgMQAMsEACGJAwEAygQAIYsDEADLBAAhjAMQAMsEACGNAxAAywQAIY8DEADLBAAhkAMQAMsEACGSAwAA4ASSAyKVAwEAzgQAIZsDAQDKBAAhnANAAM0EACGeAwAA6wSeAyIHCgAA0wQAIDIAAO0EACAzAADtBAAg9gIAAACeAwL3AgAAAJ4DCPgCAAAAngMIgAMAAOwEngMiBwoAANMEACAyAADtBAAgMwAA7QQAIPYCAAAAngMC9wIAAACeAwj4AgAAAJ4DCIADAADsBJ4DIgT2AgAAAJ4DAvcCAAAAngMI-AIAAACeAwiAAwAA7QSeAyIN6AIAAO4EADDpAgAA0gMAEOoCAADuBAAw6wIBAMoEACHtAgEAygQAIfQCQADNBAAh9QJAAM0EACGfAwEAygQAIaADAQDOBAAhoQMBAM4EACGiAwEAzgQAIaMDIADvBAAhpANAAOcEACEFCgAA0wQAIDIAAPEEACAzAADxBAAg9gIgAAAAAYADIADwBAAhBQoAANMEACAyAADxBAAgMwAA8QQAIPYCIAAAAAGAAyAA8AQAIQL2AiAAAAABgAMgAPEEACEO6AIAAPIEADDpAgAAvAMAEOoCAADyBAAw6wIBAMoEACH0AkAAzQQAIfUCQADNBAAhnwMBAMoEACGgAwEAzgQAIaEDAQDOBAAhogMBAM4EACGjAyAA7wQAIaQDQADnBAAhpQMBAM4EACGmAyAA7wQAIRAJAAD5BAAgEgAA-gQAIOgCAADzBAAw6QIAACAAEOoCAADzBAAw6wIBAPQEACH0AkAA-AQAIfUCQAD4BAAhnwMBAPQEACGgAwEA9QQAIaEDAQD1BAAhogMBAPUEACGjAyAA9gQAIaQDQAD3BAAhpQMBAPUEACGmAyAA9gQAIQv2AgEAAAAB9wIBAAAABPgCAQAAAAT5AgEAAAAB-gIBAAAAAfsCAQAAAAH8AgEAAAAB_QIBAAAAAf4CAQAAAAH_AgEAAAABgAMBANoEACEL9gIBAAAAAfcCAQAAAAX4AgEAAAAF-QIBAAAAAfoCAQAAAAH7AgEAAAAB_AIBAAAAAf0CAQAAAAH-AgEAAAAB_wIBAAAAAYADAQDRBAAhAvYCIAAAAAGAAyAA8QQAIQj2AkAAAAAB9wJAAAAABfgCQAAAAAX5AkAAAAAB-gJAAAAAAfsCQAAAAAH8AkAAAAABgANAAOkEACEI9gJAAAAAAfcCQAAAAAT4AkAAAAAE-QJAAAAAAfoCQAAAAAH7AkAAAAAB_AJAAAAAAYADQADUBAAhA6cDAAAXACCoAwAAFwAgqQMAABcAIAOnAwAAIwAgqAMAACMAIKkDAAAjACAQ6AIAAPsEADDpAgAApAMAEOoCAAD7BAAw6wIBAMoEACHtAgEAygQAIfQCQADNBAAh9QJAAM0EACGjAyAA7wQAIaQDQADnBAAhpgMgAO8EACGqAwEAygQAIasDIADvBAAhrAMgAO8EACGtAyAA7wQAIa4DIADvBAAhrwMgAO8EACEW6AIAAPwEADDpAgAAjgMAEOoCAAD8BAAw6wIBAMoEACH0AkAAzQQAIfUCQADNBAAhlAMAAP8EvAMinwMBAMoEACGhAwEAygQAIaIDAQDKBAAhsAMBAMoEACGxAwEAygQAIbIDAQDOBAAhtAMAAP0EtAMitQMCAP4EACG2AwIA_gQAIbcDAQDOBAAhuAMBAM4EACG5AwEAzgQAIboDAQDOBAAhvAMBAM4EACG9AwEAzgQAIQcKAADTBAAgMgAAhQUAIDMAAIUFACD2AgAAALQDAvcCAAAAtAMI-AIAAAC0AwiAAwAAhAW0AyINCgAA0AQAIDIAANAEACAzAADQBAAgdAAAgwUAIHUAANAEACD2AgIAAAAB9wICAAAABfgCAgAAAAX5AgIAAAAB-gICAAAAAfsCAgAAAAH8AgIAAAABgAMCAIIFACEHCgAA0wQAIDIAAIEFACAzAACBBQAg9gIAAAC8AwL3AgAAALwDCPgCAAAAvAMIgAMAAIAFvAMiBwoAANMEACAyAACBBQAgMwAAgQUAIPYCAAAAvAMC9wIAAAC8Awj4AgAAALwDCIADAACABbwDIgT2AgAAALwDAvcCAAAAvAMI-AIAAAC8AwiAAwAAgQW8AyINCgAA0AQAIDIAANAEACAzAADQBAAgdAAAgwUAIHUAANAEACD2AgIAAAAB9wICAAAABfgCAgAAAAX5AgIAAAAB-gICAAAAAfsCAgAAAAH8AgIAAAABgAMCAIIFACEI9gIIAAAAAfcCCAAAAAX4AggAAAAF-QIIAAAAAfoCCAAAAAH7AggAAAAB_AIIAAAAAYADCACDBQAhBwoAANMEACAyAACFBQAgMwAAhQUAIPYCAAAAtAMC9wIAAAC0Awj4AgAAALQDCIADAACEBbQDIgT2AgAAALQDAvcCAAAAtAMI-AIAAAC0AwiAAwAAhQW0AyIeBgAAigUAIAgAAIsFACAPAACMBQAgEgAA-gQAIBcAAI4FACAaAACQBQAgHAAAjQUAIB0AAI8FACDoAgAAhgUAMOkCAAALABDqAgAAhgUAMOsCAQD0BAAh9AJAAPgEACH1AkAA-AQAIZQDAACJBbwDIp8DAQD0BAAhoQMBAPQEACGiAwEA9AQAIbADAQD0BAAhsQMBAPQEACGyAwEA9QQAIbQDAACHBbQDIrUDAgCIBQAhtgMCAIgFACG3AwEA9QQAIbgDAQD1BAAhuQMBAPUEACG6AwEA9QQAIbwDAQD1BAAhvQMBAPUEACEE9gIAAAC0AwL3AgAAALQDCPgCAAAAtAMIgAMAAIUFtAMiCPYCAgAAAAH3AgIAAAAF-AICAAAABfkCAgAAAAH6AgIAAAAB-wICAAAAAfwCAgAAAAGAAwIA0AQAIQT2AgAAALwDAvcCAAAAvAMI-AIAAAC8AwiAAwAAgQW8AyIYBAAAtgUAIAUAALcFACAHAAC4BQAgHgAAuQUAIB8AALoFACDoAgAAswUAMOkCAABsABDqAgAAswUAMOsCAQD0BAAh9AJAAPgEACH1AkAA-AQAIZQDAAC1Be0DIp8DAQD0BAAhoAMBAPQEACGhAwEA9QQAIaMDIAD2BAAhpANAAPcEACHRAwEA9QQAIdIDAQD1BAAh6QMgAPYEACHrAwAAtAXrAyLtAyAA9gQAIe8DAABsACDwAwAAbAAgA6cDAAANACCoAwAADQAgqQMAAA0AIAOnAwAAEQAgqAMAABEAIKkDAAARACADpwMAADgAIKgDAAA4ACCpAwAAOAAgA6cDAABEACCoAwAARAAgqQMAAEQAIAOnAwAAQgAgqAMAAEIAIKkDAABCACADpwMAAEoAIKgDAABKACCpAwAASgAgEugCAACRBQAw6QIAAPYCABDqAgAAkQUAMOsCAQDKBAAh7QIBAMoEACHyAgEAzgQAIfQCQADNBAAh9QJAAM0EACGCAwEAzgQAIZQDAACSBcYDIr4DAQDKBAAhvwMBAM4EACHAAwEAzgQAIcEDAQDOBAAhwgMBAM4EACHDAwEAzgQAIcQDAQDOBAAhxgMBAM4EACEHCgAA0wQAIDIAAJQFACAzAACUBQAg9gIAAADGAwL3AgAAAMYDCPgCAAAAxgMIgAMAAJMFxgMiBwoAANMEACAyAACUBQAgMwAAlAUAIPYCAAAAxgMC9wIAAADGAwj4AgAAAMYDCIADAACTBcYDIgT2AgAAAMYDAvcCAAAAxgMI-AIAAADGAwiAAwAAlAXGAyIQ6AIAAJUFADDpAgAA3gIAEOoCAACVBQAw6wIBAMoEACHtAgEAygQAIfQCQADNBAAh9QJAAM0EACGCAwEAygQAIZQDAACXBcsDIpcDEACWBQAhmAMQAMsEACGZA0AA5wQAIZoDAQDOBAAhxwMCANwEACHIAwEAzgQAIckDAgDcBAAhDQoAANAEACAyAACbBQAgMwAAmwUAIHQAAJsFACB1AACbBQAg9gIQAAAAAfcCEAAAAAX4AhAAAAAF-QIQAAAAAfoCEAAAAAH7AhAAAAAB_AIQAAAAAYADEACaBQAhBwoAANMEACAyAACZBQAgMwAAmQUAIPYCAAAAywMC9wIAAADLAwj4AgAAAMsDCIADAACYBcsDIgcKAADTBAAgMgAAmQUAIDMAAJkFACD2AgAAAMsDAvcCAAAAywMI-AIAAADLAwiAAwAAmAXLAyIE9gIAAADLAwL3AgAAAMsDCPgCAAAAywMIgAMAAJkFywMiDQoAANAEACAyAACbBQAgMwAAmwUAIHQAAJsFACB1AACbBQAg9gIQAAAAAfcCEAAAAAX4AhAAAAAF-QIQAAAAAfoCEAAAAAH7AhAAAAAB_AIQAAAAAYADEACaBQAhCPYCEAAAAAH3AhAAAAAF-AIQAAAABfkCEAAAAAH6AhAAAAAB-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-QIQAAAAAfoCEAAAAAH7AhAAAAAB_AIQAAAAAYADEADYBAAhBPYCAAAA8AIC9wIAAADwAgj4AgAAAPACCIADAADWBPACIhwHAAC-BQAgEQAAyAUAIBgAAMcFACAaAACQBQAg6AIAAMQFADDpAgAARAAQ6gIAAMQFADDrAgEA9AQAIe0CAQD0BAAh8AIAAMEF8AIi8gIBAPUEACH0AkAA-AQAIfUCQAD4BAAhhgMQAMAFACGIAwEA9QQAIYkDAQD0BAAhigNAAPgEACGLAxAAwAUAIYwDEADABQAhjQMQAMAFACGOAxAAwAUAIY8DEADABQAhkAMQAMAFACGSAwAAxQWSAyKUAwAAxgWUAyKVAwEA9QQAIe8DAABEACDwAwAARAAgAu0CAQAAAAGJAwEAAAABGgcAAL4FACARAADIBQAgGAAAxwUAIBoAAJAFACDoAgAAxAUAMOkCAABEABDqAgAAxAUAMOsCAQD0BAAh7QIBAPQEACHwAgAAwQXwAiLyAgEA9QQAIfQCQAD4BAAh9QJAAPgEACGGAxAAwAUAIYgDAQD1BAAhiQMBAPQEACGKA0AA-AQAIYsDEADABQAhjAMQAMAFACGNAxAAwAUAIY4DEADABQAhjwMQAMAFACGQAxAAwAUAIZIDAADFBZIDIpQDAADGBZQDIpUDAQD1BAAhBPYCAAAAkgMC9wIAAACSAwj4AgAAAJIDCIADAADlBJIDIgT2AgAAAJQDAvcCAAAAlAMI-AIAAACUAwiAAwAA4wSUAyIRBwAAvgUAIBcAAI4FACDoAgAAvQUAMOkCAABCABDqAgAAvQUAMOsCAQD0BAAh7QIBAPQEACH0AkAA-AQAIfUCQAD4BAAhnwMBAPQEACGgAwEA9QQAIaEDAQD1BAAhogMBAPUEACGjAyAA9gQAIaQDQAD3BAAh7wMAAEIAIPADAABCACADpwMAAD4AIKgDAAA-ACCpAwAAPgAgEQ8AAMoFACAQAADLBQAgGQAAwgUAIOgCAADJBQAw6QIAAD4AEOoCAADJBQAw6wIBAPQEACHsAgEA9AQAIfQCQAD4BAAh9QJAAPgEACGBAwEA9QQAIYIDAQD0BAAhgwMCAKgFACGEAxAAwAUAIYUDEADABQAhhgMQAMAFACGHAxAAwAUAIRYHAAC-BQAgEAAAywUAIBYAANUFACAbAADIBQAg6AIAAN4FADDpAgAAEQAQ6gIAAN4FADDrAgEA9AQAIe0CAQD0BAAh9AJAAPgEACH1AkAA-AQAIYIDAQD0BAAhlAMAAN8FywMilwMQANcFACGYAxAAwAUAIZkDQAD3BAAhmgMBAPUEACHHAwIAqAUAIcgDAQD1BAAhyQMCAKgFACHvAwAAEQAg8AMAABEAICYLAADZBQAgDAAA2gUAIA0AANsFACAPAACMBQAgEwAA3AUAIBQAAN0FACAVAACNBQAgFgAA1QUAIBsAAMgFACDoAgAA1gUAMOkCAAAXABDqAgAA1gUAMOsCAQD0BAAh9AJAAPgEACH1AkAA-AQAIYUDEADXBQAhlAMAANgF1AMimQNAAPcEACGbAwEA9QQAIZ8DAQD0BAAhowMgAPYEACGkA0AA9wQAIb8DAQD1BAAhwwMBAPUEACHHAwIAqAUAIcgDAQD1BAAhzAMBAPUEACHOAwEA9QQAIc8DEADABQAh0AMQANcFACHRAwEA9QQAIdIDAQD1BAAh1AMBAPUEACHVAwEA9QQAIdYDAQD1BAAh1wMBAPUEACHvAwAAFwAg8AMAABcAIBQHAAC-BQAgEAAAzgUAIOgCAADMBQAw6QIAADgAEOoCAADMBQAw6wIBAPQEACHtAgEA9AQAIfICAQD1BAAh9AJAAPgEACH1AkAA-AQAIYIDAQD1BAAhlAMAAM0FxgMivgMBAPQEACG_AwEA9QQAIcADAQD1BAAhwQMBAPUEACHCAwEA9QQAIcMDAQD1BAAhxAMBAPUEACHGAwEA9QQAIQT2AgAAAMYDAvcCAAAAxgMI-AIAAADGAwiAAwAAlAXGAyImCwAA2QUAIAwAANoFACANAADbBQAgDwAAjAUAIBMAANwFACAUAADdBQAgFQAAjQUAIBYAANUFACAbAADIBQAg6AIAANYFADDpAgAAFwAQ6gIAANYFADDrAgEA9AQAIfQCQAD4BAAh9QJAAPgEACGFAxAA1wUAIZQDAADYBdQDIpkDQAD3BAAhmwMBAPUEACGfAwEA9AQAIaMDIAD2BAAhpANAAPcEACG_AwEA9QQAIcMDAQD1BAAhxwMCAKgFACHIAwEA9QQAIcwDAQD1BAAhzgMBAPUEACHPAxAAwAUAIdADEADXBQAh0QMBAPUEACHSAwEA9QQAIdQDAQD1BAAh1QMBAPUEACHWAwEA9QQAIdcDAQD1BAAh7wMAABcAIPADAAAXACASDgAA0AUAIA8AAMoFACAQAADLBQAg6AIAAM8FADDpAgAAJwAQ6gIAAM8FADDrAgEA9AQAIfQCQAD4BAAh9QJAAPgEACGBAwEA9QQAIYIDAQD0BAAhgwMCAKgFACGHAxAAwAUAIZYDAQD0BAAhlwMQAMAFACGYAxAAwAUAIZkDQAD3BAAhmgMBAPUEACEZBwAAvgUAIA0AANQFACARAADVBQAg6AIAANIFADDpAgAAIwAQ6gIAANIFADDrAgEA9AQAIe0CAQD0BAAh8gIBAPUEACH0AkAA-AQAIfUCQAD4BAAhhgMQAMAFACGJAwEA9AQAIYsDEADABQAhjAMQAMAFACGNAxAAwAUAIY8DEADABQAhkAMQAMAFACGSAwAAxQWSAyKVAwEA9QQAIZsDAQD0BAAhnANAAPgEACGeAwAA0wWeAyLvAwAAIwAg8AMAACMAIALtAgEAAAABiQMBAAAAARcHAAC-BQAgDQAA1AUAIBEAANUFACDoAgAA0gUAMOkCAAAjABDqAgAA0gUAMOsCAQD0BAAh7QIBAPQEACHyAgEA9QQAIfQCQAD4BAAh9QJAAPgEACGGAxAAwAUAIYkDAQD0BAAhiwMQAMAFACGMAxAAwAUAIY0DEADABQAhjwMQAMAFACGQAxAAwAUAIZIDAADFBZIDIpUDAQD1BAAhmwMBAPQEACGcA0AA-AQAIZ4DAADTBZ4DIgT2AgAAAJ4DAvcCAAAAngMI-AIAAACeAwiAAwAA7QSeAyISCQAA-QQAIBIAAPoEACDoAgAA8wQAMOkCAAAgABDqAgAA8wQAMOsCAQD0BAAh9AJAAPgEACH1AkAA-AQAIZ8DAQD0BAAhoAMBAPUEACGhAwEA9QQAIaIDAQD1BAAhowMgAPYEACGkA0AA9wQAIaUDAQD1BAAhpgMgAPYEACHvAwAAIAAg8AMAACAAIAOnAwAAJwAgqAMAACcAIKkDAAAnACAkCwAA2QUAIAwAANoFACANAADbBQAgDwAAjAUAIBMAANwFACAUAADdBQAgFQAAjQUAIBYAANUFACAbAADIBQAg6AIAANYFADDpAgAAFwAQ6gIAANYFADDrAgEA9AQAIfQCQAD4BAAh9QJAAPgEACGFAxAA1wUAIZQDAADYBdQDIpkDQAD3BAAhmwMBAPUEACGfAwEA9AQAIaMDIAD2BAAhpANAAPcEACG_AwEA9QQAIcMDAQD1BAAhxwMCAKgFACHIAwEA9QQAIcwDAQD1BAAhzgMBAPUEACHPAxAAwAUAIdADEADXBQAh0QMBAPUEACHSAwEA9QQAIdQDAQD1BAAh1QMBAPUEACHWAwEA9QQAIdcDAQD1BAAhCPYCEAAAAAH3AhAAAAAF-AIQAAAABfkCEAAAAAH6AhAAAAAB-wIQAAAAAfwCEAAAAAGAAxAAmwUAIQT2AgAAANQDAvcCAAAA1AMI-AIAAADUAwiAAwAApQXUAyIPCQAA-QQAIOgCAAChBQAw6QIAABUAEOoCAAChBQAw6wIBAPQEACH0AkAA-AQAIfUCQAD4BAAhnwMBAPQEACGjAyAA9gQAIaQDQAD3BAAhpgMgAPYEACHMAwEA9QQAIc0DAQD0BAAh7wMAABUAIPADAAAVACAOCQAA-QQAIOgCAACfBQAw6QIAABwAEOoCAACfBQAw6wIBAPQEACH0AkAA-AQAIfUCQAD4BAAhnwMBAPQEACGjAyAA9gQAIaQDQAD3BAAhpgMgAPYEACHMAwEA9QQAIe8DAAAcACDwAwAAHAAgEgkAAPkEACASAAD6BAAg6AIAAPMEADDpAgAAIAAQ6gIAAPMEADDrAgEA9AQAIfQCQAD4BAAh9QJAAPgEACGfAwEA9AQAIaADAQD1BAAhoQMBAPUEACGiAwEA9QQAIaMDIAD2BAAhpANAAPcEACGlAwEA9QQAIaYDIAD2BAAh7wMAACAAIPADAAAgACAOCQAA-QQAIOgCAACdBQAw6QIAAC8AEOoCAACdBQAw6wIBAPQEACH0AkAA-AQAIfUCQAD4BAAhnwMBAPQEACGjAyAA9gQAIaQDQAD3BAAhpgMgAPYEACHLAwEA9AQAIe8DAAAvACDwAwAALwAgEAkAAPkEACDoAgAApwUAMOkCAAAzABDqAgAApwUAMOsCAQD0BAAh9AJAAPgEACH1AkAA-AQAIZ8DAQD0BAAhowMgAPYEACGkA0AA9wQAIaYDIAD2BAAhzAMBAPUEACHYAwIAqAUAIdkDAgCoBQAh7wMAADMAIPADAAAzACAUBwAAvgUAIBAAAMsFACAWAADVBQAgGwAAyAUAIOgCAADeBQAw6QIAABEAEOoCAADeBQAw6wIBAPQEACHtAgEA9AQAIfQCQAD4BAAh9QJAAPgEACGCAwEA9AQAIZQDAADfBcsDIpcDEADXBQAhmAMQAMAFACGZA0AA9wQAIZoDAQD1BAAhxwMCAKgFACHIAwEA9QQAIckDAgCoBQAhBPYCAAAAywMC9wIAAADLAwj4AgAAAMsDCIADAACZBcsDIhIDAACKBQAgBwAAvgUAIOgCAADgBQAw6QIAAA0AEOoCAADgBQAw6wIBAPQEACHtAgEA9AQAIfQCQAD4BAAh9QJAAPgEACGjAyAA9gQAIaQDQAD3BAAhpgMgAPYEACGqAwEA9AQAIasDIAD2BAAhrAMgAPYEACGtAyAA9gQAIa4DIAD2BAAhrwMgAPYEACERAwAAigUAIOgCAADhBQAw6QIAAAcAEOoCAADhBQAw6wIBAPQEACH0AkAA-AQAIfUCQAD4BAAhqgMBAPQEACHdAwEA9AQAId4DAQD0BAAh3wMBAPUEACHgAwEA9QQAIeEDAQD1BAAh4gNAAPcEACHjA0AA9wQAIeQDAQD1BAAh5QMBAPUEACEMAwAAigUAIOgCAADiBQAw6QIAAAMAEOoCAADiBQAw6wIBAPQEACH0AkAA-AQAIfUCQAD4BAAhqgMBAPQEACHcA0AA-AQAIeYDAQD0BAAh5wMBAPUEACHoAwEA9QQAIQAAAAAAAAH0AwEAAAABBfQDEAAAAAH6AxAAAAAB-wMQAAAAAfwDEAAAAAH9AxAAAAABAfQDAAAA8AICAfQDQAAAAAEB9AMBAAAAAQUsAACJCwAgLQAAjwsAIPEDAACKCwAg8gMAAI4LACD3AwAARgAgBSwAAIcLACAtAACMCwAg8QMAAIgLACDyAwAAiwsAIPcDAAD5AgAgAywAAIkLACDxAwAAigsAIPcDAABGACADLAAAhwsAIPEDAACICwAg9wMAAPkCACAAAAAAAAX0AwIAAAAB-gMCAAAAAfsDAgAAAAH8AwIAAAAB_QMCAAAAAQUsAAD8CgAgLQAAhQsAIPEDAAD9CgAg8gMAAIQLACD3AwAARgAgBywAAPoKACAtAACCCwAg8QMAAPsKACDyAwAAgQsAIPUDAAARACD2AwAAEQAg9wMAABMAIAUsAAD4CgAgLQAA_woAIPEDAAD5CgAg8gMAAP4KACD3AwAAGQAgAywAAPwKACDxAwAA_QoAIPcDAABGACADLAAA-goAIPEDAAD7CgAg9wMAABMAIAMsAAD4CgAg8QMAAPkKACD3AwAAGQAgAAAAAAAB9AMAAACSAwIB9AMAAACUAwIFLAAA7goAIC0AAPYKACDxAwAA7woAIPIDAAD1CgAg9wMAAPkCACAHLAAA7AoAIC0AAPMKACDxAwAA7QoAIPIDAADyCgAg9QMAAEIAIPYDAABCACD3AwAAXQAgCywAAJUGADAtAACaBgAw8QMAAJYGADDyAwAAlwYAMPMDAACYBgAg9AMAAJkGADD1AwAAmQYAMPYDAACZBgAw9wMAAJkGADD4AwAAmwYAMPkDAACcBgAwCywAAIkGADAtAACOBgAw8QMAAIoGADDyAwAAiwYAMPMDAACMBgAg9AMAAI0GADD1AwAAjQYAMPYDAACNBgAw9wMAAI0GADD4AwAAjwYAMPkDAACQBgAwCgcAAPEFACDrAgEAAAAB7QIBAAAAAe4CEAAAAAHwAgAAAPACAvECQAAAAAHyAgEAAAAB8wIBAAAAAfQCQAAAAAH1AkAAAAABAgAAAEwAICwAAJQGACADAAAATAAgLAAAlAYAIC0AAJMGACABJQAA8QoAMA8HAAC-BQAgGQAAwgUAIOgCAAC_BQAw6QIAAEoAEOoCAAC_BQAw6wIBAAAAAewCAQD0BAAh7QIBAPQEACHuAhAAwAUAIfACAADBBfACIvECQAD4BAAh8gIBAPUEACHzAgEA9QQAIfQCQAD4BAAh9QJAAPgEACECAAAATAAgJQAAkwYAIAIAAACRBgAgJQAAkgYAIA3oAgAAkAYAMOkCAACRBgAQ6gIAAJAGADDrAgEA9AQAIewCAQD0BAAh7QIBAPQEACHuAhAAwAUAIfACAADBBfACIvECQAD4BAAh8gIBAPUEACHzAgEA9QQAIfQCQAD4BAAh9QJAAPgEACEN6AIAAJAGADDpAgAAkQYAEOoCAACQBgAw6wIBAPQEACHsAgEA9AQAIe0CAQD0BAAh7gIQAMAFACHwAgAAwQXwAiLxAkAA-AQAIfICAQD1BAAh8wIBAPUEACH0AkAA-AQAIfUCQAD4BAAhCesCAQDpBQAh7QIBAOkFACHuAhAA6gUAIfACAADrBfACIvECQADsBQAh8gIBAO0FACHzAgEA7QUAIfQCQADsBQAh9QJAAOwFACEKBwAA7wUAIOsCAQDpBQAh7QIBAOkFACHuAhAA6gUAIfACAADrBfACIvECQADsBQAh8gIBAO0FACHzAgEA7QUAIfQCQADsBQAh9QJAAOwFACEKBwAA8QUAIOsCAQAAAAHtAgEAAAAB7gIQAAAAAfACAAAA8AIC8QJAAAAAAfICAQAAAAHzAgEAAAAB9AJAAAAAAfUCQAAAAAEMDwAA_AUAIBAAAP0FACDrAgEAAAAB9AJAAAAAAfUCQAAAAAGBAwEAAAABggMBAAAAAYMDAgAAAAGEAxAAAAABhQMQAAAAAYYDEAAAAAGHAxAAAAABAgAAAEAAICwAAKAGACADAAAAQAAgLAAAoAYAIC0AAJ8GACABJQAA8AoAMBEPAADKBQAgEAAAywUAIBkAAMIFACDoAgAAyQUAMOkCAAA-ABDqAgAAyQUAMOsCAQAAAAHsAgEA9AQAIfQCQAD4BAAh9QJAAPgEACGBAwEA9QQAIYIDAQD0BAAhgwMCAKgFACGEAxAAwAUAIYUDEADABQAhhgMQAMAFACGHAxAAwAUAIQIAAABAACAlAACfBgAgAgAAAJ0GACAlAACeBgAgDugCAACcBgAw6QIAAJ0GABDqAgAAnAYAMOsCAQD0BAAh7AIBAPQEACH0AkAA-AQAIfUCQAD4BAAhgQMBAPUEACGCAwEA9AQAIYMDAgCoBQAhhAMQAMAFACGFAxAAwAUAIYYDEADABQAhhwMQAMAFACEO6AIAAJwGADDpAgAAnQYAEOoCAACcBgAw6wIBAPQEACHsAgEA9AQAIfQCQAD4BAAh9QJAAPgEACGBAwEA9QQAIYIDAQD0BAAhgwMCAKgFACGEAxAAwAUAIYUDEADABQAhhgMQAMAFACGHAxAAwAUAIQrrAgEA6QUAIfQCQADsBQAh9QJAAOwFACGBAwEA7QUAIYIDAQDpBQAhgwMCAPcFACGEAxAA6gUAIYUDEADqBQAhhgMQAOoFACGHAxAA6gUAIQwPAAD5BQAgEAAA-gUAIOsCAQDpBQAh9AJAAOwFACH1AkAA7AUAIYEDAQDtBQAhggMBAOkFACGDAwIA9wUAIYQDEADqBQAhhQMQAOoFACGGAxAA6gUAIYcDEADqBQAhDA8AAPwFACAQAAD9BQAg6wIBAAAAAfQCQAAAAAH1AkAAAAABgQMBAAAAAYIDAQAAAAGDAwIAAAABhAMQAAAAAYUDEAAAAAGGAxAAAAABhwMQAAAAAQMsAADuCgAg8QMAAO8KACD3AwAA-QIAIAMsAADsCgAg8QMAAO0KACD3AwAAXQAgBCwAAJUGADDxAwAAlgYAMPMDAACYBgAg9wMAAJkGADAELAAAiQYAMPEDAACKBgAw8wMAAIwGACD3AwAAjQYAMAAAAAAAAfQDQAAAAAEFLAAA4QoAIC0AAOoKACDxAwAA4goAIPIDAADpCgAg9wMAACUAIAcsAADfCgAgLQAA5woAIPEDAADgCgAg8gMAAOYKACD1AwAAEQAg9gMAABEAIPcDAAATACAFLAAA3QoAIC0AAOQKACDxAwAA3goAIPIDAADjCgAg9wMAABkAIAMsAADhCgAg8QMAAOIKACD3AwAAJQAgAywAAN8KACDxAwAA4AoAIPcDAAATACADLAAA3QoAIPEDAADeCgAg9wMAABkAIAAAAAAAAfQDAAAAngMCBSwAANQKACAtAADbCgAg8QMAANUKACDyAwAA2goAIPcDAAD5AgAgBSwAANIKACAtAADYCgAg8QMAANMKACDyAwAA1woAIPcDAACnAwAgCywAALoGADAtAAC_BgAw8QMAALsGADDyAwAAvAYAMPMDAAC9BgAg9AMAAL4GADD1AwAAvgYAMPYDAAC-BgAw9wMAAL4GADD4AwAAwAYAMPkDAADBBgAwDQ8AAK8GACAQAACwBgAg6wIBAAAAAfQCQAAAAAH1AkAAAAABgQMBAAAAAYIDAQAAAAGDAwIAAAABhwMQAAAAAZcDEAAAAAGYAxAAAAABmQNAAAAAAZoDAQAAAAECAAAAKQAgLAAAxQYAIAMAAAApACAsAADFBgAgLQAAxAYAIAElAADWCgAwEg4AANAFACAPAADKBQAgEAAAywUAIOgCAADPBQAw6QIAACcAEOoCAADPBQAw6wIBAAAAAfQCQAD4BAAh9QJAAPgEACGBAwEA9QQAIYIDAQD0BAAhgwMCAKgFACGHAxAAwAUAIZYDAQD0BAAhlwMQAMAFACGYAxAAwAUAIZkDQAD3BAAhmgMBAPUEACECAAAAKQAgJQAAxAYAIAIAAADCBgAgJQAAwwYAIA_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_AwEAAAABwwMBAAAAAccDAgAAAAHIAwEAAAABzAMBAAAAAc4DAQAAAAHPAxAAAAAB0AMQAAAAAdEDAQAAAAHSAwEAAAAB1AMBAAAAAdUDAQAAAAHWAwEAAAAB1wMBAAAAAQIAAAAZACAsAADJBwAgAwAAABkAICwAAMkHACAtAAD6BgAgASUAAMoKADAkCwAA2QUAIAwAANoFACANAADbBQAgDwAAjAUAIBMAANwFACAUAADdBQAgFQAAjQUAIBYAANUFACAbAADIBQAg6AIAANYFADDpAgAAFwAQ6gIAANYFADDrAgEAAAAB9AJAAPgEACH1AkAA-AQAIYUDEADXBQAhlAMAANgF1AMimQNAAPcEACGbAwEA9QQAIZ8DAQD0BAAhowMgAPYEACGkA0AA9wQAIb8DAQD1BAAhwwMBAPUEACHHAwIAqAUAIcgDAQD1BAAhzAMBAPUEACHOAwEA9QQAIc8DEADABQAh0AMQANcFACHRAwEA9QQAIdIDAQD1BAAh1AMBAPUEACHVAwEA9QQAIdYDAQD1BAAh1wMBAPUEACECAAAAGQAgJQAA-gYAIAIAAAD2BgAgJQAA9wYAIBvoAgAA9QYAMOkCAAD2BgAQ6gIAAPUGADDrAgEA9AQAIfQCQAD4BAAh9QJAAPgEACGFAxAA1wUAIZQDAADYBdQDIpkDQAD3BAAhmwMBAPUEACGfAwEA9AQAIaMDIAD2BAAhpANAAPcEACG_AwEA9QQAIcMDAQD1BAAhxwMCAKgFACHIAwEA9QQAIcwDAQD1BAAhzgMBAPUEACHPAxAAwAUAIdADEADXBQAh0QMBAPUEACHSAwEA9QQAIdQDAQD1BAAh1QMBAPUEACHWAwEA9QQAIdcDAQD1BAAhG-gCAAD1BgAw6QIAAPYGABDqAgAA9QYAMOsCAQD0BAAh9AJAAPgEACH1AkAA-AQAIYUDEADXBQAhlAMAANgF1AMimQNAAPcEACGbAwEA9QQAIZ8DAQD0BAAhowMgAPYEACGkA0AA9wQAIb8DAQD1BAAhwwMBAPUEACHHAwIAqAUAIcgDAQD1BAAhzAMBAPUEACHOAwEA9QQAIc8DEADABQAh0AMQANcFACHRAwEA9QQAIdIDAQD1BAAh1AMBAPUEACHVAwEA9QQAIdYDAQD1BAAh1wMBAPUEACEX6wIBAOkFACH0AkAA7AUAIfUCQADsBQAhhQMQAPgGACGUAwAA-QbUAyKZA0AAqgYAIZ8DAQDpBQAhowMgAMwGACGkA0AAqgYAIb8DAQDtBQAhwwMBAO0FACHHAwIA9wUAIcgDAQDtBQAhzAMBAO0FACHOAwEA7QUAIc8DEADqBQAh0AMQAPgGACHRAwEA7QUAIdIDAQDtBQAh1AMBAO0FACHVAwEA7QUAIdYDAQDtBQAh1wMBAO0FACEF9AMQAAAAAfoDEAAAAAH7AxAAAAAB_AMQAAAAAf0DEAAAAAEB9AMAAADUAwIfCwAA-wYAIAwAAPwGACAPAAD_BgAgEwAA_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-AQAIYIDAQD1BAAhlAMAAM0FxgMivgMBAPQEACG_AwEA9QQAIcADAQD1BAAhwQMBAPUEACHCAwEA9QQAIcMDAQD1BAAhxAMBAPUEACHGAwEA9QQAIQIAAAA6ACAlAACgBwAgAgAAAJ0HACAlAACeBwAgEugCAACcBwAw6QIAAJ0HABDqAgAAnAcAMOsCAQD0BAAh7QIBAPQEACHyAgEA9QQAIfQCQAD4BAAh9QJAAPgEACGCAwEA9QQAIZQDAADNBcYDIr4DAQD0BAAhvwMBAPUEACHAAwEA9QQAIcEDAQD1BAAhwgMBAPUEACHDAwEA9QQAIcQDAQD1BAAhxgMBAPUEACES6AIAAJwHADDpAgAAnQcAEOoCAACcBwAw6wIBAPQEACHtAgEA9AQAIfICAQD1BAAh9AJAAPgEACH1AkAA-AQAIYIDAQD1BAAhlAMAAM0FxgMivgMBAPQEACG_AwEA9QQAIcADAQD1BAAhwQMBAPUEACHCAwEA9QQAIcMDAQD1BAAhxAMBAPUEACHGAwEA9QQAIQ7rAgEA6QUAIe0CAQDpBQAh8gIBAO0FACH0AkAA7AUAIfUCQADsBQAhlAMAAJ8HxgMivgMBAOkFACG_AwEA7QUAIcADAQDtBQAhwQMBAO0FACHCAwEA7QUAIcMDAQDtBQAhxAMBAO0FACHGAwEA7QUAIQH0AwAAAMYDAg8HAAChBwAg6wIBAOkFACHtAgEA6QUAIfICAQDtBQAh9AJAAOwFACH1AkAA7AUAIZQDAACfB8YDIr4DAQDpBQAhvwMBAO0FACHAAwEA7QUAIcEDAQDtBQAhwgMBAO0FACHDAwEA7QUAIcQDAQDtBQAhxgMBAO0FACEFLAAAtgoAIC0AALkKACDxAwAAtwoAIPIDAAC4CgAg9wMAAPkCACAPBwAAowcAIOsCAQAAAAHtAgEAAAAB8gIBAAAAAfQCQAAAAAH1AkAAAAABlAMAAADGAwK-AwEAAAABvwMBAAAAAcADAQAAAAHBAwEAAAABwgMBAAAAAcMDAQAAAAHEAwEAAAABxgMBAAAAAQMsAAC2CgAg8QMAALcKACD3AwAA-QIAIA8HAADGBwAgFgAAxwcAIBsAAMgHACDrAgEAAAAB7QIBAAAAAfQCQAAAAAH1AkAAAAABlAMAAADLAwKXAxAAAAABmAMQAAAAAZkDQAAAAAGaAwEAAAABxwMCAAAAAcgDAQAAAAHJAwIAAAABAgAAABMAICwAAMUHACADAAAAEwAgLAAAxQcAIC0AAK8HACABJQAAtQoAMBQHAAC-BQAgEAAAywUAIBYAANUFACAbAADIBQAg6AIAAN4FADDpAgAAEQAQ6gIAAN4FADDrAgEAAAAB7QIBAPQEACH0AkAA-AQAIfUCQAD4BAAhggMBAPQEACGUAwAA3wXLAyKXAxAA1wUAIZgDEADABQAhmQNAAPcEACGaAwEA9QQAIccDAgCoBQAhyAMBAPUEACHJAwIAqAUAIQIAAAATACAlAACvBwAgAgAAAKwHACAlAACtBwAgEOgCAACrBwAw6QIAAKwHABDqAgAAqwcAMOsCAQD0BAAh7QIBAPQEACH0AkAA-AQAIfUCQAD4BAAhggMBAPQEACGUAwAA3wXLAyKXAxAA1wUAIZgDEADABQAhmQNAAPcEACGaAwEA9QQAIccDAgCoBQAhyAMBAPUEACHJAwIAqAUAIRDoAgAAqwcAMOkCAACsBwAQ6gIAAKsHADDrAgEA9AQAIe0CAQD0BAAh9AJAAPgEACH1AkAA-AQAIYIDAQD0BAAhlAMAAN8FywMilwMQANcFACGYAxAAwAUAIZkDQAD3BAAhmgMBAPUEACHHAwIAqAUAIcgDAQD1BAAhyQMCAKgFACEM6wIBAOkFACHtAgEA6QUAIfQCQADsBQAh9QJAAOwFACGUAwAArgfLAyKXAxAA-AYAIZgDEADqBQAhmQNAAKoGACGaAwEA7QUAIccDAgD3BQAhyAMBAO0FACHJAwIA9wUAIQH0AwAAAMsDAg8HAACwBwAgFgAAsQcAIBsAALIHACDrAgEA6QUAIe0CAQDpBQAh9AJAAOwFACH1AkAA7AUAIZQDAACuB8sDIpcDEAD4BgAhmAMQAOoFACGZA0AAqgYAIZoDAQDtBQAhxwMCAPcFACHIAwEA7QUAIckDAgD3BQAhBSwAAK4KACAtAACzCgAg8QMAAK8KACDyAwAAsgoAIPcDAAD5AgAgCywAALwHADAtAADABwAw8QMAAL0HADDyAwAAvgcAMPMDAAC_BwAg9AMAAL4GADD1AwAAvgYAMPYDAAC-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-gMCAAAAAfsDAgAAAAH8AwIAAAAB_QMCAAAAAQH0AwAAALwDAgUsAACGCgAgLQAAmgoAIPEDAACHCgAg8gMAAJkKACD3AwAAAQAgCywAAKoIADAtAACvCAAw8QMAAKsIADDyAwAArAgAMPMDAACtCAAg9AMAAK4IADD1AwAArggAMPYDAACuCAAw9wMAAK4IADD4AwAAsAgAMPkDAACxCAAwCywAAJ8IADAtAACjCAAw8QMAAKAIADDyAwAAoQgAMPMDAACiCAAg9AMAAKgHADD1AwAAqAcAMPYDAACoBwAw9wMAAKgHADD4AwAApAgAMPkDAACrBwAwCywAAJQIADAtAACYCAAw8QMAAJUIADDyAwAAlggAMPMDAACXCAAg9AMAAJkHADD1AwAAmQcAMPYDAACZBwAw9wMAAJkHADD4AwAAmQgAMPkDAACcBwAwCywAAIsIADAtAACPCAAw8QMAAIwIADDyAwAAjQgAMPMDAACOCAAg9AMAAOYGADD1AwAA5gYAMPYDAADmBgAw9wMAAOYGADD4AwAAkAgAMPkDAADpBgAwCywAAIIIADAtAACGCAAw8QMAAIMIADDyAwAAhAgAMPMDAACFCAAg9AMAANMGADD1AwAA0wYAMPYDAADTBgAw9wMAANMGADD4AwAAhwgAMPkDAADWBgAwCywAAPYHADAtAAD7BwAw8QMAAPcHADDyAwAA-AcAMPMDAAD5BwAg9AMAAPoHADD1AwAA-gcAMPYDAAD6BwAw9wMAAPoHADD4AwAA_AcAMPkDAAD9BwAwCywAAO0HADAtAADxBwAw8QMAAO4HADDyAwAA7wcAMPMDAADwBwAg9AMAAI0GADD1AwAAjQYAMPYDAACNBgAw9wMAAI0GADD4AwAA8gcAMPkDAACQBgAwChkAAPAFACDrAgEAAAAB7AIBAAAAAe4CEAAAAAHwAgAAAPACAvECQAAAAAHyAgEAAAAB8wIBAAAAAfQCQAAAAAH1AkAAAAABAgAAAEwAICwAAPUHACADAAAATAAgLAAA9QcAIC0AAPQHACABJQAAmAoAMAIAAABMACAlAAD0BwAgAgAAAJEGACAlAADzBwAgCesCAQDpBQAh7AIBAOkFACHuAhAA6gUAIfACAADrBfACIvECQADsBQAh8gIBAO0FACHzAgEA7QUAIfQCQADsBQAh9QJAAOwFACEKGQAA7gUAIOsCAQDpBQAh7AIBAOkFACHuAhAA6gUAIfACAADrBfACIvECQADsBQAh8gIBAO0FACHzAgEA7QUAIfQCQADsBQAh9QJAAOwFACEKGQAA8AUAIOsCAQAAAAHsAgEAAAAB7gIQAAAAAfACAAAA8AIC8QJAAAAAAfICAQAAAAHzAgEAAAAB9AJAAAAAAfUCQAAAAAEKFwAA3AYAIOsCAQAAAAH0AkAAAAAB9QJAAAAAAZ8DAQAAAAGgAwEAAAABoQMBAAAAAaIDAQAAAAGjAyAAAAABpANAAAAAAQIAAABdACAsAACBCAAgAwAAAF0AICwAAIEIACAtAACACAAgASUAAJcKADAPBwAAvgUAIBcAAI4FACDoAgAAvQUAMOkCAABCABDqAgAAvQUAMOsCAQAAAAHtAgEA9AQAIfQCQAD4BAAh9QJAAPgEACGfAwEA9AQAIaADAQD1BAAhoQMBAPUEACGiAwEA9QQAIaMDIAD2BAAhpANAAPcEACECAAAAXQAgJQAAgAgAIAIAAAD-BwAgJQAA_wcAIA3oAgAA_QcAMOkCAAD-BwAQ6gIAAP0HADDrAgEA9AQAIe0CAQD0BAAh9AJAAPgEACH1AkAA-AQAIZ8DAQD0BAAhoAMBAPUEACGhAwEA9QQAIaIDAQD1BAAhowMgAPYEACGkA0AA9wQAIQ3oAgAA_QcAMOkCAAD-BwAQ6gIAAP0HADDrAgEA9AQAIe0CAQD0BAAh9AJAAPgEACH1AkAA-AQAIZ8DAQD0BAAhoAMBAPUEACGhAwEA9QQAIaIDAQD1BAAhowMgAPYEACGkA0AA9wQAIQnrAgEA6QUAIfQCQADsBQAh9QJAAOwFACGfAwEA6QUAIaADAQDtBQAhoQMBAO0FACGiAwEA7QUAIaMDIADMBgAhpANAAKoGACEKFwAAzgYAIOsCAQDpBQAh9AJAAOwFACH1AkAA7AUAIZ8DAQDpBQAhoAMBAO0FACGhAwEA7QUAIaIDAQDtBQAhowMgAMwGACGkA0AAqgYAIQoXAADcBgAg6wIBAAAAAfQCQAAAAAH1AkAAAAABnwMBAAAAAaADAQAAAAGhAwEAAAABogMBAAAAAaMDIAAAAAGkA0AAAAABFREAAKMGACAYAACiBgAgGgAApAYAIOsCAQAAAAHwAgAAAPACAvICAQAAAAH0AkAAAAAB9QJAAAAAAYYDEAAAAAGIAwEAAAABiQMBAAAAAYoDQAAAAAGLAxAAAAABjAMQAAAAAY0DEAAAAAGOAxAAAAABjwMQAAAAAZADEAAAAAGSAwAAAJIDApQDAAAAlAMClQMBAAAAAQIAAABGACAsAACKCAAgAwAAAEYAICwAAIoIACAtAACJCAAgASUAAJYKADACAAAARgAgJQAAiQgAIAIAAADXBgAgJQAAiAgAIBLrAgEA6QUAIfACAADrBfACIvICAQDtBQAh9AJAAOwFACH1AkAA7AUAIYYDEADqBQAhiAMBAO0FACGJAwEA6QUAIYoDQADsBQAhiwMQAOoFACGMAxAA6gUAIY0DEADqBQAhjgMQAOoFACGPAxAA6gUAIZADEADqBQAhkgMAAIMGkgMilAMAAIQGlAMilQMBAO0FACEVEQAAhwYAIBgAAIYGACAaAACIBgAg6wIBAOkFACHwAgAA6wXwAiLyAgEA7QUAIfQCQADsBQAh9QJAAOwFACGGAxAA6gUAIYgDAQDtBQAhiQMBAOkFACGKA0AA7AUAIYsDEADqBQAhjAMQAOoFACGNAxAA6gUAIY4DEADqBQAhjwMQAOoFACGQAxAA6gUAIZIDAACDBpIDIpQDAACEBpQDIpUDAQDtBQAhFREAAKMGACAYAACiBgAgGgAApAYAIOsCAQAAAAHwAgAAAPACAvICAQAAAAH0AkAAAAAB9QJAAAAAAYYDEAAAAAGIAwEAAAABiQMBAAAAAYoDQAAAAAGLAxAAAAABjAMQAAAAAY0DEAAAAAGOAxAAAAABjwMQAAAAAZADEAAAAAGSAwAAAJIDApQDAAAAlAMClQMBAAAAARINAADHBgAgEQAAyAYAIOsCAQAAAAHyAgEAAAAB9AJAAAAAAfUCQAAAAAGGAxAAAAABiQMBAAAAAYsDEAAAAAGMAxAAAAABjQMQAAAAAY8DEAAAAAGQAxAAAAABkgMAAACSAwKVAwEAAAABmwMBAAAAAZwDQAAAAAGeAwAAAJ4DAgIAAAAlACAsAACTCAAgAwAAACUAICwAAJMIACAtAACSCAAgASUAAJUKADACAAAAJQAgJQAAkggAIAIAAADqBgAgJQAAkQgAIBDrAgEA6QUAIfICAQDtBQAh9AJAAOwFACH1AkAA7AUAIYYDEADqBQAhiQMBAOkFACGLAxAA6gUAIYwDEADqBQAhjQMQAOoFACGPAxAA6gUAIZADEADqBQAhkgMAAIMGkgMilQMBAO0FACGbAwEA6QUAIZwDQADsBQAhngMAALYGngMiEg0AALgGACARAAC5BgAg6wIBAOkFACHyAgEA7QUAIfQCQADsBQAh9QJAAOwFACGGAxAA6gUAIYkDAQDpBQAhiwMQAOoFACGMAxAA6gUAIY0DEADqBQAhjwMQAOoFACGQAxAA6gUAIZIDAACDBpIDIpUDAQDtBQAhmwMBAOkFACGcA0AA7AUAIZ4DAAC2Bp4DIhINAADHBgAgEQAAyAYAIOsCAQAAAAHyAgEAAAAB9AJAAAAAAfUCQAAAAAGGAxAAAAABiQMBAAAAAYsDEAAAAAGMAxAAAAABjQMQAAAAAY8DEAAAAAGQAxAAAAABkgMAAACSAwKVAwEAAAABmwMBAAAAAZwDQAAAAAGeAwAAAJ4DAg8QAACeCAAg6wIBAAAAAfICAQAAAAH0AkAAAAAB9QJAAAAAAYIDAQAAAAGUAwAAAMYDAr4DAQAAAAG_AwEAAAABwAMBAAAAAcEDAQAAAAHCAwEAAAABwwMBAAAAAcQDAQAAAAHGAwEAAAABAgAAADoAICwAAJ0IACADAAAAOgAgLAAAnQgAIC0AAJsIACABJQAAlAoAMAIAAAA6ACAlAACbCAAgAgAAAJ0HACAlAACaCAAgDusCAQDpBQAh8gIBAO0FACH0AkAA7AUAIfUCQADsBQAhggMBAO0FACGUAwAAnwfGAyK-AwEA6QUAIb8DAQDtBQAhwAMBAO0FACHBAwEA7QUAIcIDAQDtBQAhwwMBAO0FACHEAwEA7QUAIcYDAQDtBQAhDxAAAJwIACDrAgEA6QUAIfICAQDtBQAh9AJAAOwFACH1AkAA7AUAIYIDAQDtBQAhlAMAAJ8HxgMivgMBAOkFACG_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-wYAIAwAAPwGACANAADZCAAgDwAA_wYAIBQAAP4GACAVAACABwAgFgAAgQcAIBsAAIIHACDrAgEA6QUAIfQCQADsBQAh9QJAAOwFACGFAxAA-AYAIZQDAAD5BtQDIpkDQACqBgAhmwMBAO0FACGfAwEA6QUAIaMDIADMBgAhpANAAKoGACG_AwEA7QUAIcMDAQDtBQAhxwMCAPcFACHIAwEA7QUAIcwDAQDtBQAhzgMBAO0FACHPAxAA6gUAIdADEAD4BgAh0QMBAO0FACHSAwEA7QUAIdQDAQDtBQAh1QMBAO0FACHXAwEA7QUAIQcsAACACgAgLQAAgwoAIPEDAACBCgAg8gMAAIIKACD1AwAAIAAg9gMAACAAIPcDAACnAwAgHwsAAMoHACAMAADLBwAgDQAA2wgAIA8AAM4HACAUAADNBwAgFQAAzwcAIBYAANAHACAbAADRBwAg6wIBAAAAAfQCQAAAAAH1AkAAAAABhQMQAAAAAZQDAAAA1AMCmQNAAAAAAZsDAQAAAAGfAwEAAAABowMgAAAAAaQDQAAAAAG_AwEAAAABwwMBAAAAAccDAgAAAAHIAwEAAAABzAMBAAAAAc4DAQAAAAHPAxAAAAAB0AMQAAAAAdEDAQAAAAHSAwEAAAAB1AMBAAAAAdUDAQAAAAHXAwEAAAABAywAAIAKACDxAwAAgQoAIPcDAACnAwAgBCwAANEIADDxAwAA0ggAMPMDAADUCAAg9wMAAPIGADAAAAALLAAA4QgAMC0AAOUIADDxAwAA4ggAMPIDAADjCAAw8wMAAOQIACD0AwAA8gYAMPUDAADyBgAw9gMAAPIGADD3AwAA8gYAMPgDAADmCAAw-QMAAPUGADAfCwAAygcAIA0AANsIACAPAADOBwAgEwAAzAcAIBQAAM0HACAVAADPBwAgFgAA0AcAIBsAANEHACDrAgEAAAAB9AJAAAAAAfUCQAAAAAGFAxAAAAABlAMAAADUAwKZA0AAAAABmwMBAAAAAZ8DAQAAAAGjAyAAAAABpANAAAAAAb8DAQAAAAHDAwEAAAABxwMCAAAAAcgDAQAAAAHMAwEAAAABzgMBAAAAAc8DEAAAAAHQAxAAAAAB0QMBAAAAAdIDAQAAAAHUAwEAAAAB1gMBAAAAAdcDAQAAAAECAAAAGQAgLAAA6QgAIAMAAAAZACAsAADpCAAgLQAA6AgAIAElAAD_CQAwAgAAABkAICUAAOgIACACAAAA9gYAICUAAOcIACAX6wIBAOkFACH0AkAA7AUAIfUCQADsBQAhhQMQAPgGACGUAwAA-QbUAyKZA0AAqgYAIZsDAQDtBQAhnwMBAOkFACGjAyAAzAYAIaQDQACqBgAhvwMBAO0FACHDAwEA7QUAIccDAgD3BQAhyAMBAO0FACHMAwEA7QUAIc4DAQDtBQAhzwMQAOoFACHQAxAA-AYAIdEDAQDtBQAh0gMBAO0FACHUAwEA7QUAIdYDAQDtBQAh1wMBAO0FACEfCwAA-wYAIA0AANkIACAPAAD_BgAgEwAA_QYAIBQAAP4GACAVAACABwAgFgAAgQcAIBsAAIIHACDrAgEA6QUAIfQCQADsBQAh9QJAAOwFACGFAxAA-AYAIZQDAAD5BtQDIpkDQACqBgAhmwMBAO0FACGfAwEA6QUAIaMDIADMBgAhpANAAKoGACG_AwEA7QUAIcMDAQDtBQAhxwMCAPcFACHIAwEA7QUAIcwDAQDtBQAhzgMBAO0FACHPAxAA6gUAIdADEAD4BgAh0QMBAO0FACHSAwEA7QUAIdQDAQDtBQAh1gMBAO0FACHXAwEA7QUAIR8LAADKBwAgDQAA2wgAIA8AAM4HACATAADMBwAgFAAAzQcAIBUAAM8HACAWAADQBwAgGwAA0QcAIOsCAQAAAAH0AkAAAAAB9QJAAAAAAYUDEAAAAAGUAwAAANQDApkDQAAAAAGbAwEAAAABnwMBAAAAAaMDIAAAAAGkA0AAAAABvwMBAAAAAcMDAQAAAAHHAwIAAAAByAMBAAAAAcwDAQAAAAHOAwEAAAABzwMQAAAAAdADEAAAAAHRAwEAAAAB0gMBAAAAAdQDAQAAAAHWAwEAAAAB1wMBAAAAAQQsAADhCAAw8QMAAOIIADDzAwAA5AgAIPcDAADyBgAwAAAACywAAO8IADAtAADzCAAw8QMAAPAIADDyAwAA8QgAMPMDAADyCAAg9AMAAPIGADD1AwAA8gYAMPYDAADyBgAw9wMAAPIGADD4AwAA9AgAMPkDAAD1BgAwHwwAAMsHACANAADbCAAgDwAAzgcAIBMAAMwHACAUAADNBwAgFQAAzwcAIBYAANAHACAbAADRBwAg6wIBAAAAAfQCQAAAAAH1AkAAAAABhQMQAAAAAZQDAAAA1AMCmQNAAAAAAZsDAQAAAAGfAwEAAAABowMgAAAAAaQDQAAAAAG_AwEAAAABwwMBAAAAAccDAgAAAAHIAwEAAAABzAMBAAAAAc4DAQAAAAHPAxAAAAAB0AMQAAAAAdEDAQAAAAHSAwEAAAAB1QMBAAAAAdYDAQAAAAHXAwEAAAABAgAAABkAICwAAPcIACADAAAAGQAgLAAA9wgAIC0AAPYIACABJQAA_gkAMAIAAAAZACAlAAD2CAAgAgAAAPYGACAlAAD1CAAgF-sCAQDpBQAh9AJAAOwFACH1AkAA7AUAIYUDEAD4BgAhlAMAAPkG1AMimQNAAKoGACGbAwEA7QUAIZ8DAQDpBQAhowMgAMwGACGkA0AAqgYAIb8DAQDtBQAhwwMBAO0FACHHAwIA9wUAIcgDAQDtBQAhzAMBAO0FACHOAwEA7QUAIc8DEADqBQAh0AMQAPgGACHRAwEA7QUAIdIDAQDtBQAh1QMBAO0FACHWAwEA7QUAIdcDAQDtBQAhHwwAAPwGACANAADZCAAgDwAA_wYAIBMAAP0GACAUAAD-BgAgFQAAgAcAIBYAAIEHACAbAACCBwAg6wIBAOkFACH0AkAA7AUAIfUCQADsBQAhhQMQAPgGACGUAwAA-QbUAyKZA0AAqgYAIZsDAQDtBQAhnwMBAOkFACGjAyAAzAYAIaQDQACqBgAhvwMBAO0FACHDAwEA7QUAIccDAgD3BQAhyAMBAO0FACHMAwEA7QUAIc4DAQDtBQAhzwMQAOoFACHQAxAA-AYAIdEDAQDtBQAh0gMBAO0FACHVAwEA7QUAIdYDAQDtBQAh1wMBAO0FACEfDAAAywcAIA0AANsIACAPAADOBwAgEwAAzAcAIBQAAM0HACAVAADPBwAgFgAA0AcAIBsAANEHACDrAgEAAAAB9AJAAAAAAfUCQAAAAAGFAxAAAAABlAMAAADUAwKZA0AAAAABmwMBAAAAAZ8DAQAAAAGjAyAAAAABpANAAAAAAb8DAQAAAAHDAwEAAAABxwMCAAAAAcgDAQAAAAHMAwEAAAABzgMBAAAAAc8DEAAAAAHQAxAAAAAB0QMBAAAAAdIDAQAAAAHVAwEAAAAB1gMBAAAAAdcDAQAAAAEELAAA7wgAMPEDAADwCAAw8wMAAPIIACD3AwAA8gYAMAAAAAAAAAAAAAALLAAAhAkAMC0AAIgJADDxAwAAhQkAMPIDAACGCQAw8wMAAIcJACD0AwAA8gYAMPUDAADyBgAw9gMAAPIGADD3AwAA8gYAMPgDAACJCQAw-QMAAPUGADAfCwAAygcAIAwAAMsHACANAADbCAAgDwAAzgcAIBMAAMwHACAVAADPBwAgFgAA0AcAIBsAANEHACDrAgEAAAAB9AJAAAAAAfUCQAAAAAGFAxAAAAABlAMAAADUAwKZA0AAAAABmwMBAAAAAZ8DAQAAAAGjAyAAAAABpANAAAAAAb8DAQAAAAHDAwEAAAABxwMCAAAAAcgDAQAAAAHMAwEAAAABzgMBAAAAAc8DEAAAAAHQAxAAAAAB0QMBAAAAAdIDAQAAAAHUAwEAAAAB1QMBAAAAAdYDAQAAAAECAAAAGQAgLAAAjAkAIAMAAAAZACAsAACMCQAgLQAAiwkAIAElAAD9CQAwAgAAABkAICUAAIsJACACAAAA9gYAICUAAIoJACAX6wIBAOkFACH0AkAA7AUAIfUCQADsBQAhhQMQAPgGACGUAwAA-QbUAyKZA0AAqgYAIZsDAQDtBQAhnwMBAOkFACGjAyAAzAYAIaQDQACqBgAhvwMBAO0FACHDAwEA7QUAIccDAgD3BQAhyAMBAO0FACHMAwEA7QUAIc4DAQDtBQAhzwMQAOoFACHQAxAA-AYAIdEDAQDtBQAh0gMBAO0FACHUAwEA7QUAIdUDAQDtBQAh1gMBAO0FACEfCwAA-wYAIAwAAPwGACANAADZCAAgDwAA_wYAIBMAAP0GACAVAACABwAgFgAAgQcAIBsAAIIHACDrAgEA6QUAIfQCQADsBQAh9QJAAOwFACGFAxAA-AYAIZQDAAD5BtQDIpkDQACqBgAhmwMBAO0FACGfAwEA6QUAIaMDIADMBgAhpANAAKoGACG_AwEA7QUAIcMDAQDtBQAhxwMCAPcFACHIAwEA7QUAIcwDAQDtBQAhzgMBAO0FACHPAxAA6gUAIdADEAD4BgAh0QMBAO0FACHSAwEA7QUAIdQDAQDtBQAh1QMBAO0FACHWAwEA7QUAIR8LAADKBwAgDAAAywcAIA0AANsIACAPAADOBwAgEwAAzAcAIBUAAM8HACAWAADQBwAgGwAA0QcAIOsCAQAAAAH0AkAAAAAB9QJAAAAAAYUDEAAAAAGUAwAAANQDApkDQAAAAAGbAwEAAAABnwMBAAAAAaMDIAAAAAGkA0AAAAABvwMBAAAAAcMDAQAAAAHHAwIAAAAByAMBAAAAAcwDAQAAAAHOAwEAAAABzwMQAAAAAdADEAAAAAHRAwEAAAAB0gMBAAAAAdQDAQAAAAHVAwEAAAAB1gMBAAAAAQQsAACECQAw8QMAAIUJADDzAwAAhwkAIPcDAADyBgAwAAAABywAAPgJACAtAAD7CQAg8QMAAPkJACDyAwAA-gkAIPUDAABsACD2AwAAbAAg9wMAAAEAIAMsAAD4CQAg8QMAAPkJACD3AwAAAQAgAAAABSwAAPMJACAtAAD2CQAg8QMAAPQJACDyAwAA9QkAIPcDAAABACADLAAA8wkAIPEDAAD0CQAg9wMAAAEAIAAAAAUsAADuCQAgLQAA8QkAIPEDAADvCQAg8gMAAPAJACD3AwAAAQAgAywAAO4JACDxAwAA7wkAIPcDAAABACAAAAAB9AMAAADrAwIB9AMAAADtAwILLAAAyQkAMC0AAM4JADDxAwAAygkAMPIDAADLCQAw8wMAAMwJACD0AwAAzQkAMPUDAADNCQAw9gMAAM0JADD3AwAAzQkAMPgDAADPCQAw-QMAANAJADALLAAAvQkAMC0AAMIJADDxAwAAvgkAMPIDAAC_CQAw8wMAAMAJACD0AwAAwQkAMPUDAADBCQAw9gMAAMEJADD3AwAAwQkAMPgDAADDCQAw-QMAAMQJADAHLAAAuAkAIC0AALsJACDxAwAAuQkAIPIDAAC6CQAg9QMAAAsAIPYDAAALACD3AwAA-QIAIAcsAACzCQAgLQAAtgkAIPEDAAC0CQAg8gMAALUJACD1AwAADQAg9gMAAA0AIPcDAAAPACALLAAApwkAMC0AAKwJADDxAwAAqAkAMPIDAACpCQAw8wMAAKoJACD0AwAAqwkAMPUDAACrCQAw9gMAAKsJADD3AwAAqwkAMPgDAACtCQAw-QMAAK4JADAG6wIBAAAAAfQCQAAAAAH1AkAAAAAB2gMBAAAAAdsDAQAAAAHcA0AAAAABAgAAAGoAICwAALIJACADAAAAagAgLAAAsgkAIC0AALEJACABJQAA7QkAMAsDAAC8BQAg6AIAALsFADDpAgAAaAAQ6gIAALsFADDrAgEAAAAB9AJAAPgEACH1AkAA-AQAIaoDAQD1BAAh2gMBAPQEACHbAwEA9AQAIdwDQAD4BAAhAgAAAGoAICUAALEJACACAAAArwkAICUAALAJACAK6AIAAK4JADDpAgAArwkAEOoCAACuCQAw6wIBAPQEACH0AkAA-AQAIfUCQAD4BAAhqgMBAPUEACHaAwEA9AQAIdsDAQD0BAAh3ANAAPgEACEK6AIAAK4JADDpAgAArwkAEOoCAACuCQAw6wIBAPQEACH0AkAA-AQAIfUCQAD4BAAhqgMBAPUEACHaAwEA9AQAIdsDAQD0BAAh3ANAAPgEACEG6wIBAOkFACH0AkAA7AUAIfUCQADsBQAh2gMBAOkFACHbAwEA6QUAIdwDQADsBQAhBusCAQDpBQAh9AJAAOwFACH1AkAA7AUAIdoDAQDpBQAh2wMBAOkFACHcA0AA7AUAIQbrAgEAAAAB9AJAAAAAAfUCQAAAAAHaAwEAAAAB2wMBAAAAAdwDQAAAAAENBwAA3AcAIOsCAQAAAAHtAgEAAAAB9AJAAAAAAfUCQAAAAAGjAyAAAAABpANAAAAAAaYDIAAAAAGrAyAAAAABrAMgAAAAAa0DIAAAAAGuAyAAAAABrwMgAAAAAQIAAAAPACAsAACzCQAgAwAAAA0AICwAALMJACAtAAC3CQAgDwAAAA0AIAcAANoHACAlAAC3CQAg6wIBAOkFACHtAgEA6QUAIfQCQADsBQAh9QJAAOwFACGjAyAAzAYAIaQDQACqBgAhpgMgAMwGACGrAyAAzAYAIawDIADMBgAhrQMgAMwGACGuAyAAzAYAIa8DIADMBgAhDQcAANoHACDrAgEA6QUAIe0CAQDpBQAh9AJAAOwFACH1AkAA7AUAIaMDIADMBgAhpANAAKoGACGmAyAAzAYAIasDIADMBgAhrAMgAMwGACGtAyAAzAYAIa4DIADMBgAhrwMgAMwGACEZCAAAtwgAIA8AALgIACASAAC6CAAgFwAAuwgAIBoAAL0IACAcAAC5CAAgHQAAvAgAIOsCAQAAAAH0AkAAAAAB9QJAAAAAAZQDAAAAvAMCnwMBAAAAAaEDAQAAAAGiAwEAAAABsQMBAAAAAbIDAQAAAAG0AwAAALQDArUDAgAAAAG2AwIAAAABtwMBAAAAAbgDAQAAAAG5AwEAAAABugMBAAAAAbwDAQAAAAG9AwEAAAABAgAAAPkCACAsAAC4CQAgAwAAAAsAICwAALgJACAtAAC8CQAgGwAAAAsAIAgAAOYHACAPAADnBwAgEgAA6QcAIBcAAOoHACAaAADsBwAgHAAA6AcAIB0AAOsHACAlAAC8CQAg6wIBAOkFACH0AkAA7AUAIfUCQADsBQAhlAMAAOQHvAMinwMBAOkFACGhAwEA6QUAIaIDAQDpBQAhsQMBAOkFACGyAwEA7QUAIbQDAADiB7QDIrUDAgDjBwAhtgMCAOMHACG3AwEA7QUAIbgDAQDtBQAhuQMBAO0FACG6AwEA7QUAIbwDAQDtBQAhvQMBAO0FACEZCAAA5gcAIA8AAOcHACASAADpBwAgFwAA6gcAIBoAAOwHACAcAADoBwAgHQAA6wcAIOsCAQDpBQAh9AJAAOwFACH1AkAA7AUAIZQDAADkB7wDIp8DAQDpBQAhoQMBAOkFACGiAwEA6QUAIbEDAQDpBQAhsgMBAO0FACG0AwAA4ge0AyK1AwIA4wcAIbYDAgDjBwAhtwMBAO0FACG4AwEA7QUAIbkDAQDtBQAhugMBAO0FACG8AwEA7QUAIb0DAQDtBQAhDOsCAQAAAAH0AkAAAAAB9QJAAAAAAd0DAQAAAAHeAwEAAAAB3wMBAAAAAeADAQAAAAHhAwEAAAAB4gNAAAAAAeMDQAAAAAHkAwEAAAAB5QMBAAAAAQIAAAAJACAsAADICQAgAwAAAAkAICwAAMgJACAtAADHCQAgASUAAOwJADARAwAAigUAIOgCAADhBQAw6QIAAAcAEOoCAADhBQAw6wIBAAAAAfQCQAD4BAAh9QJAAPgEACGqAwEA9AQAId0DAQD0BAAh3gMBAPQEACHfAwEA9QQAIeADAQD1BAAh4QMBAPUEACHiA0AA9wQAIeMDQAD3BAAh5AMBAPUEACHlAwEA9QQAIQIAAAAJACAlAADHCQAgAgAAAMUJACAlAADGCQAgEOgCAADECQAw6QIAAMUJABDqAgAAxAkAMOsCAQD0BAAh9AJAAPgEACH1AkAA-AQAIaoDAQD0BAAh3QMBAPQEACHeAwEA9AQAId8DAQD1BAAh4AMBAPUEACHhAwEA9QQAIeIDQAD3BAAh4wNAAPcEACHkAwEA9QQAIeUDAQD1BAAhEOgCAADECQAw6QIAAMUJABDqAgAAxAkAMOsCAQD0BAAh9AJAAPgEACH1AkAA-AQAIaoDAQD0BAAh3QMBAPQEACHeAwEA9AQAId8DAQD1BAAh4AMBAPUEACHhAwEA9QQAIeIDQAD3BAAh4wNAAPcEACHkAwEA9QQAIeUDAQD1BAAhDOsCAQDpBQAh9AJAAOwFACH1AkAA7AUAId0DAQDpBQAh3gMBAOkFACHfAwEA7QUAIeADAQDtBQAh4QMBAO0FACHiA0AAqgYAIeMDQACqBgAh5AMBAO0FACHlAwEA7QUAIQzrAgEA6QUAIfQCQADsBQAh9QJAAOwFACHdAwEA6QUAId4DAQDpBQAh3wMBAO0FACHgAwEA7QUAIeEDAQDtBQAh4gNAAKoGACHjA0AAqgYAIeQDAQDtBQAh5QMBAO0FACEM6wIBAAAAAfQCQAAAAAH1AkAAAAAB3QMBAAAAAd4DAQAAAAHfAwEAAAAB4AMBAAAAAeEDAQAAAAHiA0AAAAAB4wNAAAAAAeQDAQAAAAHlAwEAAAABB-sCAQAAAAH0AkAAAAAB9QJAAAAAAdwDQAAAAAHmAwEAAAAB5wMBAAAAAegDAQAAAAECAAAABQAgLAAA1AkAIAMAAAAFACAsAADUCQAgLQAA0wkAIAElAADrCQAwDAMAAIoFACDoAgAA4gUAMOkCAAADABDqAgAA4gUAMOsCAQAAAAH0AkAA-AQAIfUCQAD4BAAhqgMBAPQEACHcA0AA-AQAIeYDAQAAAAHnAwEA9QQAIegDAQD1BAAhAgAAAAUAICUAANMJACACAAAA0QkAICUAANIJACAL6AIAANAJADDpAgAA0QkAEOoCAADQCQAw6wIBAPQEACH0AkAA-AQAIfUCQAD4BAAhqgMBAPQEACHcA0AA-AQAIeYDAQD0BAAh5wMBAPUEACHoAwEA9QQAIQvoAgAA0AkAMOkCAADRCQAQ6gIAANAJADDrAgEA9AQAIfQCQAD4BAAh9QJAAPgEACGqAwEA9AQAIdwDQAD4BAAh5gMBAPQEACHnAwEA9QQAIegDAQD1BAAhB-sCAQDpBQAh9AJAAOwFACH1AkAA7AUAIdwDQADsBQAh5gMBAOkFACHnAwEA7QUAIegDAQDtBQAhB-sCAQDpBQAh9AJAAOwFACH1AkAA7AUAIdwDQADsBQAh5gMBAOkFACHnAwEA7QUAIegDAQDtBQAhB-sCAQAAAAH0AkAAAAAB9QJAAAAAAdwDQAAAAAHmAwEAAAAB5wMBAAAAAegDAQAAAAEELAAAyQkAMPEDAADKCQAw8wMAAMwJACD3AwAAzQkAMAQsAAC9CQAw8QMAAL4JADDzAwAAwAkAIPcDAADBCQAwAywAALgJACDxAwAAuQkAIPcDAAD5AgAgAywAALMJACDxAwAAtAkAIPcDAAAPACAELAAApwkAMPEDAACoCQAw8wMAAKoJACD3AwAAqwkAMAAAEQYAAL4IACAIAAC_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-AkAIAMAAABsACAsAAD4CQAgLQAA_AkAIBQAAABsACAEAACiCQAgBQAAowkAIAcAAKQJACAeAAClCQAgJQAA_AkAIOsCAQDpBQAh9AJAAOwFACH1AkAA7AUAIZQDAAChCe0DIp8DAQDpBQAhoAMBAOkFACGhAwEA7QUAIaMDIADMBgAhpANAAKoGACHRAwEA7QUAIdIDAQDtBQAh6QMgAMwGACHrAwAAoAnrAyLtAyAAzAYAIRIEAACiCQAgBQAAowkAIAcAAKQJACAeAAClCQAg6wIBAOkFACH0AkAA7AUAIfUCQADsBQAhlAMAAKEJ7QMinwMBAOkFACGgAwEA6QUAIaEDAQDtBQAhowMgAMwGACGkA0AAqgYAIdEDAQDtBQAh0gMBAO0FACHpAyAAzAYAIesDAACgCesDIu0DIADMBgAhF-sCAQAAAAH0AkAAAAAB9QJAAAAAAYUDEAAAAAGUAwAAANQDApkDQAAAAAGbAwEAAAABnwMBAAAAAaMDIAAAAAGkA0AAAAABvwMBAAAAAcMDAQAAAAHHAwIAAAAByAMBAAAAAcwDAQAAAAHOAwEAAAABzwMQAAAAAdADEAAAAAHRAwEAAAAB0gMBAAAAAdQDAQAAAAHVAwEAAAAB1gMBAAAAARfrAgEAAAAB9AJAAAAAAfUCQAAAAAGFAxAAAAABlAMAAADUAwKZA0AAAAABmwMBAAAAAZ8DAQAAAAGjAyAAAAABpANAAAAAAb8DAQAAAAHDAwEAAAABxwMCAAAAAcgDAQAAAAHMAwEAAAABzgMBAAAAAc8DEAAAAAHQAxAAAAAB0QMBAAAAAdIDAQAAAAHVAwEAAAAB1gMBAAAAAdcDAQAAAAEX6wIBAAAAAfQCQAAAAAH1AkAAAAABhQMQAAAAAZQDAAAA1AMCmQNAAAAAAZsDAQAAAAGfAwEAAAABowMgAAAAAaQDQAAAAAG_AwEAAAABwwMBAAAAAccDAgAAAAHIAwEAAAABzAMBAAAAAc4DAQAAAAHPAxAAAAAB0AMQAAAAAdEDAQAAAAHSAwEAAAAB1AMBAAAAAdYDAQAAAAHXAwEAAAABDBIAANMHACDrAgEAAAAB9AJAAAAAAfUCQAAAAAGfAwEAAAABoAMBAAAAAaEDAQAAAAGiAwEAAAABowMgAAAAAaQDQAAAAAGlAwEAAAABpgMgAAAAAQIAAACnAwAgLAAAgAoAIAMAAAAgACAsAACACgAgLQAAhAoAIA4AAAAgACASAADhBgAgJQAAhAoAIOsCAQDpBQAh9AJAAOwFACH1AkAA7AUAIZ8DAQDpBQAhoAMBAO0FACGhAwEA7QUAIaIDAQDtBQAhowMgAMwGACGkA0AAqgYAIaUDAQDtBQAhpgMgAMwGACEMEgAA4QYAIOsCAQDpBQAh9AJAAOwFACH1AkAA7AUAIZ8DAQDpBQAhoAMBAO0FACGhAwEA7QUAIaIDAQDtBQAhowMgAMwGACGkA0AAqgYAIaUDAQDtBQAhpgMgAMwGACEX6wIBAAAAAfQCQAAAAAH1AkAAAAABhQMQAAAAAZQDAAAA1AMCmQNAAAAAAZsDAQAAAAGfAwEAAAABowMgAAAAAaQDQAAAAAG_AwEAAAABwwMBAAAAAccDAgAAAAHIAwEAAAABzAMBAAAAAc4DAQAAAAHPAxAAAAAB0AMQAAAAAdEDAQAAAAHSAwEAAAAB1AMBAAAAAdUDAQAAAAHXAwEAAAABEgQAANUJACAFAADWCQAgHgAA2AkAIB8AANkJACDrAgEAAAAB9AJAAAAAAfUCQAAAAAGUAwAAAO0DAp8DAQAAAAGgAwEAAAABoQMBAAAAAaMDIAAAAAGkA0AAAAAB0QMBAAAAAdIDAQAAAAHpAyAAAAAB6wMAAADrAwLtAyAAAAABAgAAAAEAICwAAIYKACAM6wIBAAAAAfQCQAAAAAH1AkAAAAABowMgAAAAAaQDQAAAAAGmAyAAAAABqgMBAAAAAasDIAAAAAGsAyAAAAABrQMgAAAAAa4DIAAAAAGvAyAAAAABIAsAAMoHACAMAADLBwAgDQAA2wgAIBMAAMwHACAUAADNBwAgFQAAzwcAIBYAANAHACAbAADRBwAg6wIBAAAAAfQCQAAAAAH1AkAAAAABhQMQAAAAAZQDAAAA1AMCmQNAAAAAAZsDAQAAAAGfAwEAAAABowMgAAAAAaQDQAAAAAG_AwEAAAABwwMBAAAAAccDAgAAAAHIAwEAAAABzAMBAAAAAc4DAQAAAAHPAxAAAAAB0AMQAAAAAdEDAQAAAAHSAwEAAAAB1AMBAAAAAdUDAQAAAAHWAwEAAAAB1wMBAAAAAQIAAAAZACAsAACJCgAgAwAAABcAICwAAIkKACAtAACNCgAgIgAAABcAIAsAAPsGACAMAAD8BgAgDQAA2QgAIBMAAP0GACAUAAD-BgAgFQAAgAcAIBYAAIEHACAbAACCBwAgJQAAjQoAIOsCAQDpBQAh9AJAAOwFACH1AkAA7AUAIYUDEAD4BgAhlAMAAPkG1AMimQNAAKoGACGbAwEA7QUAIZ8DAQDpBQAhowMgAMwGACGkA0AAqgYAIb8DAQDtBQAhwwMBAO0FACHHAwIA9wUAIcgDAQDtBQAhzAMBAO0FACHOAwEA7QUAIc8DEADqBQAh0AMQAPgGACHRAwEA7QUAIdIDAQDtBQAh1AMBAO0FACHVAwEA7QUAIdYDAQDtBQAh1wMBAO0FACEgCwAA-wYAIAwAAPwGACANAADZCAAgEwAA_QYAIBQAAP4GACAVAACABwAgFgAAgQcAIBsAAIIHACDrAgEA6QUAIfQCQADsBQAh9QJAAOwFACGFAxAA-AYAIZQDAAD5BtQDIpkDQACqBgAhmwMBAO0FACGfAwEA6QUAIaMDIADMBgAhpANAAKoGACG_AwEA7QUAIcMDAQDtBQAhxwMCAPcFACHIAwEA7QUAIcwDAQDtBQAhzgMBAO0FACHPAxAA6gUAIdADEAD4BgAh0QMBAO0FACHSAwEA7QUAIdQDAQDtBQAh1QMBAO0FACHWAwEA7QUAIdcDAQDtBQAhDOsCAQAAAAH0AkAAAAAB9QJAAAAAAYIDAQAAAAGUAwAAAMsDApcDEAAAAAGYAxAAAAABmQNAAAAAAZoDAQAAAAHHAwIAAAAByAMBAAAAAckDAgAAAAEgCwAAygcAIAwAAMsHACANAADbCAAgDwAAzgcAIBMAAMwHACAUAADNBwAgFgAA0AcAIBsAANEHACDrAgEAAAAB9AJAAAAAAfUCQAAAAAGFAxAAAAABlAMAAADUAwKZA0AAAAABmwMBAAAAAZ8DAQAAAAGjAyAAAAABpANAAAAAAb8DAQAAAAHDAwEAAAABxwMCAAAAAcgDAQAAAAHMAwEAAAABzgMBAAAAAc8DEAAAAAHQAxAAAAAB0QMBAAAAAdIDAQAAAAHUAwEAAAAB1QMBAAAAAdYDAQAAAAHXAwEAAAABAgAAABkAICwAAI8KACADAAAAFwAgLAAAjwoAIC0AAJMKACAiAAAAFwAgCwAA-wYAIAwAAPwGACANAADZCAAgDwAA_wYAIBMAAP0GACAUAAD-BgAgFgAAgQcAIBsAAIIHACAlAACTCgAg6wIBAOkFACH0AkAA7AUAIfUCQADsBQAhhQMQAPgGACGUAwAA-QbUAyKZA0AAqgYAIZsDAQDtBQAhnwMBAOkFACGjAyAAzAYAIaQDQACqBgAhvwMBAO0FACHDAwEA7QUAIccDAgD3BQAhyAMBAO0FACHMAwEA7QUAIc4DAQDtBQAhzwMQAOoFACHQAxAA-AYAIdEDAQDtBQAh0gMBAO0FACHUAwEA7QUAIdUDAQDtBQAh1gMBAO0FACHXAwEA7QUAISALAAD7BgAgDAAA_AYAIA0AANkIACAPAAD_BgAgEwAA_QYAIBQAAP4GACAWAACBBwAgGwAAggcAIOsCAQDpBQAh9AJAAOwFACH1AkAA7AUAIYUDEAD4BgAhlAMAAPkG1AMimQNAAKoGACGbAwEA7QUAIZ8DAQDpBQAhowMgAMwGACGkA0AAqgYAIb8DAQDtBQAhwwMBAO0FACHHAwIA9wUAIcgDAQDtBQAhzAMBAO0FACHOAwEA7QUAIc8DEADqBQAh0AMQAPgGACHRAwEA7QUAIdIDAQDtBQAh1AMBAO0FACHVAwEA7QUAIdYDAQDtBQAh1wMBAO0FACEO6wIBAAAAAfICAQAAAAH0AkAAAAAB9QJAAAAAAYIDAQAAAAGUAwAAAMYDAr4DAQAAAAG_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_gYAIBUAAIAHACAbAACCBwAgJQAA5QoAIOsCAQDpBQAh9AJAAOwFACH1AkAA7AUAIYUDEAD4BgAhlAMAAPkG1AMimQNAAKoGACGbAwEA7QUAIZ8DAQDpBQAhowMgAMwGACGkA0AAqgYAIb8DAQDtBQAhwwMBAO0FACHHAwIA9wUAIcgDAQDtBQAhzAMBAO0FACHOAwEA7QUAIc8DEADqBQAh0AMQAPgGACHRAwEA7QUAIdIDAQDtBQAh1AMBAO0FACHVAwEA7QUAIdYDAQDtBQAh1wMBAO0FACEgCwAA-wYAIAwAAPwGACANAADZCAAgDwAA_wYAIBMAAP0GACAUAAD-BgAgFQAAgAcAIBsAAIIHACDrAgEA6QUAIfQCQADsBQAh9QJAAOwFACGFAxAA-AYAIZQDAAD5BtQDIpkDQACqBgAhmwMBAO0FACGfAwEA6QUAIaMDIADMBgAhpANAAKoGACG_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_AoAIAMAAAAXACAsAAD4CgAgLQAAgAsAICIAAAAXACALAAD7BgAgDAAA_AYAIA0AANkIACAPAAD_BgAgEwAA_QYAIBQAAP4GACAVAACABwAgFgAAgQcAICUAAIALACDrAgEA6QUAIfQCQADsBQAh9QJAAOwFACGFAxAA-AYAIZQDAAD5BtQDIpkDQACqBgAhmwMBAO0FACGfAwEA6QUAIaMDIADMBgAhpANAAKoGACG_AwEA7QUAIcMDAQDtBQAhxwMCAPcFACHIAwEA7QUAIcwDAQDtBQAhzgMBAO0FACHPAxAA6gUAIdADEAD4BgAh0QMBAO0FACHSAwEA7QUAIdQDAQDtBQAh1QMBAO0FACHWAwEA7QUAIdcDAQDtBQAhIAsAAPsGACAMAAD8BgAgDQAA2QgAIA8AAP8GACATAAD9BgAgFAAA_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_1AwYQAAcDDgAND_sDBhAABwUKAJ8BMgCiATMAowF0AKABdQChAQAAAAAABQoAnwEyAKIBMwCjAXQAoAF1AKEBAgcABBiNBBgCBwAEGJMEGAUKAKgBMgCrATMArAF0AKkBdQCqAQAAAAAABQoAqAEyAKsBMwCsAXQAqQF1AKoBAw-lBAYQAAcZABcDD6sEBhAABxkAFwUKALEBMgC0ATMAtQF0ALIBdQCzAQAAAAAABQoAsQEyALQBMwC1AXQAsgF1ALMBAgcABBkAFwIHAAQZABcFCgC6ATIAvQEzAL4BdAC7AXUAvAEAAAAAAAUKALoBMgC9ATMAvgF0ALsBdQC8ASACASFxASJzASN0ASR1ASZ3ASd5ISh6Iil8ASp-ISt_Iy6AAQEvgQEBMIIBITSFASQ1hgEoNocBAjeIAQI4iQECOYoBAjqLAQI7jQECPI8BIT2QASk-kgECP5QBIUCVASpBlgECQpcBAkOYASFEmwErRZwBL0adAQNHngEDSJ8BA0mgAQNKoQEDS6MBA0ylASFNpgEwTqgBA0-qASFQqwExUawBA1KtAQNTrgEhVLEBMlWyATZWswEfV7QBH1i1AR9ZtgEfWrcBH1u5AR9cuwEhXbwBN16_AR9fwQEhYMIBOGHEAR9ixQEfY8YBIWTJATllygE9ZswBE2fNARNozwETadABE2rRARNr0wETbNUBIW3WAT5u2AETb9oBIXDbAT9x3AETct0BE3PeASF24QFAd-IBRnjjAQd55AEHeuUBB3vmAQd85wEHfekBB37rASF_7AFHgAHzAQeBAfUBIYIB9gFIgwH8AQeEAf0BB4UB_gEhhgGBAkmHAYICT4gBhAIIiQGFAgiKAYcCCIsBiAIIjAGJAgiNAYsCCI4BjQIhjwGOAlCQAZACCJEBkgIhkgGTAlGTAZQCCJQBlQIIlQGWAiGWAZkCUpcBmgJWmAGcAgqZAZ0CCpoBnwIKmwGgAgqcAaECCp0BowIKngGlAiGfAaYCV6ABqAIKoQGqAiGiAasCWKMBrAIKpAGtAgqlAa4CIaYBsQJZpwGyAl2oAbQCEakBtQIRqgG3AhGrAbgCEawBuQIRrQG7AhGuAb0CIa8BvgJesAHAAhGxAcICIbIBwwJfswHEAhG0AcUCEbUBxgIhtgHJAmC3AcoCZLgBywIGuQHMAga6Ac0CBrsBzgIGvAHPAga9AdECBr4B0wIhvwHUAmXAAdYCBsEB2AIhwgHZAmbDAdoCBsQB2wIGxQHcAiHGAd8CZ8cB4AJtyAHhAhXJAeICFcoB4wIVywHkAhXMAeUCFc0B5wIVzgHpAiHPAeoCbtAB7QIV0QHvAiHSAfACb9MB8gIV1AHzAhXVAfQCIdYB9wJw1wH4AnTYAfoCBNkB-wIE2gH9AgTbAf4CBNwB_wIE3QGBAwTeAYMDId8BhAN14AGGAwThAYgDIeIBiQN24wGKAwTkAYsDBOUBjAMh5gGPA3fnAZADfegBkQMF6QGSAwXqAZMDBesBlAMF7AGVAwXtAZcDBe4BmQMh7wGaA37wAZwDBfEBngMh8gGfA3_zAaADBfQBoQMF9QGiAyH2AaUDgAH3AaYDhAH4AagDDPkBqQMM-gGrAwz7AawDDPwBrQMM_QGvAwz-AbEDIf8BsgOFAYACtAMMgQK2AyGCArcDhgGDArgDDIQCuQMMhQK6AyGGAr0DhwGHAr4DiwGIAr8DGIkCwAMYigLBAxiLAsIDGIwCwwMYjQLFAxiOAscDIY8CyAOMAZACygMYkQLMAyGSAs0DjQGTAs4DGJQCzwMYlQLQAyGWAtMDjgGXAtQDkgGYAtUDDZkC1gMNmgLXAw2bAtgDDZwC2QMNnQLbAw2eAt0DIZ8C3gOTAaAC4AMNoQLiAyGiAuMDlAGjAuQDDaQC5QMNpQLmAyGmAukDlQGnAuoDmwGoAusDDqkC7AMOqgLtAw6rAu4DDqwC7wMOrQLxAw6uAvMDIa8C9AOcAbAC9wMOsQL5AyGyAvoDnQGzAvwDDrQC_QMOtQL-AyG2AoEEngG3AoIEpAG4AoMEF7kChAQXugKFBBe7AoYEF7wChwQXvQKJBBe-AosEIb8CjASlAcACjwQXwQKRBCHCApIEpgHDApQEF8QClQQXxQKWBCHGApkEpwHHApoErQHIApsEFskCnAQWygKdBBbLAp4EFswCnwQWzQKhBBbOAqMEIc8CpASuAdACpwQW0QKpBCHSAqoErwHTAqwEFtQCrQQW1QKuBCHWArEEsAHXArIEtgHYArMEGtkCtAQa2gK1BBrbArYEGtwCtwQa3QK5BBreArsEId8CvAS3AeACvgQa4QLABCHiAsEEuAHjAsIEGuQCwwQa5QLEBCHmAscEuQHnAsgEvwE"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  CustomerScalarFieldEnum: () => CustomerScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  InvoiceItemScalarFieldEnum: () => InvoiceItemScalarFieldEnum,
  InvoiceScalarFieldEnum: () => InvoiceScalarFieldEnum,
  JsonNull: () => JsonNull2,
  LeafSettingScalarFieldEnum: () => LeafSettingScalarFieldEnum,
  MedicineRequestScalarFieldEnum: () => MedicineRequestScalarFieldEnum,
  MedicineScalarFieldEnum: () => MedicineScalarFieldEnum,
  MedicineTypeScalarFieldEnum: () => MedicineTypeScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PharmacyInventoryScalarFieldEnum: () => PharmacyInventoryScalarFieldEnum,
  PharmacyScalarFieldEnum: () => PharmacyScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  PurchaseItemScalarFieldEnum: () => PurchaseItemScalarFieldEnum,
  PurchaseScalarFieldEnum: () => PurchaseScalarFieldEnum,
  QueryMode: () => QueryMode,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  StaffScalarFieldEnum: () => StaffScalarFieldEnum,
  SupplierScalarFieldEnum: () => SupplierScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UnitScalarFieldEnum: () => UnitScalarFieldEnum,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.8.0",
  engine: "3c6e192761c0362d496ed980de936e2f3cebcd3a"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  LeafSetting: "LeafSetting",
  Medicine: "Medicine",
  Category: "Category",
  MedicineType: "MedicineType",
  Unit: "Unit",
  PharmacyInventory: "PharmacyInventory",
  MedicineRequest: "MedicineRequest",
  Pharmacy: "Pharmacy",
  Staff: "Staff",
  Supplier: "Supplier",
  Customer: "Customer",
  Purchase: "Purchase",
  PurchaseItem: "PurchaseItem",
  Invoice: "Invoice",
  InvoiceItem: "InvoiceItem",
  Payment: "Payment"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  imagePublicId: "imagePublicId",
  role: "role",
  status: "status",
  phone: "phone",
  needPasswordChange: "needPasswordChange",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  userId: "userId"
};
var LeafSettingScalarFieldEnum = {
  id: "id",
  name: "name",
  leavesPerStrip: "leavesPerStrip",
  stripsPerBox: "stripsPerBox",
  description: "description",
  isActive: "isActive",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var MedicineScalarFieldEnum = {
  id: "id",
  name: "name",
  genericName: "genericName",
  strength: "strength",
  boxSize: "boxSize",
  shelf: "shelf",
  price: "price",
  supplierPrice: "supplierPrice",
  vat: "vat",
  expiryDate: "expiryDate",
  stockQuantity: "stockQuantity",
  image: "image",
  imagePublicId: "imagePublicId",
  description: "description",
  status: "status",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  categoryId: "categoryId",
  typeId: "typeId",
  supplierId: "supplierId",
  unitId: "unitId",
  leafSettingId: "leafSettingId"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  slug: "slug",
  description: "description",
  isActive: "isActive",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var MedicineTypeScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  isActive: "isActive",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var UnitScalarFieldEnum = {
  id: "id",
  name: "name",
  symbol: "symbol",
  isActive: "isActive",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PharmacyInventoryScalarFieldEnum = {
  id: "id",
  pharmacyId: "pharmacyId",
  medicineId: "medicineId",
  batchNumber: "batchNumber",
  stockQuantity: "stockQuantity",
  sellingPrice: "sellingPrice",
  purchasePrice: "purchasePrice",
  expiryDate: "expiryDate",
  shelf: "shelf",
  lowStockAlertQuantity: "lowStockAlertQuantity",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var MedicineRequestScalarFieldEnum = {
  id: "id",
  pharmacyId: "pharmacyId",
  requestedName: "requestedName",
  genericName: "genericName",
  categorySuggestion: "categorySuggestion",
  typeSuggestion: "typeSuggestion",
  unitSuggestion: "unitSuggestion",
  strength: "strength",
  companyName: "companyName",
  note: "note",
  status: "status",
  adminNote: "adminNote",
  medicineId: "medicineId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PharmacyScalarFieldEnum = {
  id: "id",
  ownerId: "ownerId",
  name: "name",
  licenseNumber: "licenseNumber",
  binVat: "binVat",
  pharmacyType: "pharmacyType",
  establishedYear: "establishedYear",
  staffCount: "staffCount",
  openingHours: "openingHours",
  website: "website",
  phone: "phone",
  address: "address",
  logo: "logo",
  logoPublicId: "logoPublicId",
  status: "status",
  rejectionReason: "rejectionReason",
  inviteCode: "inviteCode",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var StaffScalarFieldEnum = {
  id: "id",
  userId: "userId",
  pharmacyId: "pharmacyId",
  canManageInventory: "canManageInventory",
  canManageSales: "canManageSales",
  canManageCustomers: "canManageCustomers",
  canViewReports: "canViewReports",
  canManagePurchases: "canManagePurchases",
  isActive: "isActive",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SupplierScalarFieldEnum = {
  id: "id",
  name: "name",
  contactPerson: "contactPerson",
  email: "email",
  phone: "phone",
  address: "address",
  isActive: "isActive",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CustomerScalarFieldEnum = {
  id: "id",
  pharmacyId: "pharmacyId",
  name: "name",
  email: "email",
  phone: "phone",
  address: "address",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PurchaseScalarFieldEnum = {
  id: "id",
  pharmacyId: "pharmacyId",
  supplierId: "supplierId",
  invoiceNumber: "invoiceNumber",
  purchaseDate: "purchaseDate",
  subtotal: "subtotal",
  vatAmount: "vatAmount",
  discount: "discount",
  totalAmount: "totalAmount",
  paidAmount: "paidAmount",
  dueAmount: "dueAmount",
  paymentStatus: "paymentStatus",
  purchaseStatus: "purchaseStatus",
  note: "note",
  createdByUserId: "createdByUserId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PurchaseItemScalarFieldEnum = {
  id: "id",
  purchaseId: "purchaseId",
  inventoryId: "inventoryId",
  medicineId: "medicineId",
  quantity: "quantity",
  purchasePrice: "purchasePrice",
  sellingPrice: "sellingPrice",
  expiryDate: "expiryDate",
  batchNumber: "batchNumber",
  total: "total",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var InvoiceScalarFieldEnum = {
  id: "id",
  pharmacyId: "pharmacyId",
  customerId: "customerId",
  invoiceNumber: "invoiceNumber",
  saleDate: "saleDate",
  subtotal: "subtotal",
  vatAmount: "vatAmount",
  discount: "discount",
  totalAmount: "totalAmount",
  netAmount: "netAmount",
  paidAmount: "paidAmount",
  dueAmount: "dueAmount",
  paymentMode: "paymentMode",
  paymentStatus: "paymentStatus",
  status: "status",
  note: "note",
  createdByUserId: "createdByUserId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var InvoiceItemScalarFieldEnum = {
  id: "id",
  invoiceId: "invoiceId",
  inventoryId: "inventoryId",
  medicineId: "medicineId",
  quantity: "quantity",
  unitPrice: "unitPrice",
  vat: "vat",
  discount: "discount",
  total: "total",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PaymentScalarFieldEnum = {
  id: "id",
  invoiceId: "invoiceId",
  pharmacyId: "pharmacyId",
  amount: "amount",
  paymentMode: "paymentMode",
  paymentDate: "paymentDate",
  note: "note",
  receivedByUserId: "receivedByUserId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var UserRole = {
  ADMIN: "ADMIN",
  PHARMACY: "PHARMACY",
  STAFF: "STAFF",
  USER: "USER"
};
var UserAccountStatus = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED"
};
var MedicineStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  DISCONTINUED: "DISCONTINUED"
};
var PharmacyInventoryStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  ARCHIVED: "ARCHIVED"
};
var MedicineRequestStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED"
};
var PharmacyStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED"
};
var PurchaseStatus = {
  PENDING: "PENDING",
  RECEIVED: "RECEIVED",
  PARTIAL: "PARTIAL",
  CANCELLED: "CANCELLED"
};
var PaymentStatus = {
  UNPAID: "UNPAID",
  PARTIAL: "PARTIAL",
  PAID: "PAID",
  CANCELLED: "CANCELLED"
};
var InvoiceStatus = {
  DRAFT: "DRAFT",
  ISSUED: "ISSUED",
  PAID: "PAID",
  PARTIAL: "PARTIAL",
  CANCELLED: "CANCELLED"
};
var PaymentMode = {
  CASH: "CASH",
  CARD: "CARD",
  MOBILE_BANKING: "MOBILE_BANKING",
  BANK_TRANSFER: "BANK_TRANSFER"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path2.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${route_config_default.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
import { oAuthProxy } from "better-auth/plugins";
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  baseURL: route_config_default.FRONTEND_URL,
  secret: route_config_default.BETTER_AUTH_SECRET,
  advanced: {
    cookies: {
      session_token: {
        name: "session_token",
        attributes: {
          httpOnly: true,
          secure: route_config_default.NODE_ENV === "production",
          sameSite: "lax",
          path: "/"
        }
      }
    }
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    // 7 days
    updateAge: 60 * 60 * 24,
    // refresh every 24h
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5
    }
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false
  },
  socialProviders: {
    google: {
      clientId: route_config_default.GOOGLE_CLIENT_ID,
      clientSecret: route_config_default.GOOGLE_CLIENT_SECRET,
      prompt: "select_account consent"
    }
  },
  emailVerification: {
    sendOnSignUp: false,
    sendOnSignIn: false,
    autoSignInAfterVerification: true
  },
  trustedOrigins: [
    route_config_default.FRONTEND_URL,
    route_config_default.BACKEND_BASE_URL,
    "http://localhost:3000",
    "http://localhost:5000"
  ].filter(Boolean),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: UserRole.USER,
        input: false
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserAccountStatus.ACTIVE,
        input: false
      },
      phone: {
        type: "string",
        required: false,
        input: true
      },
      needPasswordChange: {
        type: "boolean",
        required: false,
        defaultValue: false
      },
      isDeleted: {
        type: "boolean",
        required: false,
        defaultValue: false
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null
      }
    }
  },
  plugins: [oAuthProxy()],
  databaseHooks: {
    user: {
      create: {
        before: async (user, context) => {
          const intendedRole = context?.headers?.get("x-intended-role") || "USER";
          return {
            data: { ...user, role: intendedRole }
          };
        },
        after: async (user, context) => {
          const role = context?.headers?.get("x-intended-role");
          if (role === "STAFF") {
            const inviteCode = context?.headers?.get("x-staff-invite-code");
            if (inviteCode) {
              const pharmacy = await prisma.pharmacy.findUnique({
                where: { inviteCode }
              });
              if (pharmacy) {
                await prisma.staff.create({
                  data: {
                    userId: user.id,
                    pharmacyId: pharmacy.id
                  }
                });
              }
            }
          }
        }
      }
    }
  }
});

// src/router/centralRoutes.ts
import { Router as Router17 } from "express";

// src/modules/auth/auth.routes.ts
import { Router } from "express";

// src/modules/auth/auth.controller.ts
import { makeSignature } from "better-auth/crypto";

// src/modules/auth/auth.service.ts
import { fromNodeHeaders } from "better-auth/node";

// src/errors/AppError.ts
var AppError = class extends Error {
  statusCode;
  isOperational;
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
};
var BadRequestError = class extends AppError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
};
var UnauthorizedError = class extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
};
var ForbiddenError = class extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
};
var NotFoundError = class extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
};
var ConflictError = class extends AppError {
  constructor(message = "Resource conflict") {
    super(message, 409);
  }
};

// src/config/claudinary.config.ts
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: route_config_default.CLAUDINARY_CLOUD_NAME,
  api_key: route_config_default.CLAUDINARY_API_KEY,
  api_secret: route_config_default.CLAUDINARY_API_SECRET
});
var claudinary_config_default = cloudinary;

// src/utils/claudinary.ts
var extractPublicId = (url) => {
  try {
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;
    const afterUpload = parts.slice(uploadIndex + 1);
    const withoutVersion = afterUpload[0]?.startsWith("v") ? afterUpload.slice(1) : afterUpload;
    const publicIdWithExt = withoutVersion.join("/");
    return publicIdWithExt.replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
};
var deleteFromCloudinaryByPublicId = async (publicId) => {
  if (!publicId) {
    return;
  }
  try {
    await claudinary_config_default.uploader.destroy(publicId);
  } catch (error) {
    console.error(`[Cloudinary] Failed to delete ${publicId}:`, error);
  }
};
var deleteFromCloudinary = async (url) => {
  const publicId = extractPublicId(url);
  if (!publicId) {
    console.warn(`[Cloudinary] Could not extract public_id from: ${url}`);
    return;
  }
  await deleteFromCloudinaryByPublicId(publicId);
};

// src/modules/auth/auth.service.ts
var DEMO_USERS = {
  admin: {
    name: route_config_default.ADMIN_Name,
    email: route_config_default.ADMIN_Email,
    password: route_config_default.ADMIN_Password,
    role: "ADMIN"
  },
  pharmacy: {
    name: route_config_default.PHARMACY_Name,
    email: route_config_default.PHARMACY_Email,
    password: route_config_default.PHARMACY_Password,
    role: "PHARMACY"
  },
  staff: {
    name: route_config_default.STAFF_Name,
    email: route_config_default.STAFF_Email,
    password: route_config_default.STAFF_Password,
    role: "STAFF"
  },
  user: {
    name: route_config_default.USER_Name,
    email: route_config_default.USER_Email,
    password: route_config_default.USER_Password,
    role: "USER"
  }
};
async function getMe(headers) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(headers)
  });
  if (!session?.user) {
    throw new UnauthorizedError("Not authenticated");
  }
  const { user } = session;
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      role: user.role,
      status: user.status,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    },
    session: {
      id: session.session.id,
      expiresAt: session.session.expiresAt
    }
  };
}
async function demoLogin(role) {
  const demoUser = DEMO_USERS[role];
  const password = demoUser.password;

  const existing = await prisma.user.findUnique({
    where: {
      email: demoUser.email
    }
  });

  if (!existing) {
    await auth.api.signUpEmail({
      body: {
        name: demoUser.name,
        email: demoUser.email,
        password
      },
      headers: new Headers({
        "x-intended-role": demoUser.role
      })
    });
  }
  const signInResponse = await auth.api.signInEmail({
    body: {
      email: demoUser.email,
      password
    }
  });
  return signInResponse;
}
async function updateProfileImage(userId, image) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new UnauthorizedError("Not authenticated");
  }
  if (user.image && user.image !== image.secureUrl) {
    await deleteFromCloudinaryByPublicId(user.imagePublicId);
    if (!user.imagePublicId) {
      await deleteFromCloudinary(user.image);
    }
  }
  return prisma.user.update({
    where: { id: userId },
    data: {
      image: image.secureUrl,
      imagePublicId: image.publicId
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true
    }
  });
}
async function removeProfileImage(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new UnauthorizedError("Not authenticated");
  }
  if (user.image) {
    await deleteFromCloudinaryByPublicId(user.imagePublicId);
    if (!user.imagePublicId) {
      await deleteFromCloudinary(user.image);
    }
  }
  return prisma.user.update({
    where: { id: userId },
    data: {
      image: null,
      imagePublicId: null
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true
    }
  });
}

// src/modules/auth/auth.validation.ts
import { z } from "zod";
var demoLoginParamsSchema = z.object({
  role: z.enum(["admin", "pharmacy", "staff", "user"], {
    required_error: "Role is required",
    invalid_type_error: "Role must be one of: admin, pharmacy, staff, user"
  })
});

// src/utils/sendResponse.ts
var sendResponse = (res, responseData) => {
  const { httpStatusCode, success, message, data, meta } = responseData;
  res.status(httpStatusCode).json({ success, message, data, ...meta && { meta } });
};
var sendSuccess = (res, data, message = "Success", statusCode = 200, meta) => sendResponse(res, { httpStatusCode: statusCode, success: true, message, data, ...meta && { meta } });
var sendCreated = (res, data, message = "Created successfully") => sendResponse(res, { httpStatusCode: 201, success: true, message, data });

// src/modules/uploads/upload.service.ts
import sharp from "sharp";
var presets = {
  medicine: {
    folder: "meditrack/medicines",
    width: 900,
    fit: "inside"
  },
  pharmacyLogo: {
    folder: "meditrack/pharmacy/logos",
    width: 480,
    height: 480,
    fit: "inside"
  },
  userAvatar: {
    folder: "meditrack/users/avatars",
    width: 320,
    height: 320,
    fit: "cover"
  }
};
var allowedMimeTypes = /* @__PURE__ */ new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp"
]);
async function processImage(file, preset) {
  if (!allowedMimeTypes.has(file.mimetype)) {
    throw new BadRequestError("Only JPG, PNG, and WEBP image files are allowed.");
  }
  const config2 = presets[preset];
  const pipeline = sharp(file.buffer, { failOn: "warning" }).rotate().resize({
    width: config2.width,
    height: config2.height,
    fit: config2.fit,
    withoutEnlargement: true
  }).webp({ quality: 82 });
  return pipeline.toBuffer();
}
async function uploadImage(file, preset) {
  if (!file) return null;
  const buffer = await processImage(file, preset);
  const folder = presets[preset].folder;
  return new Promise((resolve, reject) => {
    const stream = claudinary_config_default.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        format: "webp"
      },
      (error, result) => {
        if (error || !result) {
          reject(new BadRequestError("Image upload failed. Please try again."));
          return;
        }
        resolve({
          secureUrl: result.secure_url,
          publicId: result.public_id
        });
      }
    );
    stream.end(buffer);
  });
}

// src/modules/auth/auth.controller.ts
var getMeController = async (req, res, next) => {
  try {
    const data = await getMe(req.headers);
    sendSuccess(res, data, "User retrieved successfully");
  } catch (error) {
    next(error);
  }
};
var demoLoginController = async (req, res, next) => {
  try {
    const { role } = demoLoginParamsSchema.parse(req.params);
    const signInResult = await demoLogin(role);
    if (signInResult && typeof signInResult === "object" && "token" in signInResult) {
      const token = signInResult.token;
      const signedToken = `${token}.${await makeSignature(token, route_config_default.BETTER_AUTH_SECRET)}`;
      res.cookie("session_token", signedToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1e3
        // 7 days
      });
    }
    const userData = signInResult && typeof signInResult === "object" && "user" in signInResult ? signInResult.user : null;
    sendSuccess(
      res,
      {
        user: userData ? {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role
        } : null
      },
      `Demo ${role} login successful`
    );
  } catch (error) {
    next(error);
  }
};
var updateProfileImageController = async (req, res, next) => {
  try {
    const uploadedImage = await uploadImage(req.file, "userAvatar");
    if (!uploadedImage) {
      throw new BadRequestError("Profile image is required.");
    }
    const user = await updateProfileImage(req.user.id, uploadedImage);
    sendSuccess(res, user, "Profile image updated successfully");
  } catch (error) {
    next(error);
  }
};
var removeProfileImageController = async (req, res, next) => {
  try {
    const user = await removeProfileImage(req.user.id);
    sendSuccess(res, user, "Profile image removed successfully");
  } catch (error) {
    next(error);
  }
};

// src/middleware/auth.middleware.ts
import { fromNodeHeaders as fromNodeHeaders2 } from "better-auth/node";
var authMiddleware = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders2(req.headers)
      });
 
      if (!session?.user) {
        throw new UnauthorizedError(
          "You are not logged in. Please log in to continue."
        );
      }
      const { user } = session;
      const typedUser = user;
     
      if (typedUser.isDeleted) {
        throw new ForbiddenError(
          "This account no longer exists. Please contact support."
        );
      }
      if (typedUser.status === "SUSPENDED") {
        throw new ForbiddenError(
          "Your account has been suspended. Please contact support."
        );
      }
      if (roles.length > 0 && !roles.includes(typedUser.role)) {
        throw new ForbiddenError(
          "You do not have permission to access this resource."
        );
      }
      req.user = typedUser;
      req.session = session.session;
      next();
    } catch (error) {
      next(error);
    }
  };
};
var auth_middleware_default = authMiddleware;
var requireAuth = [authMiddleware()];
var requireAdmin = [authMiddleware(UserRole.ADMIN)];
var requirePharmacy = [authMiddleware(UserRole.ADMIN, UserRole.PHARMACY)];
var requireStaff = [authMiddleware(UserRole.ADMIN, UserRole.PHARMACY, UserRole.STAFF)];

// src/config/multer.config.ts
import multer from "multer";
var MAX_IMAGE_SIZE = 1 * 1024 * 1024;
var allowedMimeTypes2 = /* @__PURE__ */ new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp"
]);
var imageFileFilter = (_req, file, cb) => {
  if (allowedMimeTypes2.has(file.mimetype)) {
    cb(null, true);
    return;
  }
  cb(new Error("Only JPG, PNG, and WEBP image files are allowed."));
};
var imageMemoryUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFileFilter,
  limits: { fileSize: MAX_IMAGE_SIZE }
});
var medicineImageUpload = imageMemoryUpload;
var pharmacyLogoUpload = imageMemoryUpload;
var userAvatarUpload = imageMemoryUpload;

// src/middleware/upload.middleware.ts
var normalizeUploadError = (err) => {
  if (!err) return null;
  if (err instanceof Error && err.message.includes("File too large")) {
    return new BadRequestError("Image size must be 1 MB or less.");
  }
  if (err instanceof Error) return new BadRequestError(err.message);
  return new BadRequestError("Invalid image upload.");
};
var uploadMedicineImage = (req, res, next) => {
  medicineImageUpload.single("image")(req, res, (err) => {
    const uploadError = normalizeUploadError(err);
    if (uploadError) return next(uploadError);
    next();
  });
};
var uploadMedicineImageOptional = uploadMedicineImage;
var uploadPharmacyLogo = (req, res, next) => {
  pharmacyLogoUpload.single("logo")(req, res, (err) => {
    const uploadError = normalizeUploadError(err);
    if (uploadError) return next(uploadError);
    next();
  });
};
var uploadPharmacyLogoOptional = uploadPharmacyLogo;
var uploadUserAvatar = (req, res, next) => {
  userAvatarUpload.single("avatar")(req, res, (err) => {
    const uploadError = normalizeUploadError(err);
    if (uploadError) return next(uploadError);
    next();
  });
};

// src/modules/auth/auth.routes.ts
var authRoutes = Router();
authRoutes.get("/me", ...requireAuth, getMeController);
authRoutes.put(
  "/profile-image",
  ...requireAuth,
  uploadUserAvatar,
  updateProfileImageController
);
authRoutes.delete(
  "/profile-image",
  ...requireAuth,
  removeProfileImageController
);
authRoutes.post("/demo-login/:role", demoLoginController);
var auth_routes_default = authRoutes;

// src/modules/categories/category.routes.ts
import { Router as Router2 } from "express";

// src/modules/categories/category.service.ts
var createCategory = async (data) => {
  const existing = await prisma.category.findUnique({
    where: { slug: data.slug }
  });
  if (existing) {
    if (existing.isDeleted) {
      throw new ConflictError("A category with this slug already exists (even if deleted)");
    }
    throw new ConflictError("Category already exists with this slug");
  }
  return await prisma.category.create({
    data
  });
};
var getAllCategories = async (query) => {
  const {
    page = 1,
    limit = 10,
    searchTerm,
    sortBy = "createdAt",
    sortOrder = "desc",
    isActive
  } = query;
  const skip = (page - 1) * limit;
  const where = {
    isDeleted: false
  };
  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } }
    ];
  }
  if (isActive !== void 0) {
    where.isActive = isActive;
  }
  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder }
    }),
    prisma.category.count({ where })
  ]);
  return {
    categories,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getCategoryById = async (id) => {
  const category = await prisma.category.findFirst({
    where: { id, isDeleted: false }
  });
  if (!category) {
    throw new NotFoundError("Category not found");
  }
  return category;
};
var updateCategory = async (id, data) => {
  const category = await getCategoryById(id);
  if (data.slug && data.slug !== category.slug) {
    const existing = await prisma.category.findUnique({
      where: { slug: data.slug }
    });
    if (existing) throw new ConflictError("Slug already in use");
  }
  return await prisma.category.update({
    where: { id },
    data
  });
};
var deleteCategory = async (id) => {
  await getCategoryById(id);
  return await prisma.category.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
};

// src/modules/categories/category.validation.ts
import { z as z2 } from "zod";
var createCategorySchema = z2.object({
  name: z2.string().min(1, "Name is required"),
  slug: z2.string().min(1, "Slug is required"),
  description: z2.string().optional(),
  isActive: z2.boolean().optional()
});
var updateCategorySchema = z2.object({
  name: z2.string().min(1).optional(),
  slug: z2.string().min(1).optional(),
  description: z2.string().optional(),
  isActive: z2.boolean().optional()
});

// src/modules/categories/category.controller.ts
var createCategory2 = async (req, res, next) => {
  try {
    const validatedData = createCategorySchema.parse(req.body);
    const result = await createCategory(validatedData);
    sendCreated(res, result, "Category created successfully");
  } catch (error) {
    next(error);
  }
};
var getAllCategories2 = async (req, res, next) => {
  try {
    const query = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      searchTerm: req.query.searchTerm,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder || "desc",
      isActive: req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : void 0
    };
    const { categories, meta } = await getAllCategories(query);
    sendSuccess(res, categories, "Categories retrieved successfully", 200, meta);
  } catch (error) {
    next(error);
  }
};
var getCategoryById2 = async (req, res, next) => {
  try {
    const result = await getCategoryById(req.params.id);
    sendSuccess(res, result, "Category retrieved successfully");
  } catch (error) {
    next(error);
  }
};
var updateCategory2 = async (req, res, next) => {
  try {
    const validatedData = updateCategorySchema.parse(req.body);
    const result = await updateCategory(req.params.id, validatedData);
    sendSuccess(res, result, "Category updated successfully");
  } catch (error) {
    next(error);
  }
};
var deleteCategory2 = async (req, res, next) => {
  try {
    await deleteCategory(req.params.id);
    sendSuccess(res, null, "Category deleted successfully");
  } catch (error) {
    next(error);
  }
};

// src/modules/categories/category.routes.ts
var categoryRoutes = Router2();
categoryRoutes.get("/", ...requireAdmin, getAllCategories2);
categoryRoutes.get("/:id", ...requireAdmin, getCategoryById2);
categoryRoutes.post("/", ...requireAdmin, createCategory2);
categoryRoutes.put("/:id", ...requireAdmin, updateCategory2);
categoryRoutes.delete("/:id", ...requireAdmin, deleteCategory2);
var category_routes_default = categoryRoutes;

// src/modules/medicine-types/medicine-type.routes.ts
import { Router as Router3 } from "express";

// src/modules/medicine-types/medicine-type.service.ts
var createMedicineType = async (data) => {
  const existing = await prisma.medicineType.findUnique({
    where: { name: data.name }
  });
  if (existing) {
    throw new ConflictError("Medicine Type already exists");
  }
  return await prisma.medicineType.create({
    data
  });
};
var getAllMedicineTypes = async (query) => {
  const {
    page = 1,
    limit = 10,
    searchTerm,
    sortBy = "createdAt",
    sortOrder = "desc",
    isActive
  } = query;
  const skip = (page - 1) * limit;
  const where = {
    isDeleted: false
  };
  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } }
    ];
  }
  if (isActive !== void 0) {
    where.isActive = isActive;
  }
  const [medicineTypes, total] = await Promise.all([
    prisma.medicineType.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder }
    }),
    prisma.medicineType.count({ where })
  ]);
  return {
    medicineTypes,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getMedicineTypeById = async (id) => {
  const medicineType = await prisma.medicineType.findFirst({
    where: { id, isDeleted: false }
  });
  if (!medicineType) {
    throw new NotFoundError("Medicine Type not found");
  }
  return medicineType;
};
var updateMedicineType = async (id, data) => {
  await getMedicineTypeById(id);
  if (data.name) {
    const existing = await prisma.medicineType.findFirst({
      where: { name: data.name, id: { not: id } }
    });
    if (existing) throw new ConflictError("Name already in use");
  }
  return await prisma.medicineType.update({
    where: { id },
    data
  });
};
var deleteMedicineType = async (id) => {
  await getMedicineTypeById(id);
  return await prisma.medicineType.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
};

// src/modules/medicine-types/medicine-type.validation.ts
import { z as z3 } from "zod";
var createMedicineTypeSchema = z3.object({
  name: z3.string().min(1, "Name is required"),
  description: z3.string().optional(),
  isActive: z3.boolean().optional()
});
var updateMedicineTypeSchema = z3.object({
  name: z3.string().min(1).optional(),
  description: z3.string().optional(),
  isActive: z3.boolean().optional()
});

// src/modules/medicine-types/medicine-type.controller.ts
var createMedicineType2 = async (req, res, next) => {
  try {
    const validatedData = createMedicineTypeSchema.parse(req.body);
    const result = await createMedicineType(validatedData);
    sendCreated(res, result, "Medicine type created successfully");
  } catch (error) {
    next(error);
  }
};
var getAllMedicineTypes2 = async (req, res, next) => {
  try {
    const query = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      searchTerm: req.query.searchTerm,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder || "desc",
      isActive: req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : void 0
    };
    const { medicineTypes, meta } = await getAllMedicineTypes(query);
    sendSuccess(res, medicineTypes, "Medicine types retrieved successfully", 200, meta);
  } catch (error) {
    next(error);
  }
};
var getMedicineTypeById2 = async (req, res, next) => {
  try {
    const result = await getMedicineTypeById(req.params.id);
    sendSuccess(res, result, "Medicine type retrieved successfully");
  } catch (error) {
    next(error);
  }
};
var updateMedicineType2 = async (req, res, next) => {
  try {
    const validatedData = updateMedicineTypeSchema.parse(req.body);
    const result = await updateMedicineType(req.params.id, validatedData);
    sendSuccess(res, result, "Medicine type updated successfully");
  } catch (error) {
    next(error);
  }
};
var deleteMedicineType2 = async (req, res, next) => {
  try {
    await deleteMedicineType(req.params.id);
    sendSuccess(res, null, "Medicine type deleted successfully");
  } catch (error) {
    next(error);
  }
};

// src/modules/medicine-types/medicine-type.routes.ts
var medicineTypeRoutes = Router3();
medicineTypeRoutes.get("/", ...requireAdmin, getAllMedicineTypes2);
medicineTypeRoutes.get("/:id", ...requireAdmin, getMedicineTypeById2);
medicineTypeRoutes.post("/", ...requireAdmin, createMedicineType2);
medicineTypeRoutes.put("/:id", ...requireAdmin, updateMedicineType2);
medicineTypeRoutes.delete("/:id", ...requireAdmin, deleteMedicineType2);
var medicine_type_routes_default = medicineTypeRoutes;

// src/modules/units/unit.routes.ts
import { Router as Router4 } from "express";

// src/modules/units/unit.service.ts
var createUnit = async (data) => {
  const existing = await prisma.unit.findUnique({
    where: { name: data.name }
  });
  if (existing) {
    throw new ConflictError("Unit already exists");
  }
  return await prisma.unit.create({
    data
  });
};
var getAllUnits = async (query) => {
  const {
    page = 1,
    limit = 10,
    searchTerm,
    sortBy = "createdAt",
    sortOrder = "desc",
    isActive
  } = query;
  const skip = (page - 1) * limit;
  const where = {
    isDeleted: false
  };
  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { symbol: { contains: searchTerm, mode: "insensitive" } }
    ];
  }
  if (isActive !== void 0) {
    where.isActive = isActive;
  }
  const [units, total] = await Promise.all([
    prisma.unit.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder }
    }),
    prisma.unit.count({ where })
  ]);
  return {
    units,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getUnitById = async (id) => {
  const unit = await prisma.unit.findFirst({
    where: { id, isDeleted: false }
  });
  if (!unit) {
    throw new NotFoundError("Unit not found");
  }
  return unit;
};
var updateUnit = async (id, data) => {
  await getUnitById(id);
  if (data.name) {
    const existing = await prisma.unit.findFirst({
      where: { name: data.name, id: { not: id } }
    });
    if (existing) throw new ConflictError("Name already in use");
  }
  return await prisma.unit.update({
    where: { id },
    data
  });
};
var deleteUnit = async (id) => {
  await getUnitById(id);
  return await prisma.unit.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
};

// src/modules/units/unit.validation.ts
import { z as z4 } from "zod";
var createUnitSchema = z4.object({
  name: z4.string().min(1, "Name is required"),
  symbol: z4.string().min(1, "Symbol is required"),
  isActive: z4.boolean().optional()
});
var updateUnitSchema = z4.object({
  name: z4.string().min(1).optional(),
  symbol: z4.string().min(1).optional(),
  isActive: z4.boolean().optional()
});

// src/modules/units/unit.controller.ts
var createUnit2 = async (req, res, next) => {
  try {
    const validatedData = createUnitSchema.parse(req.body);
    const result = await createUnit(validatedData);
    sendCreated(res, result, "Unit created successfully");
  } catch (error) {
    next(error);
  }
};
var getAllUnits2 = async (req, res, next) => {
  try {
    const query = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      searchTerm: req.query.searchTerm,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder || "desc",
      isActive: req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : void 0
    };
    const { units, meta } = await getAllUnits(query);
    sendSuccess(res, units, "Units retrieved successfully", 200, meta);
  } catch (error) {
    next(error);
  }
};
var getUnitById2 = async (req, res, next) => {
  try {
    const result = await getUnitById(req.params.id);
    sendSuccess(res, result, "Unit retrieved successfully");
  } catch (error) {
    next(error);
  }
};
var updateUnit2 = async (req, res, next) => {
  try {
    const validatedData = updateUnitSchema.parse(req.body);
    const result = await updateUnit(req.params.id, validatedData);
    sendSuccess(res, result, "Unit updated successfully");
  } catch (error) {
    next(error);
  }
};
var deleteUnit2 = async (req, res, next) => {
  try {
    await deleteUnit(req.params.id);
    sendSuccess(res, null, "Unit deleted successfully");
  } catch (error) {
    next(error);
  }
};

// src/modules/units/unit.routes.ts
var unitRoutes = Router4();
unitRoutes.get("/", ...requireAdmin, getAllUnits2);
unitRoutes.get("/:id", ...requireAdmin, getUnitById2);
unitRoutes.post("/", ...requireAdmin, createUnit2);
unitRoutes.put("/:id", ...requireAdmin, updateUnit2);
unitRoutes.delete("/:id", ...requireAdmin, deleteUnit2);
var unit_routes_default = unitRoutes;

// src/modules/leaf-settings/leaf-setting.routes.ts
import { Router as Router5 } from "express";

// src/modules/leaf-settings/leaf-setting.service.ts
var createLeafSetting = async (data) => {
  const existing = await prisma.leafSetting.findUnique({
    where: { name: data.name }
  });
  if (existing) {
    throw new ConflictError("Leaf setting with this name already exists");
  }
  return await prisma.leafSetting.create({
    data
  });
};
var getAllLeafSettings = async (query) => {
  const {
    page = 1,
    limit = 10,
    searchTerm,
    sortBy = "createdAt",
    sortOrder = "desc",
    isActive
  } = query;
  const skip = (page - 1) * limit;
  const where = {
    isDeleted: false
  };
  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } }
    ];
  }
  if (isActive !== void 0) {
    where.isActive = isActive;
  }
  const [leafSettings, total] = await Promise.all([
    prisma.leafSetting.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder }
    }),
    prisma.leafSetting.count({ where })
  ]);
  return {
    leafSettings,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getLeafSettingById = async (id) => {
  const leafSetting = await prisma.leafSetting.findFirst({
    where: { id, isDeleted: false }
  });
  if (!leafSetting) {
    throw new NotFoundError("Leaf setting not found");
  }
  return leafSetting;
};
var updateLeafSetting = async (id, data) => {
  await getLeafSettingById(id);
  if (data.name) {
    const existing = await prisma.leafSetting.findFirst({
      where: { name: data.name, id: { not: id } }
    });
    if (existing) throw new ConflictError("Name already in use");
  }
  return await prisma.leafSetting.update({
    where: { id },
    data
  });
};
var deleteLeafSetting = async (id) => {
  await getLeafSettingById(id);
  return await prisma.leafSetting.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
};

// src/modules/leaf-settings/leaf-setting.validation.ts
import { z as z5 } from "zod";
var createLeafSettingSchema = z5.object({
  name: z5.string().min(1, "Name is required"),
  leavesPerStrip: z5.number().int().min(1, "Leaves per strip must be at least 1"),
  stripsPerBox: z5.number().int().min(1, "Strips per box must be at least 1"),
  description: z5.string().optional(),
  isActive: z5.boolean().optional()
});
var updateLeafSettingSchema = z5.object({
  name: z5.string().min(1).optional(),
  leavesPerStrip: z5.number().int().min(1).optional(),
  stripsPerBox: z5.number().int().min(1).optional(),
  description: z5.string().optional(),
  isActive: z5.boolean().optional()
});

// src/modules/leaf-settings/leaf-setting.controller.ts
var createLeafSetting2 = async (req, res, next) => {
  try {
    const validatedData = createLeafSettingSchema.parse(req.body);
    const result = await createLeafSetting(validatedData);
    sendCreated(res, result, "Leaf setting created successfully");
  } catch (error) {
    next(error);
  }
};
var getAllLeafSettings2 = async (req, res, next) => {
  try {
    const query = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      searchTerm: req.query.searchTerm,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder || "desc",
      isActive: req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : void 0
    };
    const { leafSettings, meta } = await getAllLeafSettings(query);
    sendSuccess(res, leafSettings, "Leaf settings retrieved successfully", 200, meta);
  } catch (error) {
    next(error);
  }
};
var getLeafSettingById2 = async (req, res, next) => {
  try {
    const result = await getLeafSettingById(req.params.id);
    sendSuccess(res, result, "Leaf setting retrieved successfully");
  } catch (error) {
    next(error);
  }
};
var updateLeafSetting2 = async (req, res, next) => {
  try {
    const validatedData = updateLeafSettingSchema.parse(req.body);
    const result = await updateLeafSetting(req.params.id, validatedData);
    sendSuccess(res, result, "Leaf setting updated successfully");
  } catch (error) {
    next(error);
  }
};
var deleteLeafSetting2 = async (req, res, next) => {
  try {
    await deleteLeafSetting(req.params.id);
    sendSuccess(res, null, "Leaf setting deleted successfully");
  } catch (error) {
    next(error);
  }
};

// src/modules/leaf-settings/leaf-setting.routes.ts
var leafSettingRoutes = Router5();
leafSettingRoutes.get("/", ...requireAdmin, getAllLeafSettings2);
leafSettingRoutes.get("/:id", ...requireAdmin, getLeafSettingById2);
leafSettingRoutes.post("/", ...requireAdmin, createLeafSetting2);
leafSettingRoutes.put("/:id", ...requireAdmin, updateLeafSetting2);
leafSettingRoutes.delete("/:id", ...requireAdmin, deleteLeafSetting2);
var leaf_setting_routes_default = leafSettingRoutes;

// src/modules/suppliers/supplier.routes.ts
import { Router as Router6 } from "express";

// src/modules/suppliers/supplier.service.ts
var createSupplier = async (data) => {
  if (data.email) {
    const existing = await prisma.supplier.findUnique({
      where: { email: data.email }
    });
    if (existing) throw new ConflictError("Supplier with this email already exists");
  }
  return await prisma.supplier.create({
    data: {
      ...data,
      email: data.email || null
    }
  });
};
var getAllSuppliers = async (query) => {
  const {
    page = 1,
    limit = 10,
    searchTerm,
    sortBy = "createdAt",
    sortOrder = "desc",
    isActive
  } = query;
  const skip = (page - 1) * limit;
  const where = {
    isDeleted: false
  };
  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { contactPerson: { contains: searchTerm, mode: "insensitive" } },
      { email: { contains: searchTerm, mode: "insensitive" } },
      { phone: { contains: searchTerm, mode: "insensitive" } }
    ];
  }
  if (isActive !== void 0) {
    where.isActive = isActive;
  }
  const [suppliers, total] = await Promise.all([
    prisma.supplier.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder }
    }),
    prisma.supplier.count({ where })
  ]);
  return {
    suppliers,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getSupplierById = async (id) => {
  const supplier = await prisma.supplier.findFirst({
    where: { id, isDeleted: false }
  });
  if (!supplier) {
    throw new NotFoundError("Supplier not found");
  }
  return supplier;
};
var updateSupplier = async (id, data) => {
  await getSupplierById(id);
  if (data.email) {
    const existing = await prisma.supplier.findFirst({
      where: { email: data.email, id: { not: id } }
    });
    if (existing) throw new ConflictError("Email already in use");
  }
  return await prisma.supplier.update({
    where: { id },
    data: {
      ...data,
      email: data.email || null
    }
  });
};
var deleteSupplier = async (id) => {
  await getSupplierById(id);
  return await prisma.supplier.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
};

// src/modules/suppliers/supplier.validation.ts
import { z as z6 } from "zod";
var createSupplierSchema = z6.object({
  name: z6.string().min(1, "Name is required"),
  contactPerson: z6.string().optional(),
  email: z6.string().email("Invalid email").optional().or(z6.literal("")),
  phone: z6.string().optional(),
  address: z6.string().optional(),
  isActive: z6.boolean().optional()
});
var updateSupplierSchema = z6.object({
  name: z6.string().min(1).optional(),
  contactPerson: z6.string().optional(),
  email: z6.string().email("Invalid email").optional().or(z6.literal("")),
  phone: z6.string().optional(),
  address: z6.string().optional(),
  isActive: z6.boolean().optional()
});

// src/modules/suppliers/supplier.controller.ts
var createSupplier2 = async (req, res, next) => {
  try {
    const validatedData = createSupplierSchema.parse(req.body);
    const result = await createSupplier(validatedData);
    sendCreated(res, result, "Supplier created successfully");
  } catch (error) {
    next(error);
  }
};
var getAllSuppliers2 = async (req, res, next) => {
  try {
    const query = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      searchTerm: req.query.searchTerm,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder || "desc",
      isActive: req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : void 0
    };
    const { suppliers, meta } = await getAllSuppliers(query);
    sendSuccess(res, suppliers, "Suppliers retrieved successfully", 200, meta);
  } catch (error) {
    next(error);
  }
};
var getSupplierById2 = async (req, res, next) => {
  try {
    const result = await getSupplierById(req.params.id);
    sendSuccess(res, result, "Supplier retrieved successfully");
  } catch (error) {
    next(error);
  }
};
var updateSupplier2 = async (req, res, next) => {
  try {
    const validatedData = updateSupplierSchema.parse(req.body);
    const result = await updateSupplier(req.params.id, validatedData);
    sendSuccess(res, result, "Supplier updated successfully");
  } catch (error) {
    next(error);
  }
};
var deleteSupplier2 = async (req, res, next) => {
  try {
    await deleteSupplier(req.params.id);
    sendSuccess(res, null, "Supplier deleted successfully");
  } catch (error) {
    next(error);
  }
};

// src/modules/suppliers/supplier.routes.ts
var supplierRoutes = Router6();
supplierRoutes.get("/", ...requireAdmin, getAllSuppliers2);
supplierRoutes.get("/:id", ...requireAdmin, getSupplierById2);
supplierRoutes.post("/", ...requireAdmin, createSupplier2);
supplierRoutes.put("/:id", ...requireAdmin, updateSupplier2);
supplierRoutes.delete("/:id", ...requireAdmin, deleteSupplier2);
var supplier_routes_default = supplierRoutes;

// src/modules/medicines/medicine.routes.ts
import { Router as Router7 } from "express";

// src/modules/medicines/medicine.service.ts
var createMedicine = async (data) => {
  return await prisma.medicine.create({
    data,
    include: {
      category: true,
      type: true,
      supplier: true,
      unit: true,
      leafSetting: true
    }
  });
};
var getAllMedicines = async (query) => {
  const {
    page = 1,
    limit = 10,
    searchTerm,
    categoryId,
    typeId,
    supplierId,
    status,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = query;
  const skip = (page - 1) * limit;
  const where = {
    isDeleted: false
  };
  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { genericName: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } }
    ];
  }
  if (categoryId) where.categoryId = categoryId;
  if (typeId) where.typeId = typeId;
  if (supplierId) where.supplierId = supplierId;
  if (status) where.status = status;
  const [medicines, total] = await Promise.all([
    prisma.medicine.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        category: true,
        type: true,
        supplier: true,
        unit: true,
        leafSetting: true
      }
    }),
    prisma.medicine.count({ where })
  ]);
  return {
    medicines,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getMedicineById = async (id) => {
  const medicine = await prisma.medicine.findFirst({
    where: { id, isDeleted: false },
    include: {
      category: true,
      type: true,
      supplier: true,
      unit: true,
      leafSetting: true
    }
  });
  if (!medicine) {
    throw new NotFoundError("Medicine not found");
  }
  return medicine;
};
var updateMedicine = async (id, data) => {
  const medicine = await getMedicineById(id);
  if ("image" in data && medicine.image && data.image !== medicine.image) {
    await deleteFromCloudinaryByPublicId(medicine.imagePublicId);
    if (!medicine.imagePublicId) {
      await deleteFromCloudinary(medicine.image);
    }
  }
  return await prisma.medicine.update({
    where: { id },
    data,
    include: {
      category: true,
      type: true,
      supplier: true,
      unit: true,
      leafSetting: true
    }
  });
};
var deleteMedicine = async (id) => {
  const medicine = await getMedicineById(id);
  const result = await prisma.medicine.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
  if (medicine.image) {
    await deleteFromCloudinaryByPublicId(medicine.imagePublicId);
    if (!medicine.imagePublicId) {
      await deleteFromCloudinary(medicine.image);
    }
  }
  return result;
};

// src/modules/medicines/medicine.validation.ts
import { z as z7 } from "zod";

// src/constant/enum.ts
var MEDICINE_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  DISCONTINUED: "DISCONTINUED"
};
var PHARMACY_INVENTORY_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  ARCHIVED: "ARCHIVED"
};
var MEDICINE_REQUEST_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED"
};
var PURCHASE_STATUS = {
  PENDING: "PENDING",
  RECEIVED: "RECEIVED",
  PARTIAL: "PARTIAL",
  CANCELLED: "CANCELLED"
};
var PAYMENT_STATUS = {
  UNPAID: "UNPAID",
  PARTIAL: "PARTIAL",
  PAID: "PAID",
  CANCELLED: "CANCELLED"
};
var PAYMENT_MODE = {
  CASH: "CASH",
  CARD: "CARD",
  MOBILE_BANKING: "MOBILE_BANKING",
  BANK_TRANSFER: "BANK_TRANSFER"
};

// src/modules/medicines/medicine.validation.ts
var createMedicineSchema = z7.object({
  name: z7.string().min(1, "Name is required"),
  genericName: z7.string().optional(),
  strength: z7.string().optional(),
  boxSize: z7.string().optional(),
  shelf: z7.string().optional(),
  price: z7.coerce.number().min(0, "Price must be positive"),
  supplierPrice: z7.coerce.number().min(0, "Supplier price must be positive").optional(),
  vat: z7.coerce.number().min(0, "VAT must be positive").optional(),
  expiryDate: z7.string().datetime().optional().or(z7.literal("")),
  stockQuantity: z7.coerce.number().int().min(0).optional(),
  description: z7.string().optional(),
  status: z7.enum([
    MEDICINE_STATUS.ACTIVE,
    MEDICINE_STATUS.INACTIVE,
    MEDICINE_STATUS.DISCONTINUED
  ]).optional(),
  categoryId: z7.string().optional(),
  typeId: z7.string().optional(),
  supplierId: z7.string().optional(),
  unitId: z7.string().optional(),
  leafSettingId: z7.string().optional()
});
var updateMedicineSchema = z7.object({
  name: z7.string().min(1).optional(),
  genericName: z7.string().optional(),
  strength: z7.string().optional(),
  boxSize: z7.string().optional(),
  shelf: z7.string().optional(),
  price: z7.coerce.number().min(0).optional(),
  supplierPrice: z7.coerce.number().min(0).optional(),
  vat: z7.coerce.number().min(0).optional(),
  expiryDate: z7.string().datetime().optional().or(z7.literal("")),
  stockQuantity: z7.coerce.number().int().min(0).optional(),
  description: z7.string().optional(),
  status: z7.enum([
    MEDICINE_STATUS.ACTIVE,
    MEDICINE_STATUS.INACTIVE,
    MEDICINE_STATUS.DISCONTINUED
  ]).optional(),
  categoryId: z7.string().optional(),
  typeId: z7.string().optional(),
  supplierId: z7.string().optional(),
  unitId: z7.string().optional(),
  leafSettingId: z7.string().optional(),
  image: z7.string().optional(),
  removeImage: z7.coerce.boolean().optional()
});

// src/modules/medicines/medicine.controller.ts
var getParamId = (req) => {
  const id = req.params.id;
  if (!id || Array.isArray(id)) throw new BadRequestError("Medicine id is required");
  return id;
};
var createMedicine2 = async (req, res, next) => {
  try {
    const validatedData = createMedicineSchema.parse(req.body);
    const uploadedImage = await uploadImage(req.file, "medicine");
    const data = {
      ...validatedData,
      image: uploadedImage?.secureUrl || null,
      imagePublicId: uploadedImage?.publicId || null,
      expiryDate: validatedData.expiryDate ? new Date(validatedData.expiryDate) : null
    };
    const result = await createMedicine(data);
    sendCreated(res, result, "Medicine created successfully");
  } catch (error) {
    next(error);
  }
};
var getAllMedicines2 = async (req, res, next) => {
  try {
    const query = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      searchTerm: req.query.searchTerm,
      categoryId: req.query.categoryId,
      typeId: req.query.typeId,
      supplierId: req.query.supplierId,
      status: req.query.status,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder || "desc"
    };
    const { medicines, meta } = await getAllMedicines(query);
    sendSuccess(res, medicines, "Medicines retrieved successfully", 200, meta);
  } catch (error) {
    next(error);
  }
};
var getMedicineById2 = async (req, res, next) => {
  try {
    const result = await getMedicineById(getParamId(req));
    sendSuccess(res, result, "Medicine retrieved successfully");
  } catch (error) {
    next(error);
  }
};
var updateMedicine2 = async (req, res, next) => {
  try {
    const validatedData = updateMedicineSchema.parse(req.body);
    const data = {
      ...validatedData
    };
    if (req.file) {
      const uploadedImage = await uploadImage(req.file, "medicine");
      data.image = uploadedImage?.secureUrl || null;
      data.imagePublicId = uploadedImage?.publicId || null;
    } else if (validatedData.removeImage) {
      data.image = null;
      data.imagePublicId = null;
    }
    delete data.removeImage;
    if (validatedData.expiryDate) {
      data.expiryDate = new Date(validatedData.expiryDate);
    } else if (validatedData.expiryDate === "") {
      data.expiryDate = null;
    }
    const result = await updateMedicine(getParamId(req), data);
    sendSuccess(res, result, "Medicine updated successfully");
  } catch (error) {
    next(error);
  }
};
var deleteMedicine2 = async (req, res, next) => {
  try {
    await deleteMedicine(getParamId(req));
    sendSuccess(res, null, "Medicine deleted successfully");
  } catch (error) {
    next(error);
  }
};

// src/modules/medicines/medicine.routes.ts
var medicineRoutes = Router7();
medicineRoutes.get("/", ...requireAdmin, getAllMedicines2);
medicineRoutes.get("/:id", ...requireAdmin, getMedicineById2);
medicineRoutes.post("/", ...requireAdmin, uploadMedicineImage, createMedicine2);
medicineRoutes.put("/:id", ...requireAdmin, uploadMedicineImageOptional, updateMedicine2);
medicineRoutes.delete("/:id", ...requireAdmin, deleteMedicine2);
var medicine_routes_default = medicineRoutes;

// src/modules/pharmacies/pharmacy.routes.ts
import { Router as Router8 } from "express";

// src/modules/pharmacies/pharmacy.service.ts
async function getPharmacyByUserId(userId) {
  const pharmacy = await prisma.pharmacy.findUnique({
    where: { ownerId: userId }
  });
  return pharmacy;
}
async function createPharmacy(userId, data) {
  const existing = await prisma.pharmacy.findUnique({
    where: { ownerId: userId }
  });
  if (existing) {
    throw new BadRequestError("Pharmacy profile already exists for this user");
  }
  return prisma.pharmacy.create({
    data: {
      ...data,
      ownerId: userId,
      status: PharmacyStatus.PENDING
    }
  });
}
async function getPendingPharmacies() {
  return prisma.pharmacy.findMany({
    where: { status: PharmacyStatus.PENDING },
    include: {
      owner: {
        select: {
          name: true,
          email: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}
async function approvePharmacy(id) {
  const pharmacy = await prisma.pharmacy.findUnique({ where: { id } });
  if (!pharmacy) {
    throw new NotFoundError("Pharmacy not found");
  }
  if (pharmacy.status === PharmacyStatus.APPROVED) {
    throw new BadRequestError("Pharmacy is already approved");
  }
  return prisma.pharmacy.update({
    where: { id },
    data: {
      status: PharmacyStatus.APPROVED,
      rejectionReason: null
    }
  });
}
async function rejectPharmacy(id, reason) {
  const pharmacy = await prisma.pharmacy.findUnique({ where: { id } });
  if (!pharmacy) {
    throw new NotFoundError("Pharmacy not found");
  }
  return prisma.pharmacy.update({
    where: { id },
    data: {
      status: PharmacyStatus.REJECTED,
      rejectionReason: reason
    }
  });
}
async function resubmitPharmacy(userId, data) {
  const pharmacy = await prisma.pharmacy.findUnique({
    where: { ownerId: userId }
  });
  if (!pharmacy) {
    throw new NotFoundError("Pharmacy profile not found");
  }
  if (pharmacy.status !== PharmacyStatus.REJECTED) {
    throw new BadRequestError("Only rejected pharmacies can resubmit");
  }
  if (data.logo && pharmacy.logo && data.logo !== pharmacy.logo) {
    await deleteFromCloudinaryByPublicId(pharmacy.logoPublicId);
    if (!pharmacy.logoPublicId) {
      await deleteFromCloudinary(pharmacy.logo);
    }
  }
  return prisma.pharmacy.update({
    where: { ownerId: userId },
    data: {
      ...data,
      status: PharmacyStatus.PENDING,
      rejectionReason: null
    }
  });
}

// src/modules/pharmacies/pharmacy.validation.ts
import { z as z8 } from "zod";
var resubmitPharmacySchema = z8.object({
  name: z8.string().min(2).optional(),
  licenseNumber: z8.string().min(2).optional(),
  binVat: z8.string().optional(),
  pharmacyType: z8.enum(["RETAIL", "WHOLESALE", "HOSPITAL", "CLINIC"]).optional(),
  establishedYear: z8.number().optional(),
  staffCount: z8.number().optional(),
  openingHours: z8.string().optional(),
  website: z8.string().url().optional().or(z8.literal("")),
  phone: z8.string().optional(),
  address: z8.string().optional(),
  logo: z8.string().url().optional().or(z8.literal(""))
});
var approvePharmacySchema = z8.object({
  id: z8.string().uuid()
});
var rejectPharmacySchema = z8.object({
  id: z8.string().uuid(),
  reason: z8.string().min(5, "Reason must be at least 5 characters")
});

// src/modules/pharmacies/pharmacy.controller.ts
var getMyPharmacyStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const pharmacy = await getPharmacyByUserId(userId);
    sendSuccess(res, pharmacy, "Pharmacy status retrieved");
  } catch (error) {
    next(error);
  }
};
var getPendingPharmacies2 = async (req, res, next) => {
  try {
    const pharmacies = await getPendingPharmacies();
    sendSuccess(res, pharmacies, "Pending pharmacies retrieved");
  } catch (error) {
    next(error);
  }
};
var approvePharmacy2 = async (req, res, next) => {
  try {
    const { id } = approvePharmacySchema.parse(req.params);
    const pharmacy = await approvePharmacy(id);
    sendSuccess(res, pharmacy, "Pharmacy approved successfully");
  } catch (error) {
    next(error);
  }
};
var rejectPharmacy2 = async (req, res, next) => {
  try {
    const { id } = rejectPharmacySchema.parse({ ...req.params, ...req.body });
    const pharmacy = await rejectPharmacy(id, req.body.reason);
    sendSuccess(res, pharmacy, "Pharmacy rejected successfully");
  } catch (error) {
    next(error);
  }
};
var resubmitPharmacy2 = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const validatedData = resubmitPharmacySchema.parse(req.body);
    const uploadedLogo = await uploadImage(req.file, "pharmacyLogo");
    const pharmacy = await resubmitPharmacy(userId, {
      ...validatedData,
      ...uploadedLogo ? {
        logo: uploadedLogo.secureUrl,
        logoPublicId: uploadedLogo.publicId
      } : {}
    });
    sendSuccess(res, pharmacy, "Pharmacy information resubmitted");
  } catch (error) {
    next(error);
  }
};
var createPharmacy2 = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const uploadedLogo = await uploadImage(req.file, "pharmacyLogo");
    const pharmacyData = {
      ...req.body,
      logo: uploadedLogo?.secureUrl || null,
      logoPublicId: uploadedLogo?.publicId || null,
      // Convert numeric strings to numbers
      establishedYear: req.body.establishedYear ? parseInt(req.body.establishedYear) : void 0,
      staffCount: req.body.staffCount ? parseInt(req.body.staffCount) : void 0
    };
    const pharmacy = await createPharmacy(userId, pharmacyData);
    sendSuccess(res, pharmacy, "Pharmacy profile created successfully", 201);
  } catch (error) {
    next(error);
  }
};

// src/modules/pharmacies/pharmacy.routes.ts
var router = Router8();
router.get("/status", ...requireAuth, getMyPharmacyStatus);
router.post("/", ...requireAuth, uploadPharmacyLogo, createPharmacy2);
router.patch("/resubmit", ...requireAuth, uploadPharmacyLogoOptional, resubmitPharmacy2);
router.get("/admin/pending", ...requireAdmin, getPendingPharmacies2);
router.patch("/admin/:id/approve", ...requireAdmin, approvePharmacy2);
router.patch("/admin/:id/reject", ...requireAdmin, rejectPharmacy2);
var pharmacy_routes_default = router;

// src/modules/inventory/inventory.routes.ts
import { Router as Router9 } from "express";

// src/modules/staff/staff.permission.ts
async function assertStaffPermission(userId, permission) {
  const staff = await prisma.staff.findUnique({
    where: { userId }
  });
  if (!staff || staff.isDeleted || !staff.isActive) {
    throw new ForbiddenError("This staff account is inactive or not assigned to a pharmacy.");
  }
  if (!staff[permission]) {
    throw new ForbiddenError("You do not have permission to perform this staff action.");
  }
  return staff;
}

// src/modules/inventory/inventory.service.ts
var EXPIRING_SOON_DAYS = 30;
var inventoryInclude = {
  medicine: {
    include: {
      category: true,
      type: true,
      unit: true,
      supplier: true
    }
  }
};
async function getApprovedPharmacyForUser(userId, role = UserRole.PHARMACY, requireManage = true) {
  const staffProfile = role === UserRole.STAFF ? await prisma.staff.findUnique({ where: { userId }, include: { pharmacy: true } }) : null;
  if (role === UserRole.STAFF) {
    if (requireManage) await assertStaffPermission(userId, "canManageInventory");
    if (!staffProfile || staffProfile.isDeleted || !staffProfile.isActive) {
      throw new ForbiddenError("This staff account is inactive or not assigned to a pharmacy.");
    }
  }
  const pharmacy = role === UserRole.STAFF ? staffProfile?.pharmacy : await prisma.pharmacy.findUnique({
    where: { ownerId: userId }
  });
  if (!pharmacy) {
    throw new ForbiddenError("Create a pharmacy profile before managing inventory.");
  }
  if (pharmacy.status !== PharmacyStatus.APPROVED) {
    throw new ForbiddenError("Your pharmacy must be approved before managing inventory.");
  }
  return pharmacy;
}
var withInventoryFlags = (item) => {
  const now = /* @__PURE__ */ new Date();
  const expiringSoonDate = new Date(now);
  expiringSoonDate.setDate(now.getDate() + EXPIRING_SOON_DAYS);
  return {
    ...item,
    isLowStock: item.stockQuantity <= item.lowStockAlertQuantity,
    isExpiringSoon: item.expiryDate !== null && item.expiryDate >= now && item.expiryDate <= expiringSoonDate
  };
};
var normalizeDate = (date) => {
  if (!date) return void 0;
  return new Date(date);
};
async function getGlobalMedicinesForInventory(query) {
  const {
    page = 1,
    limit = 10,
    searchTerm,
    categoryId,
    typeId,
    sortBy = "name",
    sortOrder = "asc"
  } = query;
  const skip = (page - 1) * limit;
  const where = {
    isDeleted: false,
    status: MedicineStatus.ACTIVE
  };
  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { genericName: { contains: searchTerm, mode: "insensitive" } },
      { strength: { contains: searchTerm, mode: "insensitive" } }
    ];
  }
  if (categoryId) where.categoryId = categoryId;
  if (typeId) where.typeId = typeId;
  const [medicines, total] = await Promise.all([
    prisma.medicine.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        category: true,
        type: true,
        unit: true,
        supplier: true
      }
    }),
    prisma.medicine.count({ where })
  ]);
  return {
    medicines,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}
async function createInventoryItem(userId, data, role = UserRole.PHARMACY) {
  const pharmacy = await getApprovedPharmacyForUser(userId, role, true);
  const medicine = await prisma.medicine.findFirst({
    where: {
      id: data.medicineId,
      isDeleted: false,
      status: MedicineStatus.ACTIVE
    }
  });
  if (!medicine) {
    throw new NotFoundError("Active global medicine not found.");
  }
  const duplicate = await prisma.pharmacyInventory.findFirst({
    where: {
      pharmacyId: pharmacy.id,
      medicineId: data.medicineId,
      batchNumber: data.batchNumber || null,
      status: { not: PharmacyInventoryStatus.ARCHIVED }
    }
  });
  if (duplicate) {
    throw new ConflictError("This medicine batch already exists in your inventory.");
  }
  const createData = {
    pharmacyId: pharmacy.id,
    medicineId: data.medicineId,
    batchNumber: data.batchNumber || null,
    stockQuantity: data.stockQuantity,
    sellingPrice: data.sellingPrice,
    purchasePrice: data.purchasePrice ?? null,
    shelf: data.shelf || null,
    lowStockAlertQuantity: data.lowStockAlertQuantity ?? 10,
    status: data.status ?? PharmacyInventoryStatus.ACTIVE
  };
  const expiryDate = normalizeDate(data.expiryDate);
  if (expiryDate) createData.expiryDate = expiryDate;
  return prisma.pharmacyInventory.create({
    data: createData,
    include: inventoryInclude
  }).then(withInventoryFlags);
}
async function getInventory(userId, query, role = UserRole.PHARMACY) {
  const pharmacy = await getApprovedPharmacyForUser(userId, role, false);
  const {
    page = 1,
    limit = 10,
    searchTerm,
    categoryId,
    status,
    lowStock,
    expiringSoon,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = query;
  const skip = (page - 1) * limit;
  const where = {
    pharmacyId: pharmacy.id,
    status: status ?? { not: PharmacyInventoryStatus.ARCHIVED }
  };
  if (lowStock) {
    where.stockQuantity = { lte: prisma.pharmacyInventory.fields.lowStockAlertQuantity };
  }
  if (expiringSoon) {
    const now = /* @__PURE__ */ new Date();
    const until = new Date(now);
    until.setDate(now.getDate() + EXPIRING_SOON_DAYS);
    where.expiryDate = {
      gte: now,
      lte: until
    };
  }
  if (searchTerm || categoryId) {
    where.medicine = {
      isDeleted: false,
      ...categoryId ? { categoryId } : {},
      ...searchTerm ? {
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { genericName: { contains: searchTerm, mode: "insensitive" } },
          { strength: { contains: searchTerm, mode: "insensitive" } }
        ]
      } : {}
    };
  }
  const orderBy = sortBy === "medicineName" ? { medicine: { name: sortOrder } } : { [sortBy]: sortOrder };
  const [items, total] = await Promise.all([
    prisma.pharmacyInventory.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: inventoryInclude
    }),
    prisma.pharmacyInventory.count({ where })
  ]);
  return {
    items: items.map(withInventoryFlags),
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}
async function getInventoryItem(userId, id, role = UserRole.PHARMACY) {
  const pharmacy = await getApprovedPharmacyForUser(userId, role, false);
  const item = await prisma.pharmacyInventory.findFirst({
    where: {
      id,
      pharmacyId: pharmacy.id
    },
    include: inventoryInclude
  });
  if (!item) {
    throw new NotFoundError("Inventory item not found.");
  }
  return withInventoryFlags(item);
}
async function updateInventoryItem(userId, id, data, role = UserRole.PHARMACY) {
  await getApprovedPharmacyForUser(userId, role, true);
  const existing = await getInventoryItem(userId, id, role);
  if (existing.status === PharmacyInventoryStatus.ARCHIVED) {
    throw new BadRequestError("Archived inventory items cannot be updated.");
  }
  if (data.medicineId && data.medicineId !== existing.medicineId) {
    const medicine = await prisma.medicine.findFirst({
      where: {
        id: data.medicineId,
        isDeleted: false,
        status: MedicineStatus.ACTIVE
      }
    });
    if (!medicine) {
      throw new NotFoundError("Active global medicine not found.");
    }
  }
  const updateData = {
    ...data
  };
  if ("expiryDate" in updateData) {
    updateData.expiryDate = normalizeDate(data.expiryDate);
  }
  if (updateData.batchNumber === "") updateData.batchNumber = null;
  if (updateData.shelf === "") updateData.shelf = null;
  return prisma.pharmacyInventory.update({
    where: { id },
    data: updateData,
    include: inventoryInclude
  }).then(withInventoryFlags);
}
async function archiveInventoryItem(userId, id, role = UserRole.PHARMACY) {
  await getApprovedPharmacyForUser(userId, role, true);
  const item = await getInventoryItem(userId, id, role);
  if (item.status === PharmacyInventoryStatus.ARCHIVED) {
    return item;
  }
  return prisma.pharmacyInventory.update({
    where: { id },
    data: {
      status: PharmacyInventoryStatus.ARCHIVED
    },
    include: inventoryInclude
  }).then(withInventoryFlags);
}

// src/modules/inventory/inventory.validation.ts
import { z as z9 } from "zod";
var statusEnum = z9.enum([
  PHARMACY_INVENTORY_STATUS.ACTIVE,
  PHARMACY_INVENTORY_STATUS.INACTIVE,
  PHARMACY_INVENTORY_STATUS.ARCHIVED
]);
var dateString = z9.string().min(1).optional().or(z9.literal(""));
var createInventorySchema = z9.object({
  medicineId: z9.string().min(1, "Medicine is required"),
  batchNumber: z9.string().trim().optional(),
  stockQuantity: z9.coerce.number().int().min(0, "Stock quantity must be zero or more"),
  sellingPrice: z9.coerce.number().min(0, "Selling price must be zero or more"),
  purchasePrice: z9.coerce.number().min(0, "Purchase price must be zero or more").optional(),
  expiryDate: dateString,
  shelf: z9.string().trim().optional(),
  lowStockAlertQuantity: z9.coerce.number().int().min(0).optional(),
  status: statusEnum.optional()
});
var updateInventorySchema = createInventorySchema.omit({ medicineId: true }).partial().extend({
  medicineId: z9.string().min(1).optional()
});
var inventoryQuerySchema = z9.object({
  page: z9.coerce.number().int().min(1).optional(),
  limit: z9.coerce.number().int().min(1).max(100).optional(),
  searchTerm: z9.string().optional(),
  categoryId: z9.string().optional(),
  status: statusEnum.optional(),
  lowStock: z9.coerce.boolean().optional(),
  expiringSoon: z9.coerce.boolean().optional(),
  sortBy: z9.enum(["createdAt", "updatedAt", "stockQuantity", "sellingPrice", "expiryDate", "medicineName"]).optional(),
  sortOrder: z9.enum(["asc", "desc"]).optional()
});
var globalMedicineQuerySchema = z9.object({
  page: z9.coerce.number().int().min(1).optional(),
  limit: z9.coerce.number().int().min(1).max(100).optional(),
  searchTerm: z9.string().optional(),
  categoryId: z9.string().optional(),
  typeId: z9.string().optional(),
  sortBy: z9.enum(["createdAt", "name", "genericName", "price"]).optional(),
  sortOrder: z9.enum(["asc", "desc"]).optional()
});

// src/modules/inventory/inventory.controller.ts
var getGlobalMedicines = async (req, res, next) => {
  try {
    const query = globalMedicineQuerySchema.parse(req.query);
    const { medicines, meta } = await getGlobalMedicinesForInventory(query);
    sendSuccess(res, medicines, "Global medicines retrieved successfully", 200, meta);
  } catch (error) {
    next(error);
  }
};
var createInventoryItem2 = async (req, res, next) => {
  try {
    const payload = createInventorySchema.parse(req.body);
    const result = await createInventoryItem(req.user.id, payload, req.user.role);
    sendCreated(res, result, "Inventory item added successfully");
  } catch (error) {
    next(error);
  }
};
var getInventory2 = async (req, res, next) => {
  try {
    const query = inventoryQuerySchema.parse(req.query);
    const { items, meta } = await getInventory(req.user.id, query, req.user.role);
    sendSuccess(res, items, "Inventory retrieved successfully", 200, meta);
  } catch (error) {
    next(error);
  }
};
var getInventoryItem2 = async (req, res, next) => {
  try {
    const result = await getInventoryItem(req.user.id, String(req.params.id), req.user.role);
    sendSuccess(res, result, "Inventory item retrieved successfully");
  } catch (error) {
    next(error);
  }
};
var updateInventoryItem2 = async (req, res, next) => {
  try {
    const payload = updateInventorySchema.parse(req.body);
    const result = await updateInventoryItem(req.user.id, String(req.params.id), payload, req.user.role);
    sendSuccess(res, result, "Inventory item updated successfully");
  } catch (error) {
    next(error);
  }
};
var archiveInventoryItem2 = async (req, res, next) => {
  try {
    const result = await archiveInventoryItem(req.user.id, String(req.params.id), req.user.role);
    sendSuccess(res, result, "Inventory item archived successfully");
  } catch (error) {
    next(error);
  }
};

// src/modules/inventory/inventory.routes.ts
var router2 = Router9();
var requireApprovedPharmacyUser = [auth_middleware_default(UserRole.PHARMACY, UserRole.STAFF)];
router2.get("/medicines", ...requireApprovedPharmacyUser, getGlobalMedicines);
router2.get("/", ...requireApprovedPharmacyUser, getInventory2);
router2.get("/:id", ...requireApprovedPharmacyUser, getInventoryItem2);
router2.post("/", ...requireApprovedPharmacyUser, createInventoryItem2);
router2.put("/:id", ...requireApprovedPharmacyUser, updateInventoryItem2);
router2.delete("/:id", ...requireApprovedPharmacyUser, archiveInventoryItem2);
var inventory_routes_default = router2;

// src/modules/medicine-requests/medicine-request.routes.ts
import { Router as Router10 } from "express";

// src/modules/medicine-requests/medicine-request.service.ts
var medicineRequestInclude = {
  pharmacy: {
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  },
  medicine: true
};
async function createMedicineRequest(userId, data) {
  const pharmacy = await getApprovedPharmacyForUser(userId);
  return prisma.medicineRequest.create({
    data: {
      pharmacyId: pharmacy.id,
      requestedName: data.requestedName,
      genericName: data.genericName || null,
      categorySuggestion: data.categorySuggestion || null,
      typeSuggestion: data.typeSuggestion || null,
      unitSuggestion: data.unitSuggestion || null,
      strength: data.strength || null,
      companyName: data.companyName || null,
      note: data.note || null
    },
    include: medicineRequestInclude
  });
}
async function getMyMedicineRequests(userId, query) {
  const pharmacy = await getApprovedPharmacyForUser(userId);
  return getMedicineRequests({ ...query, pharmacyId: pharmacy.id });
}
async function getAdminMedicineRequests(query) {
  return getMedicineRequests(query);
}
async function getMedicineRequests(query) {
  const {
    page = 1,
    limit = 10,
    searchTerm,
    status,
    sortBy = "createdAt",
    sortOrder = "desc",
    pharmacyId
  } = query;
  const skip = (page - 1) * limit;
  const where = {};
  if (pharmacyId) where.pharmacyId = pharmacyId;
  if (status) where.status = status;
  if (searchTerm) {
    where.OR = [
      { requestedName: { contains: searchTerm, mode: "insensitive" } },
      { genericName: { contains: searchTerm, mode: "insensitive" } },
      { companyName: { contains: searchTerm, mode: "insensitive" } },
      { note: { contains: searchTerm, mode: "insensitive" } }
    ];
  }
  const [requests, total] = await Promise.all([
    prisma.medicineRequest.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: medicineRequestInclude
    }),
    prisma.medicineRequest.count({ where })
  ]);
  return {
    requests,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}
async function approveMedicineRequest(id, input) {
  const request = await prisma.medicineRequest.findUnique({
    where: { id }
  });
  if (!request) {
    throw new NotFoundError("Medicine request not found.");
  }
  if (request.status !== MedicineRequestStatus.PENDING) {
    throw new BadRequestError("Only pending medicine requests can be approved.");
  }
  const medicinePayload = input.medicine ?? {};
  return prisma.$transaction(async (tx) => {
    const medicineData = {
      name: medicinePayload.name || request.requestedName,
      genericName: medicinePayload.genericName || request.genericName,
      strength: medicinePayload.strength || request.strength,
      price: medicinePayload.price ?? 0,
      supplierPrice: medicinePayload.supplierPrice ?? null,
      description: medicinePayload.description || [request.companyName ? `Company: ${request.companyName}` : null, request.note].filter(Boolean).join("\n") || null,
      status: MedicineStatus.ACTIVE
    };
    if (medicinePayload.categoryId) medicineData.categoryId = medicinePayload.categoryId;
    if (medicinePayload.typeId) medicineData.typeId = medicinePayload.typeId;
    if (medicinePayload.unitId) medicineData.unitId = medicinePayload.unitId;
    if (medicinePayload.supplierId) medicineData.supplierId = medicinePayload.supplierId;
    const medicine = await tx.medicine.create({
      data: medicineData
    });
    return tx.medicineRequest.update({
      where: { id },
      data: {
        status: MedicineRequestStatus.APPROVED,
        adminNote: input.adminNote || null,
        medicineId: medicine.id
      },
      include: medicineRequestInclude
    });
  });
}
async function rejectMedicineRequest(id, input) {
  const request = await prisma.medicineRequest.findUnique({
    where: { id }
  });
  if (!request) {
    throw new NotFoundError("Medicine request not found.");
  }
  if (request.status !== MedicineRequestStatus.PENDING) {
    throw new BadRequestError("Only pending medicine requests can be rejected.");
  }
  return prisma.medicineRequest.update({
    where: { id },
    data: {
      status: MedicineRequestStatus.REJECTED,
      adminNote: input.adminNote
    },
    include: medicineRequestInclude
  });
}

// src/modules/medicine-requests/medicine-request.validation.ts
import { z as z10 } from "zod";
var requestStatusEnum = z10.enum([
  MEDICINE_REQUEST_STATUS.PENDING,
  MEDICINE_REQUEST_STATUS.APPROVED,
  MEDICINE_REQUEST_STATUS.REJECTED
]);
var createMedicineRequestSchema = z10.object({
  requestedName: z10.string().trim().min(1, "Medicine name is required"),
  genericName: z10.string().trim().optional(),
  categorySuggestion: z10.string().trim().optional(),
  typeSuggestion: z10.string().trim().optional(),
  unitSuggestion: z10.string().trim().optional(),
  strength: z10.string().trim().optional(),
  companyName: z10.string().trim().optional(),
  note: z10.string().trim().optional()
});
var medicineRequestQuerySchema = z10.object({
  page: z10.coerce.number().int().min(1).optional(),
  limit: z10.coerce.number().int().min(1).max(100).optional(),
  searchTerm: z10.string().optional(),
  status: requestStatusEnum.optional(),
  sortBy: z10.enum(["createdAt", "updatedAt", "requestedName", "status"]).optional(),
  sortOrder: z10.enum(["asc", "desc"]).optional()
});
var approveMedicineRequestSchema = z10.object({
  adminNote: z10.string().trim().optional(),
  medicine: z10.object({
    name: z10.string().trim().optional(),
    genericName: z10.string().trim().optional(),
    strength: z10.string().trim().optional(),
    price: z10.coerce.number().min(0).optional(),
    supplierPrice: z10.coerce.number().min(0).optional(),
    categoryId: z10.string().trim().optional(),
    typeId: z10.string().trim().optional(),
    unitId: z10.string().trim().optional(),
    supplierId: z10.string().trim().optional(),
    description: z10.string().trim().optional()
  }).optional()
});
var rejectMedicineRequestSchema = z10.object({
  adminNote: z10.string().trim().min(1, "Rejection reason is required")
});

// src/modules/medicine-requests/medicine-request.controller.ts
var createMedicineRequest2 = async (req, res, next) => {
  try {
    const payload = createMedicineRequestSchema.parse(req.body);
    const result = await createMedicineRequest(req.user.id, payload);
    sendCreated(res, result, "Medicine request submitted successfully");
  } catch (error) {
    next(error);
  }
};
var getMyMedicineRequests2 = async (req, res, next) => {
  try {
    const query = medicineRequestQuerySchema.parse(req.query);
    const { requests, meta } = await getMyMedicineRequests(req.user.id, query);
    sendSuccess(res, requests, "Medicine requests retrieved successfully", 200, meta);
  } catch (error) {
    next(error);
  }
};
var getAdminMedicineRequests2 = async (req, res, next) => {
  try {
    const query = medicineRequestQuerySchema.parse(req.query);
    const { requests, meta } = await getAdminMedicineRequests(query);
    sendSuccess(res, requests, "Medicine requests retrieved successfully", 200, meta);
  } catch (error) {
    next(error);
  }
};
var approveMedicineRequest2 = async (req, res, next) => {
  try {
    const payload = approveMedicineRequestSchema.parse(req.body);
    const result = await approveMedicineRequest(String(req.params.id), payload);
    sendSuccess(res, result, "Medicine request approved and added to global database");
  } catch (error) {
    next(error);
  }
};
var rejectMedicineRequest2 = async (req, res, next) => {
  try {
    const payload = rejectMedicineRequestSchema.parse(req.body);
    const result = await rejectMedicineRequest(String(req.params.id), payload);
    sendSuccess(res, result, "Medicine request rejected successfully");
  } catch (error) {
    next(error);
  }
};

// src/modules/medicine-requests/medicine-request.routes.ts
var router3 = Router10();
var requireApprovedPharmacyUser2 = [auth_middleware_default(UserRole.PHARMACY)];
router3.get("/pharmacy", ...requireApprovedPharmacyUser2, getMyMedicineRequests2);
router3.post("/pharmacy", ...requireApprovedPharmacyUser2, createMedicineRequest2);
router3.get("/admin", ...requireAdmin, getAdminMedicineRequests2);
router3.patch("/admin/:id/approve", ...requireAdmin, approveMedicineRequest2);
router3.patch("/admin/:id/reject", ...requireAdmin, rejectMedicineRequest2);
var medicine_request_routes_default = router3;

// src/modules/purchases/purchase.routes.ts
import { Router as Router11 } from "express";

// src/modules/purchases/purchase.service.ts
var purchaseInclude = {
  supplier: true,
  items: {
    include: {
      inventory: {
        include: {
          medicine: {
            include: {
              category: true,
              type: true,
              unit: true
            }
          }
        }
      },
      medicine: {
        include: {
          category: true,
          type: true,
          unit: true
        }
      }
    }
  }
};
var derivePaymentStatus = (totalAmount, paidAmount) => {
  if (paidAmount <= 0) return PaymentStatus.UNPAID;
  if (paidAmount >= totalAmount) return PaymentStatus.PAID;
  return PaymentStatus.PARTIAL;
};
var buildAmounts = (data) => {
  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.purchasePrice, 0);
  const vatAmount = data.vatAmount ?? 0;
  const discount = data.discount ?? 0;
  const totalAmount = Math.max(0, subtotal + vatAmount - discount);
  const paidAmount = Math.min(data.paidAmount ?? 0, totalAmount);
  const dueAmount = Math.max(0, totalAmount - paidAmount);
  return {
    subtotal,
    vatAmount,
    discount,
    totalAmount,
    paidAmount,
    dueAmount,
    paymentStatus: derivePaymentStatus(totalAmount, paidAmount)
  };
};
async function getPurchaseForPharmacy(userId, purchaseId) {
  const pharmacy = await getApprovedPharmacyForUser(userId);
  const purchase = await prisma.purchase.findFirst({
    where: {
      id: purchaseId,
      pharmacyId: pharmacy.id
    },
    include: purchaseInclude
  });
  if (!purchase) {
    throw new NotFoundError("Purchase not found.");
  }
  return { pharmacy, purchase };
}
async function validateSupplier(supplierId) {
  const supplier = await prisma.supplier.findFirst({
    where: {
      id: supplierId,
      isDeleted: false,
      isActive: true
    }
  });
  if (!supplier) {
    throw new NotFoundError("Active supplier not found.");
  }
}
async function getActiveSuppliers(userId, query) {
  await getApprovedPharmacyForUser(userId);
  const where = {
    isDeleted: false,
    isActive: true
  };
  if (query.searchTerm) {
    where.OR = [
      { name: { contains: query.searchTerm, mode: "insensitive" } },
      { contactPerson: { contains: query.searchTerm, mode: "insensitive" } },
      { phone: { contains: query.searchTerm, mode: "insensitive" } }
    ];
  }
  return prisma.supplier.findMany({
    where,
    take: query.limit ?? 100,
    orderBy: { name: "asc" }
  });
}
async function createPurchase(userId, data) {
  const pharmacy = await getApprovedPharmacyForUser(userId);
  await validateSupplier(data.supplierId);
  const duplicateInvoice = await prisma.purchase.findUnique({
    where: {
      pharmacyId_invoiceNumber: {
        pharmacyId: pharmacy.id,
        invoiceNumber: data.invoiceNumber
      }
    }
  });
  if (duplicateInvoice) {
    throw new ConflictError("A purchase with this invoice number already exists for your pharmacy.");
  }
  const inventoryIds = data.items.map((item) => item.inventoryId);
  const inventoryItems = await prisma.pharmacyInventory.findMany({
    where: {
      id: { in: inventoryIds },
      pharmacyId: pharmacy.id,
      status: { not: PharmacyInventoryStatus.ARCHIVED },
      medicine: {
        isDeleted: false,
        status: MedicineStatus.ACTIVE
      }
    },
    include: { medicine: true }
  });
  const inventoryById = new Map(inventoryItems.map((item) => [item.id, item]));
  if (inventoryById.size !== inventoryIds.length) {
    throw new BadRequestError("One or more inventory items are invalid for this pharmacy.");
  }
  for (const item of data.items) {
    const inventory = inventoryById.get(item.inventoryId);
    if (!inventory || inventory.medicineId !== item.medicineId) {
      throw new BadRequestError("Purchase item medicine must match the selected inventory item.");
    }
  }
  const amounts = buildAmounts(data);
  const shouldReceive = data.purchaseStatus === PurchaseStatus.RECEIVED;
  return prisma.$transaction(async (tx) => {
    const purchase = await tx.purchase.create({
      data: {
        pharmacyId: pharmacy.id,
        supplierId: data.supplierId,
        invoiceNumber: data.invoiceNumber,
        purchaseDate: new Date(data.purchaseDate),
        subtotal: amounts.subtotal,
        vatAmount: amounts.vatAmount,
        discount: amounts.discount,
        totalAmount: amounts.totalAmount,
        paidAmount: amounts.paidAmount,
        dueAmount: amounts.dueAmount,
        paymentStatus: amounts.paymentStatus,
        purchaseStatus: data.purchaseStatus,
        note: data.note || null,
        createdByUserId: userId,
        items: {
          create: data.items.map((item) => ({
            inventory: { connect: { id: item.inventoryId } },
            medicine: { connect: { id: item.medicineId } },
            quantity: item.quantity,
            purchasePrice: item.purchasePrice,
            sellingPrice: item.sellingPrice,
            ...item.expiryDate ? { expiryDate: new Date(item.expiryDate) } : {},
            batchNumber: item.batchNumber || null,
            total: item.quantity * item.purchasePrice
          }))
        }
      },
      include: purchaseInclude
    });
    if (shouldReceive) {
      for (const item of data.items) {
        await tx.pharmacyInventory.update({
          where: { id: item.inventoryId },
          data: {
            stockQuantity: { increment: item.quantity },
            purchasePrice: item.purchasePrice,
            sellingPrice: item.sellingPrice,
            ...item.expiryDate ? { expiryDate: new Date(item.expiryDate) } : {},
            ...item.batchNumber ? { batchNumber: item.batchNumber } : {}
          }
        });
      }
    }
    return purchase;
  });
}
async function getPurchases(userId, query) {
  const pharmacy = await getApprovedPharmacyForUser(userId);
  const {
    page = 1,
    limit = 10,
    searchTerm,
    supplierId,
    paymentStatus,
    purchaseStatus,
    dateFrom,
    dateTo,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = query;
  const skip = (page - 1) * limit;
  const where = {
    pharmacyId: pharmacy.id
  };
  if (supplierId) where.supplierId = supplierId;
  if (paymentStatus) where.paymentStatus = paymentStatus;
  if (purchaseStatus) where.purchaseStatus = purchaseStatus;
  if (dateFrom || dateTo) {
    where.purchaseDate = {};
    if (dateFrom) where.purchaseDate.gte = new Date(dateFrom);
    if (dateTo) where.purchaseDate.lte = new Date(dateTo);
  }
  if (searchTerm) {
    where.OR = [
      { invoiceNumber: { contains: searchTerm, mode: "insensitive" } },
      { supplier: { name: { contains: searchTerm, mode: "insensitive" } } }
    ];
  }
  const [purchases, total] = await Promise.all([
    prisma.purchase.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        supplier: true,
        items: true
      }
    }),
    prisma.purchase.count({ where })
  ]);
  return {
    purchases,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}
async function getPurchaseById(userId, purchaseId) {
  const { purchase } = await getPurchaseForPharmacy(userId, purchaseId);
  return purchase;
}
async function updatePurchasePayment(userId, purchaseId, data) {
  const { purchase } = await getPurchaseForPharmacy(userId, purchaseId);
  if (purchase.purchaseStatus === PurchaseStatus.CANCELLED) {
    throw new BadRequestError("Cancelled purchases cannot receive payments.");
  }
  const totalAmount = Number(purchase.totalAmount);
  const paidAmount = Math.min(data.paidAmount, totalAmount);
  const dueAmount = Math.max(0, totalAmount - paidAmount);
  const paymentStatus = data.paymentStatus ?? derivePaymentStatus(totalAmount, paidAmount);
  return prisma.purchase.update({
    where: { id: purchaseId },
    data: {
      paidAmount,
      dueAmount,
      paymentStatus
    },
    include: purchaseInclude
  });
}
async function updatePurchaseStatus(userId, purchaseId, data) {
  const { purchase } = await getPurchaseForPharmacy(userId, purchaseId);
  if (purchase.purchaseStatus === data.purchaseStatus) {
    return purchase;
  }
  if (purchase.purchaseStatus === PurchaseStatus.RECEIVED && data.purchaseStatus === PurchaseStatus.CANCELLED) {
    throw new BadRequestError("Received purchases cannot be cancelled because stock has already been added.");
  }
  if (purchase.purchaseStatus !== PurchaseStatus.PENDING || data.purchaseStatus !== PurchaseStatus.RECEIVED) {
    throw new BadRequestError("Only pending purchases can be marked as received.");
  }
  return prisma.$transaction(async (tx) => {
    for (const item of purchase.items) {
      if (!item.inventoryId) {
        throw new BadRequestError("Purchase item is missing an inventory reference.");
      }
      await tx.pharmacyInventory.update({
        where: { id: item.inventoryId },
        data: {
          stockQuantity: { increment: item.quantity },
          purchasePrice: item.purchasePrice,
          sellingPrice: item.sellingPrice,
          ...item.expiryDate ? { expiryDate: item.expiryDate } : {},
          ...item.batchNumber ? { batchNumber: item.batchNumber } : {}
        }
      });
    }
    return tx.purchase.update({
      where: { id: purchaseId },
      data: {
        purchaseStatus: PurchaseStatus.RECEIVED
      },
      include: purchaseInclude
    });
  });
}

// src/modules/purchases/purchase.validation.ts
import { z as z11 } from "zod";
var purchaseStatusEnum = z11.enum([
  PURCHASE_STATUS.PENDING,
  PURCHASE_STATUS.RECEIVED,
  PURCHASE_STATUS.PARTIAL,
  PURCHASE_STATUS.CANCELLED
]);
var paymentStatusEnum = z11.enum([
  PAYMENT_STATUS.UNPAID,
  PAYMENT_STATUS.PARTIAL,
  PAYMENT_STATUS.PAID,
  PAYMENT_STATUS.CANCELLED
]);
var createPurchaseStatusEnum = z11.enum([
  PURCHASE_STATUS.PENDING,
  PURCHASE_STATUS.RECEIVED
]);
var emptyToUndefined = (value) => value === "" ? void 0 : value;
var dateString2 = z11.string().min(1).optional().or(z11.literal(""));
var createPurchaseItemSchema = z11.object({
  inventoryId: z11.string().min(1, "Inventory item is required"),
  medicineId: z11.string().min(1, "Medicine is required"),
  quantity: z11.coerce.number().int().min(1, "Quantity must be at least 1"),
  purchasePrice: z11.coerce.number().min(0, "Purchase price must be zero or more"),
  sellingPrice: z11.coerce.number().min(0, "Selling price must be zero or more"),
  expiryDate: dateString2,
  batchNumber: z11.string().trim().optional()
});
var createPurchaseSchema = z11.object({
  supplierId: z11.string().min(1, "Supplier is required"),
  invoiceNumber: z11.string().trim().min(1, "Invoice number is required"),
  purchaseDate: z11.string().min(1, "Purchase date is required"),
  vatAmount: z11.coerce.number().min(0, "VAT amount must be zero or more").optional(),
  discount: z11.coerce.number().min(0, "Discount must be zero or more").optional(),
  paidAmount: z11.coerce.number().min(0, "Paid amount must be zero or more").optional(),
  purchaseStatus: createPurchaseStatusEnum.default(PURCHASE_STATUS.PENDING),
  note: z11.string().trim().optional(),
  items: z11.array(createPurchaseItemSchema).min(1, "Add at least one purchase item")
});
var purchaseQuerySchema = z11.object({
  page: z11.coerce.number().int().min(1).optional(),
  limit: z11.coerce.number().int().min(1).max(100).optional(),
  searchTerm: z11.preprocess(emptyToUndefined, z11.string().optional()),
  supplierId: z11.preprocess(emptyToUndefined, z11.string().optional()),
  paymentStatus: z11.preprocess(emptyToUndefined, paymentStatusEnum.optional()),
  purchaseStatus: z11.preprocess(emptyToUndefined, purchaseStatusEnum.optional()),
  dateFrom: z11.preprocess(emptyToUndefined, z11.string().optional()),
  dateTo: z11.preprocess(emptyToUndefined, z11.string().optional()),
  sortBy: z11.enum(["createdAt", "purchaseDate", "invoiceNumber", "totalAmount", "paidAmount", "dueAmount"]).optional(),
  sortOrder: z11.enum(["asc", "desc"]).optional()
});
var updatePaymentSchema = z11.object({
  paidAmount: z11.coerce.number().min(0, "Paid amount must be zero or more"),
  paymentStatus: paymentStatusEnum.optional()
});
var updatePurchaseStatusSchema = z11.object({
  purchaseStatus: purchaseStatusEnum
});

// src/modules/purchases/purchase.controller.ts
var getActiveSuppliers2 = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.searchTerm) query.searchTerm = String(req.query.searchTerm);
    if (req.query.limit) query.limit = Number(req.query.limit);
    const result = await getActiveSuppliers(req.user.id, query);
    sendSuccess(res, result, "Suppliers retrieved successfully");
  } catch (error) {
    next(error);
  }
};
var createPurchase2 = async (req, res, next) => {
  try {
    const payload = createPurchaseSchema.parse(req.body);
    const result = await createPurchase(req.user.id, payload);
    sendCreated(res, result, "Purchase created successfully");
  } catch (error) {
    next(error);
  }
};
var getPurchases2 = async (req, res, next) => {
  try {
    const query = purchaseQuerySchema.parse(req.query);
    const { purchases, meta } = await getPurchases(req.user.id, query);
    sendSuccess(res, purchases, "Purchases retrieved successfully", 200, meta);
  } catch (error) {
    next(error);
  }
};
var getPurchaseById2 = async (req, res, next) => {
  try {
    const result = await getPurchaseById(req.user.id, String(req.params.id));
    sendSuccess(res, result, "Purchase retrieved successfully");
  } catch (error) {
    next(error);
  }
};
var updatePurchasePayment2 = async (req, res, next) => {
  try {
    const payload = updatePaymentSchema.parse(req.body);
    const result = await updatePurchasePayment(req.user.id, String(req.params.id), payload);
    sendSuccess(res, result, "Purchase payment updated successfully");
  } catch (error) {
    next(error);
  }
};
var updatePurchaseStatus2 = async (req, res, next) => {
  try {
    const payload = updatePurchaseStatusSchema.parse(req.body);
    const result = await updatePurchaseStatus(req.user.id, String(req.params.id), payload);
    sendSuccess(res, result, "Purchase status updated successfully");
  } catch (error) {
    next(error);
  }
};

// src/modules/purchases/purchase.routes.ts
var router4 = Router11();
var requireApprovedPharmacyUser3 = [auth_middleware_default(UserRole.PHARMACY)];
router4.get("/suppliers", ...requireApprovedPharmacyUser3, getActiveSuppliers2);
router4.get("/", ...requireApprovedPharmacyUser3, getPurchases2);
router4.post("/", ...requireApprovedPharmacyUser3, createPurchase2);
router4.get("/:id", ...requireApprovedPharmacyUser3, getPurchaseById2);
router4.patch("/:id/payment", ...requireApprovedPharmacyUser3, updatePurchasePayment2);
router4.patch("/:id/status", ...requireApprovedPharmacyUser3, updatePurchaseStatus2);
var purchase_routes_default = router4;

// src/modules/customers/customer.routes.ts
import { Router as Router12 } from "express";

// src/modules/customers/customer.service.ts
async function getApprovedOperationalPharmacyForUser(userId, role, permission) {
  const staffProfile = role === UserRole.STAFF ? await prisma.staff.findUnique({
    where: { userId },
    include: { pharmacy: true }
  }) : null;
  if (role === UserRole.STAFF) {
    if (!staffProfile || staffProfile.isDeleted || !staffProfile.isActive) {
      throw new ForbiddenError("This staff account is inactive or not assigned to a pharmacy.");
    }
    if (permission) {
      await assertStaffPermission(userId, permission);
    }
  }
  const pharmacy = role === UserRole.STAFF ? staffProfile?.pharmacy : await prisma.pharmacy.findUnique({
    where: { ownerId: userId }
  });
  if (!pharmacy) {
    throw new ForbiddenError("No pharmacy is assigned to this account.");
  }
  if (pharmacy.status !== PharmacyStatus.APPROVED) {
    throw new ForbiddenError("Your pharmacy must be approved before managing sales.");
  }
  return pharmacy;
}
async function createCustomer(userId, role, data) {
  const pharmacy = await getApprovedOperationalPharmacyForUser(userId, role, "canManageCustomers");
  return prisma.customer.create({
    data: {
      pharmacyId: pharmacy.id,
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      address: data.address || null
    }
  });
}
async function getCustomers(userId, role, query) {
  const pharmacy = await getApprovedOperationalPharmacyForUser(userId, role, "canManageCustomers");
  const { page = 1, limit = 10, searchTerm, sortBy = "createdAt", sortOrder = "desc" } = query;
  const skip = (page - 1) * limit;
  const where = {
    pharmacyId: pharmacy.id,
    isDeleted: false
  };
  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { phone: { contains: searchTerm, mode: "insensitive" } },
      { email: { contains: searchTerm, mode: "insensitive" } }
    ];
  }
  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder }
    }),
    prisma.customer.count({ where })
  ]);
  return {
    customers,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}
async function getCustomerById(userId, role, id) {
  const pharmacy = await getApprovedOperationalPharmacyForUser(userId, role, "canManageCustomers");
  const customer = await prisma.customer.findFirst({
    where: {
      id,
      pharmacyId: pharmacy.id,
      isDeleted: false
    }
  });
  if (!customer) {
    throw new NotFoundError("Customer not found.");
  }
  return customer;
}
async function updateCustomer(userId, role, id, data) {
  await getCustomerById(userId, role, id);
  return prisma.customer.update({
    where: { id },
    data: {
      ...data.name !== void 0 ? { name: data.name } : {},
      ...data.phone !== void 0 ? { phone: data.phone } : {},
      ...data.email !== void 0 ? { email: data.email || null } : {},
      ...data.address !== void 0 ? { address: data.address || null } : {}
    }
  });
}
async function archiveCustomer(userId, role, id) {
  await getCustomerById(userId, role, id);
  return prisma.customer.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
}

// src/modules/customers/customer.validation.ts
import { z as z12 } from "zod";
var emptyToUndefined2 = (value) => value === "" ? void 0 : value;
var createCustomerSchema = z12.object({
  name: z12.string().trim().min(1, "Customer name is required"),
  phone: z12.string().trim().min(1, "Phone is required"),
  email: z12.preprocess(emptyToUndefined2, z12.string().trim().email("Invalid email").optional()),
  address: z12.string().trim().optional()
});
var updateCustomerSchema = createCustomerSchema.partial();
var customerQuerySchema = z12.object({
  page: z12.coerce.number().int().min(1).optional(),
  limit: z12.coerce.number().int().min(1).max(100).optional(),
  searchTerm: z12.preprocess(emptyToUndefined2, z12.string().optional()),
  sortBy: z12.enum(["createdAt", "updatedAt", "name", "phone"]).optional(),
  sortOrder: z12.enum(["asc", "desc"]).optional()
});

// src/modules/customers/customer.controller.ts
var createCustomer2 = async (req, res, next) => {
  try {
    const payload = createCustomerSchema.parse(req.body);
    const result = await createCustomer(req.user.id, req.user.role, payload);
    sendCreated(res, result, "Customer created successfully");
  } catch (error) {
    next(error);
  }
};
var getCustomers2 = async (req, res, next) => {
  try {
    const query = customerQuerySchema.parse(req.query);
    const { customers, meta } = await getCustomers(req.user.id, req.user.role, query);
    sendSuccess(res, customers, "Customers retrieved successfully", 200, meta);
  } catch (error) {
    next(error);
  }
};
var getCustomerById2 = async (req, res, next) => {
  try {
    const result = await getCustomerById(req.user.id, req.user.role, String(req.params.id));
    sendSuccess(res, result, "Customer retrieved successfully");
  } catch (error) {
    next(error);
  }
};
var updateCustomer2 = async (req, res, next) => {
  try {
    const payload = updateCustomerSchema.parse(req.body);
    const result = await updateCustomer(req.user.id, req.user.role, String(req.params.id), payload);
    sendSuccess(res, result, "Customer updated successfully");
  } catch (error) {
    next(error);
  }
};
var archiveCustomer2 = async (req, res, next) => {
  try {
    const result = await archiveCustomer(req.user.id, req.user.role, String(req.params.id));
    sendSuccess(res, result, "Customer archived successfully");
  } catch (error) {
    next(error);
  }
};

// src/modules/customers/customer.routes.ts
var router5 = Router12();
var requireSalesUser = [auth_middleware_default(UserRole.PHARMACY, UserRole.STAFF)];
router5.get("/", ...requireSalesUser, getCustomers2);
router5.post("/", ...requireSalesUser, createCustomer2);
router5.get("/:id", ...requireSalesUser, getCustomerById2);
router5.patch("/:id", ...requireSalesUser, updateCustomer2);
router5.delete("/:id", ...requireSalesUser, archiveCustomer2);
var customer_routes_default = router5;

// src/modules/invoices/invoice.routes.ts
import { Router as Router13 } from "express";

// src/modules/invoices/invoice.service.ts
var invoiceInclude = {
  customer: true,
  items: {
    include: {
      inventory: {
        include: {
          medicine: {
            include: {
              category: true,
              type: true,
              unit: true
            }
          }
        }
      },
      medicine: {
        include: {
          category: true,
          type: true,
          unit: true
        }
      }
    }
  },
  payments: {
    orderBy: { paymentDate: "desc" }
  }
};
var derivePaymentStatus2 = (totalAmount, totalPaid) => {
  if (totalPaid <= 0) return PaymentStatus.UNPAID;
  if (totalPaid >= totalAmount) return PaymentStatus.PAID;
  return PaymentStatus.PARTIAL;
};
var buildInvoiceAmounts = (data) => {
  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const vatAmount = data.items.reduce((sum, item) => sum + (item.vat ?? 0), 0);
  const discount = data.items.reduce((sum, item) => sum + (item.discount ?? 0), 0);
  const totalAmount = Math.max(0, subtotal + vatAmount - discount);
  const paidAmount = Math.min(data.paidAmount ?? 0, totalAmount);
  const dueAmount = Math.max(0, totalAmount - paidAmount);
  return {
    subtotal,
    vatAmount,
    discount,
    totalAmount,
    paidAmount,
    dueAmount,
    paymentStatus: derivePaymentStatus2(totalAmount, paidAmount)
  };
};
async function getInvoiceForPharmacy(userId, role, invoiceId) {
  const pharmacy = await getApprovedOperationalPharmacyForUser(userId, role);
  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      pharmacyId: pharmacy.id
    },
    include: invoiceInclude
  });
  if (!invoice) {
    throw new NotFoundError("Invoice not found.");
  }
  return { pharmacy, invoice };
}
async function createInvoice(userId, role, data) {
  const pharmacy = await getApprovedOperationalPharmacyForUser(userId, role, "canManageSales");
  const duplicateInvoice = await prisma.invoice.findUnique({
    where: {
      pharmacyId_invoiceNumber: {
        pharmacyId: pharmacy.id,
        invoiceNumber: data.invoiceNumber
      }
    }
  });
  if (duplicateInvoice) {
    throw new ConflictError("An invoice with this number already exists for your pharmacy.");
  }
  if (data.customerId) {
    const customer = await prisma.customer.findFirst({
      where: {
        id: data.customerId,
        pharmacyId: pharmacy.id,
        isDeleted: false
      }
    });
    if (!customer) {
      throw new NotFoundError("Customer not found.");
    }
  }
  const inventoryIds = data.items.map((item) => item.inventoryId);
  const inventoryItems = await prisma.pharmacyInventory.findMany({
    where: {
      id: { in: inventoryIds },
      pharmacyId: pharmacy.id,
      status: PharmacyInventoryStatus.ACTIVE,
      medicine: {
        isDeleted: false,
        status: MedicineStatus.ACTIVE
      }
    },
    include: { medicine: true }
  });
  const inventoryById = new Map(inventoryItems.map((item) => [item.id, item]));
  if (inventoryById.size !== inventoryIds.length) {
    throw new BadRequestError("One or more invoice items are invalid for this pharmacy.");
  }
  for (const item of data.items) {
    const inventory = inventoryById.get(item.inventoryId);
    if (!inventory || inventory.medicineId !== item.medicineId) {
      throw new BadRequestError("Invoice item medicine must match the selected inventory item.");
    }
    if (inventory.stockQuantity < item.quantity) {
      throw new BadRequestError(`Insufficient stock for ${inventory.medicine.name}. Available stock is ${inventory.stockQuantity}.`);
    }
  }
  const amounts = buildInvoiceAmounts(data);
  if ((data.paidAmount ?? 0) > amounts.totalAmount) {
    throw new BadRequestError("Initial payment cannot be greater than invoice total.");
  }
  return prisma.$transaction(async (tx) => {
    const invoice = await tx.invoice.create({
      data: {
        pharmacyId: pharmacy.id,
        customerId: data.customerId || null,
        invoiceNumber: data.invoiceNumber,
        saleDate: new Date(data.saleDate),
        subtotal: amounts.subtotal,
        vatAmount: amounts.vatAmount,
        discount: amounts.discount,
        totalAmount: amounts.totalAmount,
        netAmount: amounts.totalAmount,
        paidAmount: amounts.paidAmount,
        dueAmount: amounts.dueAmount,
        paymentStatus: amounts.paymentStatus,
        paymentMode: data.paymentMode ?? PaymentMode.CASH,
        status: amounts.paymentStatus === PaymentStatus.PAID ? InvoiceStatus.PAID : InvoiceStatus.ISSUED,
        note: data.note || null,
        createdByUserId: userId,
        items: {
          create: data.items.map((item) => ({
            inventory: { connect: { id: item.inventoryId } },
            medicine: { connect: { id: item.medicineId } },
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            vat: item.vat ?? 0,
            discount: item.discount ?? 0,
            total: Math.max(0, item.quantity * item.unitPrice + (item.vat ?? 0) - (item.discount ?? 0))
          }))
        }
      },
      include: invoiceInclude
    });
    for (const item of data.items) {
      await tx.pharmacyInventory.update({
        where: { id: item.inventoryId },
        data: {
          stockQuantity: { decrement: item.quantity }
        }
      });
    }
    if (amounts.paidAmount > 0) {
      await tx.payment.create({
        data: {
          invoiceId: invoice.id,
          pharmacyId: pharmacy.id,
          amount: amounts.paidAmount,
          paymentMode: data.paymentMode ?? PaymentMode.CASH,
          paymentDate: new Date(data.saleDate),
          note: data.paymentNote || null,
          receivedByUserId: userId
        }
      });
    }
    return tx.invoice.findUniqueOrThrow({
      where: { id: invoice.id },
      include: invoiceInclude
    });
  });
}
async function getInvoices(userId, role, query) {
  const pharmacy = await getApprovedOperationalPharmacyForUser(userId, role, "canManageSales");
  const {
    page = 1,
    limit = 10,
    searchTerm,
    paymentStatus,
    dateFrom,
    dateTo,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = query;
  const skip = (page - 1) * limit;
  const where = {
    pharmacyId: pharmacy.id
  };
  if (paymentStatus) where.paymentStatus = paymentStatus;
  if (dateFrom || dateTo) {
    where.saleDate = {};
    if (dateFrom) where.saleDate.gte = new Date(dateFrom);
    if (dateTo) where.saleDate.lte = new Date(dateTo);
  }
  if (searchTerm) {
    where.OR = [
      { invoiceNumber: { contains: searchTerm, mode: "insensitive" } },
      { customer: { name: { contains: searchTerm, mode: "insensitive" } } },
      { customer: { phone: { contains: searchTerm, mode: "insensitive" } } }
    ];
  }
  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        customer: true,
        items: true
      }
    }),
    prisma.invoice.count({ where })
  ]);
  return {
    invoices,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}
async function getInvoiceById(userId, role, invoiceId) {
  const { invoice } = await getInvoiceForPharmacy(userId, role, invoiceId);
  return invoice;
}
async function createPayment(userId, role, invoiceId, data) {
  if (role === UserRole.STAFF) {
    await getApprovedOperationalPharmacyForUser(userId, role, "canManageSales");
  }
  const { pharmacy, invoice } = await getInvoiceForPharmacy(userId, role, invoiceId);
  if (invoice.paymentStatus === PaymentStatus.CANCELLED || invoice.status === InvoiceStatus.CANCELLED) {
    throw new BadRequestError("Cancelled invoices cannot receive payments.");
  }
  const dueAmount = Number(invoice.dueAmount);
  if (data.amount > dueAmount) {
    throw new BadRequestError("Payment amount cannot be greater than current due amount.");
  }
  return prisma.$transaction(async (tx) => {
    await tx.payment.create({
      data: {
        invoiceId: invoice.id,
        pharmacyId: pharmacy.id,
        amount: data.amount,
        paymentMode: data.paymentMode,
        paymentDate: new Date(data.paymentDate),
        note: data.note || null,
        receivedByUserId: userId
      }
    });
    const paymentAggregate = await tx.payment.aggregate({
      where: { invoiceId: invoice.id },
      _sum: { amount: true }
    });
    const totalAmount = Number(invoice.totalAmount);
    const totalPaid = Number(paymentAggregate._sum.amount || 0);
    const nextDueAmount = Math.max(0, totalAmount - totalPaid);
    const nextPaymentStatus = derivePaymentStatus2(totalAmount, totalPaid);
    return tx.invoice.update({
      where: { id: invoice.id },
      data: {
        paidAmount: totalPaid,
        dueAmount: nextDueAmount,
        paymentStatus: nextPaymentStatus,
        status: nextPaymentStatus === PaymentStatus.PAID ? InvoiceStatus.PAID : InvoiceStatus.ISSUED,
        paymentMode: data.paymentMode
      },
      include: invoiceInclude
    });
  });
}
async function getInvoicePayments(userId, role, invoiceId) {
  const { invoice } = await getInvoiceForPharmacy(userId, role, invoiceId);
  const payments = await prisma.payment.findMany({
    where: { invoiceId: invoice.id },
    orderBy: { paymentDate: "desc" }
  });
  const totalPaid = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  return {
    payments,
    summary: {
      totalAmount: Number(invoice.totalAmount),
      totalPaid,
      dueAmount: Math.max(0, Number(invoice.totalAmount) - totalPaid),
      paymentStatus: derivePaymentStatus2(Number(invoice.totalAmount), totalPaid)
    }
  };
}
async function cancelInvoice(userId, role, invoiceId) {
  const { invoice } = await getInvoiceForPharmacy(userId, role, invoiceId);
  if (invoice.status === InvoiceStatus.CANCELLED) {
    return invoice;
  }
  if (Number(invoice.paidAmount) > 0) {
    throw new BadRequestError("Invoices with payments cannot be cancelled.");
  }
  return prisma.$transaction(async (tx) => {
    for (const item of invoice.items) {
      if (!item.inventoryId) {
        throw new BadRequestError("Invoice item is missing an inventory reference.");
      }
      await tx.pharmacyInventory.update({
        where: { id: item.inventoryId },
        data: {
          stockQuantity: { increment: item.quantity }
        }
      });
    }
    return tx.invoice.update({
      where: { id: invoice.id },
      data: {
        status: InvoiceStatus.CANCELLED,
        paymentStatus: PaymentStatus.CANCELLED
      },
      include: invoiceInclude
    });
  });
}

// src/modules/invoices/invoice.validation.ts
import { z as z13 } from "zod";
var emptyToUndefined3 = (value) => value === "" ? void 0 : value;
var paymentStatusEnum2 = z13.enum([
  PAYMENT_STATUS.UNPAID,
  PAYMENT_STATUS.PARTIAL,
  PAYMENT_STATUS.PAID,
  PAYMENT_STATUS.CANCELLED
]);
var paymentModeEnum = z13.enum([
  PAYMENT_MODE.CASH,
  PAYMENT_MODE.CARD,
  PAYMENT_MODE.MOBILE_BANKING,
  PAYMENT_MODE.BANK_TRANSFER
]);
var invoiceItemSchema = z13.object({
  inventoryId: z13.string().min(1, "Inventory item is required"),
  medicineId: z13.string().min(1, "Medicine is required"),
  quantity: z13.coerce.number().int().min(1, "Quantity must be at least 1"),
  unitPrice: z13.coerce.number().min(0, "Unit price must be zero or more"),
  vat: z13.coerce.number().min(0, "VAT must be zero or more").optional(),
  discount: z13.coerce.number().min(0, "Discount must be zero or more").optional()
});
var createInvoiceSchema = z13.object({
  customerId: z13.preprocess(emptyToUndefined3, z13.string().optional()),
  invoiceNumber: z13.string().trim().min(1, "Invoice number is required"),
  saleDate: z13.string().min(1, "Sale date is required"),
  note: z13.string().trim().optional(),
  paidAmount: z13.coerce.number().min(0, "Paid amount must be zero or more").optional(),
  paymentMode: paymentModeEnum.optional(),
  paymentNote: z13.string().trim().optional(),
  items: z13.array(invoiceItemSchema).min(1, "Add at least one invoice item")
}).superRefine((data, ctx) => {
  if ((data.paidAmount ?? 0) > 0 && !data.paymentMode) {
    ctx.addIssue({
      code: "custom",
      message: "Payment mode is required when recording an initial payment",
      path: ["paymentMode"]
    });
  }
});
var invoiceQuerySchema = z13.object({
  page: z13.coerce.number().int().min(1).optional(),
  limit: z13.coerce.number().int().min(1).max(100).optional(),
  searchTerm: z13.preprocess(emptyToUndefined3, z13.string().optional()),
  paymentStatus: z13.preprocess(emptyToUndefined3, paymentStatusEnum2.optional()),
  dateFrom: z13.preprocess(emptyToUndefined3, z13.string().optional()),
  dateTo: z13.preprocess(emptyToUndefined3, z13.string().optional()),
  sortBy: z13.enum(["createdAt", "saleDate", "invoiceNumber", "totalAmount", "paidAmount", "dueAmount"]).optional(),
  sortOrder: z13.enum(["asc", "desc"]).optional()
});
var createPaymentSchema = z13.object({
  amount: z13.coerce.number().min(0.01, "Payment amount must be greater than zero"),
  paymentMode: paymentModeEnum,
  paymentDate: z13.string().min(1, "Payment date is required"),
  note: z13.string().trim().optional()
});

// src/modules/invoices/invoice.controller.ts
var createInvoice2 = async (req, res, next) => {
  try {
    const payload = createInvoiceSchema.parse(req.body);
    const result = await createInvoice(req.user.id, req.user.role, payload);
    sendCreated(res, result, "Invoice created successfully");
  } catch (error) {
    next(error);
  }
};
var getInvoices2 = async (req, res, next) => {
  try {
    const query = invoiceQuerySchema.parse(req.query);
    const { invoices, meta } = await getInvoices(req.user.id, req.user.role, query);
    sendSuccess(res, invoices, "Invoices retrieved successfully", 200, meta);
  } catch (error) {
    next(error);
  }
};
var getInvoiceById2 = async (req, res, next) => {
  try {
    const result = await getInvoiceById(req.user.id, req.user.role, String(req.params.id));
    sendSuccess(res, result, "Invoice retrieved successfully");
  } catch (error) {
    next(error);
  }
};
var createPayment2 = async (req, res, next) => {
  try {
    const payload = createPaymentSchema.parse(req.body);
    const result = await createPayment(req.user.id, req.user.role, String(req.params.id), payload);
    sendCreated(res, result, "Payment recorded successfully");
  } catch (error) {
    next(error);
  }
};
var getInvoicePayments2 = async (req, res, next) => {
  try {
    const { payments, summary } = await getInvoicePayments(req.user.id, req.user.role, String(req.params.id));
    sendSuccess(res, { payments, summary }, "Payments retrieved successfully");
  } catch (error) {
    next(error);
  }
};
var cancelInvoice2 = async (req, res, next) => {
  try {
    const result = await cancelInvoice(req.user.id, req.user.role, String(req.params.id));
    sendSuccess(res, result, "Invoice cancelled successfully");
  } catch (error) {
    next(error);
  }
};

// src/modules/invoices/invoice.routes.ts
var router6 = Router13();
var requireSalesUser2 = [auth_middleware_default(UserRole.PHARMACY, UserRole.STAFF)];
router6.get("/", ...requireSalesUser2, getInvoices2);
router6.post("/", ...requireSalesUser2, createInvoice2);
router6.get("/:id", ...requireSalesUser2, getInvoiceById2);
router6.patch("/:id/cancel", ...requireSalesUser2, cancelInvoice2);
router6.get("/:id/payments", ...requireSalesUser2, getInvoicePayments2);
router6.post("/:id/payments", ...requireSalesUser2, createPayment2);
var invoice_routes_default = router6;

// src/modules/analytics/analytics.routes.ts
import { Router as Router14 } from "express";

// src/modules/analytics/analytics.service.ts
var EXPIRING_SOON_DAYS2 = 30;
var toNumber = (value) => Number(value || 0);
var getDateRange = (query, field) => {
  if (!query.dateFrom && !query.dateTo) return {};
  const range = {};
  if (query.dateFrom) range.gte = new Date(query.dateFrom);
  if (query.dateTo) {
    const end = new Date(query.dateTo);
    end.setHours(23, 59, 59, 999);
    range.lte = end;
  }
  return { [field]: range };
};
var monthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
var makeMonthlyMap = (dateFrom, dateTo) => {
  const now = /* @__PURE__ */ new Date();
  const start = dateFrom ? new Date(dateFrom) : new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const end = dateTo ? new Date(dateTo) : now;
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
  const result = /* @__PURE__ */ new Map();
  while (cursor <= end) {
    result.set(monthKey(cursor), 0);
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return result;
};
async function getAdminOverview(query) {
  const [pharmacyStatus, totalUsers, totalMedicines, totalCategories, totalSuppliers, totalMedicineRequests, requestStatus, recentPharmacies] = await Promise.all([
    prisma.pharmacy.groupBy({ by: ["status"], _count: { id: true } }),
    prisma.user.count({ where: { isDeleted: false } }),
    prisma.medicine.count({ where: { isDeleted: false } }),
    prisma.category.count({ where: { isDeleted: false } }),
    prisma.supplier.count({ where: { isDeleted: false } }),
    prisma.medicineRequest.count(),
    prisma.medicineRequest.groupBy({ by: ["status"], _count: { id: true } }),
    prisma.pharmacy.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { owner: true }
    })
  ]);
  const statusCount = (status) => pharmacyStatus.find((item) => item.status === status)?._count.id ?? 0;
  const salesWhere = getDateRange(query, "saleDate");
  const purchaseWhere = getDateRange(query, "purchaseDate");
  const [invoiceAggregate, purchaseAggregate] = await Promise.all([
    prisma.invoice.aggregate({
      where: salesWhere,
      _sum: { totalAmount: true, paidAmount: true, dueAmount: true }
    }),
    prisma.purchase.aggregate({
      where: purchaseWhere,
      _sum: { totalAmount: true }
    })
  ]);
  return {
    totals: {
      pharmacies: pharmacyStatus.reduce((sum, item) => sum + item._count.id, 0),
      pendingPharmacies: statusCount(PharmacyStatus.PENDING),
      approvedPharmacies: statusCount(PharmacyStatus.APPROVED),
      rejectedPharmacies: statusCount(PharmacyStatus.REJECTED),
      users: totalUsers,
      medicines: totalMedicines,
      categories: totalCategories,
      suppliers: totalSuppliers,
      medicineRequests: totalMedicineRequests,
      platformSales: toNumber(invoiceAggregate._sum.totalAmount),
      platformPaid: toNumber(invoiceAggregate._sum.paidAmount),
      platformDue: toNumber(invoiceAggregate._sum.dueAmount),
      platformPurchases: toNumber(purchaseAggregate._sum.totalAmount)
    },
    pharmacyStatus: pharmacyStatus.map((item) => ({ status: item.status, count: item._count.id })),
    medicineRequestStatus: requestStatus.map((item) => ({ status: item.status, count: item._count.id })),
    recentPharmacies
  };
}
async function getAdminPharmacyAnalytics() {
  const status = await prisma.pharmacy.groupBy({ by: ["status"], _count: { id: true } });
  const recent = await prisma.pharmacy.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
    include: { owner: true }
  });
  return { status: status.map((item) => ({ status: item.status, count: item._count.id })), recent };
}
async function getAdminMedicineAnalytics() {
  const [totalMedicines, totalCategories, totalSuppliers, requestStatus] = await Promise.all([
    prisma.medicine.count({ where: { isDeleted: false } }),
    prisma.category.count({ where: { isDeleted: false } }),
    prisma.supplier.count({ where: { isDeleted: false } }),
    prisma.medicineRequest.groupBy({ by: ["status"], _count: { id: true } })
  ]);
  return {
    totalMedicines,
    totalCategories,
    totalSuppliers,
    medicineRequestStatus: requestStatus.map((item) => ({ status: item.status, count: item._count.id }))
  };
}
async function getAdminSalesSummary(query) {
  const [invoiceAggregate, paymentAggregate, purchaseAggregate] = await Promise.all([
    prisma.invoice.aggregate({
      where: getDateRange(query, "saleDate"),
      _sum: { totalAmount: true, paidAmount: true, dueAmount: true },
      _count: { id: true }
    }),
    prisma.payment.aggregate({
      where: getDateRange(query, "paymentDate"),
      _sum: { amount: true },
      _count: { id: true }
    }),
    prisma.purchase.aggregate({
      where: getDateRange(query, "purchaseDate"),
      _sum: { totalAmount: true },
      _count: { id: true }
    })
  ]);
  return {
    invoiceCount: invoiceAggregate._count.id,
    paymentCount: paymentAggregate._count.id,
    purchaseCount: purchaseAggregate._count.id,
    totalSales: toNumber(invoiceAggregate._sum.totalAmount),
    totalPaid: toNumber(invoiceAggregate._sum.paidAmount),
    totalDue: toNumber(invoiceAggregate._sum.dueAmount),
    totalCollected: toNumber(paymentAggregate._sum.amount),
    totalPurchases: toNumber(purchaseAggregate._sum.totalAmount)
  };
}
async function getPharmacyOverview(userId, role, query) {
  const pharmacy = await getApprovedOperationalPharmacyForUser(userId, role);
  const now = /* @__PURE__ */ new Date();
  const expiringUntil = new Date(now);
  expiringUntil.setDate(now.getDate() + EXPIRING_SOON_DAYS2);
  const invoiceWhere = { pharmacyId: pharmacy.id, ...getDateRange(query, "saleDate") };
  const paymentWhere = { pharmacyId: pharmacy.id, ...getDateRange(query, "paymentDate") };
  const purchaseWhere = { pharmacyId: pharmacy.id, ...getDateRange(query, "purchaseDate") };
  const [
    totalInventoryItems,
    lowStockItems,
    expiringSoonItems,
    totalCustomers,
    totalPurchases,
    purchaseAggregate,
    totalInvoices,
    invoiceAggregate,
    paymentAggregate,
    invoiceStatus,
    recentInvoices,
    recentPayments,
    recentPurchases
  ] = await Promise.all([
    prisma.pharmacyInventory.count({ where: { pharmacyId: pharmacy.id, status: { not: PharmacyInventoryStatus.ARCHIVED } } }),
    prisma.pharmacyInventory.count({
      where: {
        pharmacyId: pharmacy.id,
        status: { not: PharmacyInventoryStatus.ARCHIVED },
        stockQuantity: { lte: prisma.pharmacyInventory.fields.lowStockAlertQuantity }
      }
    }),
    prisma.pharmacyInventory.count({
      where: {
        pharmacyId: pharmacy.id,
        status: { not: PharmacyInventoryStatus.ARCHIVED },
        expiryDate: { gte: now, lte: expiringUntil }
      }
    }),
    prisma.customer.count({ where: { pharmacyId: pharmacy.id, isDeleted: false } }),
    prisma.purchase.count({ where: purchaseWhere }),
    prisma.purchase.aggregate({ where: purchaseWhere, _sum: { totalAmount: true } }),
    prisma.invoice.count({ where: invoiceWhere }),
    prisma.invoice.aggregate({ where: invoiceWhere, _sum: { totalAmount: true, paidAmount: true, dueAmount: true } }),
    prisma.payment.aggregate({ where: paymentWhere, _sum: { amount: true }, _count: { id: true } }),
    prisma.invoice.groupBy({ by: ["paymentStatus"], where: invoiceWhere, _count: { id: true } }),
    prisma.invoice.findMany({ where: { pharmacyId: pharmacy.id }, take: 6, orderBy: { saleDate: "desc" }, include: { customer: true } }),
    prisma.payment.findMany({ where: { pharmacyId: pharmacy.id }, take: 6, orderBy: { paymentDate: "desc" }, include: { invoice: true } }),
    prisma.purchase.findMany({ where: { pharmacyId: pharmacy.id }, take: 6, orderBy: { purchaseDate: "desc" }, include: { supplier: true } })
  ]);
  const statusCount = (status) => invoiceStatus.find((item) => item.paymentStatus === status)?._count.id ?? 0;
  return {
    pharmacy,
    totals: {
      inventoryItems: totalInventoryItems,
      lowStockItems,
      expiringSoonItems,
      customers: totalCustomers,
      purchases: totalPurchases,
      purchaseAmount: toNumber(purchaseAggregate._sum.totalAmount),
      invoices: totalInvoices,
      salesAmount: toNumber(invoiceAggregate._sum.totalAmount),
      paidAmount: toNumber(invoiceAggregate._sum.paidAmount),
      dueAmount: toNumber(invoiceAggregate._sum.dueAmount),
      collectedAmount: toNumber(paymentAggregate._sum.amount),
      paymentCount: paymentAggregate._count.id,
      unpaidInvoices: statusCount(PaymentStatus.UNPAID),
      partialInvoices: statusCount(PaymentStatus.PARTIAL),
      paidInvoices: statusCount(PaymentStatus.PAID)
    },
    invoiceStatus: invoiceStatus.map((item) => ({ status: item.paymentStatus, count: item._count.id })),
    recentInvoices,
    recentPayments,
    recentPurchases
  };
}
async function getPharmacySalesAnalytics(userId, role, query) {
  const pharmacy = await getApprovedOperationalPharmacyForUser(userId, role);
  const monthlySales = makeMonthlyMap(query.dateFrom, query.dateTo);
  const monthlyPayments = makeMonthlyMap(query.dateFrom, query.dateTo);
  const [invoices, payments, topItems] = await Promise.all([
    prisma.invoice.findMany({
      where: { pharmacyId: pharmacy.id, ...getDateRange(query, "saleDate") },
      select: { saleDate: true, totalAmount: true }
    }),
    prisma.payment.findMany({
      where: { pharmacyId: pharmacy.id, ...getDateRange(query, "paymentDate") },
      select: { paymentDate: true, amount: true }
    }),
    prisma.invoiceItem.groupBy({
      by: ["medicineId"],
      where: {
        invoice: {
          pharmacyId: pharmacy.id,
          ...getDateRange(query, "saleDate")
        }
      },
      _sum: { quantity: true, total: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 8
    })
  ]);
  for (const invoice of invoices) {
    const key = monthKey(invoice.saleDate);
    monthlySales.set(key, (monthlySales.get(key) ?? 0) + toNumber(invoice.totalAmount));
  }
  for (const payment of payments) {
    const key = monthKey(payment.paymentDate);
    monthlyPayments.set(key, (monthlyPayments.get(key) ?? 0) + toNumber(payment.amount));
  }
  const medicineIds = topItems.map((item) => item.medicineId);
  const medicines = await prisma.medicine.findMany({
    where: { id: { in: medicineIds } },
    select: { id: true, name: true, genericName: true, strength: true }
  });
  const medicineById = new Map(medicines.map((medicine) => [medicine.id, medicine]));
  return {
    monthlySales: Array.from(monthlySales.entries()).map(([month, amount]) => ({ month, amount })),
    monthlyPayments: Array.from(monthlyPayments.entries()).map(([month, amount]) => ({ month, amount })),
    topSellingMedicines: topItems.map((item) => ({
      medicine: medicineById.get(item.medicineId),
      quantity: item._sum.quantity ?? 0,
      total: toNumber(item._sum.total)
    }))
  };
}
async function getPharmacyPurchaseAnalytics(userId, role, query) {
  const pharmacy = await getApprovedOperationalPharmacyForUser(userId, role);
  const monthlyPurchases = makeMonthlyMap(query.dateFrom, query.dateTo);
  const purchases = await prisma.purchase.findMany({
    where: { pharmacyId: pharmacy.id, ...getDateRange(query, "purchaseDate") },
    select: { purchaseDate: true, totalAmount: true }
  });
  for (const purchase of purchases) {
    const key = monthKey(purchase.purchaseDate);
    monthlyPurchases.set(key, (monthlyPurchases.get(key) ?? 0) + toNumber(purchase.totalAmount));
  }
  const aggregate = await prisma.purchase.aggregate({
    where: { pharmacyId: pharmacy.id, ...getDateRange(query, "purchaseDate") },
    _sum: { totalAmount: true },
    _count: { id: true }
  });
  return {
    totalPurchases: aggregate._count.id,
    totalPurchaseAmount: toNumber(aggregate._sum.totalAmount),
    monthlyPurchases: Array.from(monthlyPurchases.entries()).map(([month, amount]) => ({ month, amount }))
  };
}
async function getPharmacyInventoryAnalytics(userId, role) {
  const pharmacy = await getApprovedOperationalPharmacyForUser(userId, role);
  const now = /* @__PURE__ */ new Date();
  const expiringUntil = new Date(now);
  expiringUntil.setDate(now.getDate() + EXPIRING_SOON_DAYS2);
  const [lowStockItems, expiringSoonItems] = await Promise.all([
    prisma.pharmacyInventory.findMany({
      where: {
        pharmacyId: pharmacy.id,
        status: { not: PharmacyInventoryStatus.ARCHIVED },
        stockQuantity: { lte: prisma.pharmacyInventory.fields.lowStockAlertQuantity }
      },
      take: 10,
      orderBy: { stockQuantity: "asc" },
      include: { medicine: true }
    }),
    prisma.pharmacyInventory.findMany({
      where: {
        pharmacyId: pharmacy.id,
        status: { not: PharmacyInventoryStatus.ARCHIVED },
        expiryDate: { gte: now, lte: expiringUntil }
      },
      take: 10,
      orderBy: { expiryDate: "asc" },
      include: { medicine: true }
    })
  ]);
  return { lowStockItems, expiringSoonItems };
}
async function getPharmacyPaymentAnalytics(userId, role, query) {
  const pharmacy = await getApprovedOperationalPharmacyForUser(userId, role);
  const payments = await prisma.payment.findMany({
    where: { pharmacyId: pharmacy.id, ...getDateRange(query, "paymentDate") },
    orderBy: { paymentDate: "desc" },
    include: { invoice: true }
  });
  const aggregate = await prisma.payment.aggregate({
    where: { pharmacyId: pharmacy.id, ...getDateRange(query, "paymentDate") },
    _sum: { amount: true },
    _count: { id: true }
  });
  return {
    totalCollected: toNumber(aggregate._sum.amount),
    paymentCount: aggregate._count.id,
    payments
  };
}

// src/modules/analytics/analytics.validation.ts
import { z as z14 } from "zod";
var emptyToUndefined4 = (value) => value === "" ? void 0 : value;
var analyticsQuerySchema = z14.object({
  dateFrom: z14.preprocess(emptyToUndefined4, z14.string().optional()),
  dateTo: z14.preprocess(emptyToUndefined4, z14.string().optional())
});

// src/modules/analytics/analytics.controller.ts
var getAdminOverview2 = async (req, res, next) => {
  try {
    const query = analyticsQuerySchema.parse(req.query);
    const result = await getAdminOverview(query);
    sendSuccess(res, result, "Admin analytics retrieved successfully");
  } catch (error) {
    next(error);
  }
};
var getAdminPharmacies = async (_req, res, next) => {
  try {
    const result = await getAdminPharmacyAnalytics();
    sendSuccess(res, result, "Pharmacy analytics retrieved successfully");
  } catch (error) {
    next(error);
  }
};
var getAdminMedicines = async (_req, res, next) => {
  try {
    const result = await getAdminMedicineAnalytics();
    sendSuccess(res, result, "Medicine analytics retrieved successfully");
  } catch (error) {
    next(error);
  }
};
var getAdminSalesSummary2 = async (req, res, next) => {
  try {
    const query = analyticsQuerySchema.parse(req.query);
    const result = await getAdminSalesSummary(query);
    sendSuccess(res, result, "Platform sales summary retrieved successfully");
  } catch (error) {
    next(error);
  }
};
var getPharmacyOverview2 = async (req, res, next) => {
  try {
    const query = analyticsQuerySchema.parse(req.query);
    const result = await getPharmacyOverview(req.user.id, req.user.role, query);
    sendSuccess(res, result, "Pharmacy analytics retrieved successfully");
  } catch (error) {
    next(error);
  }
};
var getPharmacySales = async (req, res, next) => {
  try {
    const query = analyticsQuerySchema.parse(req.query);
    const result = await getPharmacySalesAnalytics(req.user.id, req.user.role, query);
    sendSuccess(res, result, "Sales analytics retrieved successfully");
  } catch (error) {
    next(error);
  }
};
var getPharmacyPurchases = async (req, res, next) => {
  try {
    const query = analyticsQuerySchema.parse(req.query);
    const result = await getPharmacyPurchaseAnalytics(req.user.id, req.user.role, query);
    sendSuccess(res, result, "Purchase analytics retrieved successfully");
  } catch (error) {
    next(error);
  }
};
var getPharmacyInventory = async (req, res, next) => {
  try {
    const result = await getPharmacyInventoryAnalytics(req.user.id, req.user.role);
    sendSuccess(res, result, "Inventory analytics retrieved successfully");
  } catch (error) {
    next(error);
  }
};
var getPharmacyPayments = async (req, res, next) => {
  try {
    const query = analyticsQuerySchema.parse(req.query);
    const result = await getPharmacyPaymentAnalytics(req.user.id, req.user.role, query);
    sendSuccess(res, result, "Payment analytics retrieved successfully");
  } catch (error) {
    next(error);
  }
};

// src/modules/analytics/analytics.routes.ts
var adminAnalyticsRoutes = Router14();
adminAnalyticsRoutes.get("/overview", auth_middleware_default(UserRole.ADMIN), getAdminOverview2);
adminAnalyticsRoutes.get("/pharmacies", auth_middleware_default(UserRole.ADMIN), getAdminPharmacies);
adminAnalyticsRoutes.get("/medicines", auth_middleware_default(UserRole.ADMIN), getAdminMedicines);
adminAnalyticsRoutes.get("/sales-summary", auth_middleware_default(UserRole.ADMIN), getAdminSalesSummary2);
var pharmacyAnalyticsRoutes = Router14();
var requirePharmacyAnalytics = [auth_middleware_default(UserRole.PHARMACY, UserRole.STAFF)];
pharmacyAnalyticsRoutes.get("/overview", ...requirePharmacyAnalytics, getPharmacyOverview2);
pharmacyAnalyticsRoutes.get("/sales", ...requirePharmacyAnalytics, getPharmacySales);
pharmacyAnalyticsRoutes.get("/purchases", ...requirePharmacyAnalytics, getPharmacyPurchases);
pharmacyAnalyticsRoutes.get("/inventory", ...requirePharmacyAnalytics, getPharmacyInventory);
pharmacyAnalyticsRoutes.get("/payments", ...requirePharmacyAnalytics, getPharmacyPayments);

// src/modules/staff/staff.routes.ts
import { Router as Router15 } from "express";

// src/modules/staff/staff.service.ts
var staffInclude = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true,
      status: true,
      createdAt: true,
      updatedAt: true
    }
  }
};
async function getApprovedOwnerPharmacy(ownerId) {
  const pharmacy = await prisma.pharmacy.findUnique({
    where: { ownerId }
  });
  if (!pharmacy) {
    throw new ForbiddenError("Create a pharmacy profile before managing staff.");
  }
  if (pharmacy.status !== PharmacyStatus.APPROVED) {
    throw new ForbiddenError("Your pharmacy must be approved before managing staff.");
  }
  return pharmacy;
}
async function createStaff(ownerId, data) {
  const pharmacy = await getApprovedOwnerPharmacy(ownerId);
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
    include: { staffProfile: true }
  });
  if (existingUser) {
    throw new ConflictError("A user with this email already exists.");
  }
  const signUpResult = await auth.api.signUpEmail({
    body: {
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone
    },
    headers: new Headers({
      "x-intended-role": UserRole.STAFF
    })
  });
  const userId = signUpResult.user?.id;
  if (!userId) {
    throw new BadRequestError("Unable to create staff account.");
  }
  return prisma.staff.create({
    data: {
      userId,
      pharmacyId: pharmacy.id,
      canManageInventory: data.canManageInventory ?? false,
      canManageSales: data.canManageSales ?? true,
      canManageCustomers: data.canManageCustomers ?? true,
      canViewReports: data.canViewReports ?? false,
      canManagePurchases: data.canManagePurchases ?? false
    },
    include: staffInclude
  });
}
async function getStaffList(ownerId, query) {
  const pharmacy = await getApprovedOwnerPharmacy(ownerId);
  const { page = 1, limit = 10, searchTerm, isActive } = query;
  const skip = (page - 1) * limit;
  const where = {
    pharmacyId: pharmacy.id,
    isDeleted: false
  };
  if (isActive !== void 0) where.isActive = isActive;
  if (searchTerm) {
    where.user = {
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { email: { contains: searchTerm, mode: "insensitive" } },
        { phone: { contains: searchTerm, mode: "insensitive" } }
      ]
    };
  }
  const [staff, total] = await Promise.all([
    prisma.staff.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: staffInclude
    }),
    prisma.staff.count({ where })
  ]);
  return {
    staff,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}
async function getOwnedStaff(ownerId, staffId) {
  const pharmacy = await getApprovedOwnerPharmacy(ownerId);
  const staff = await prisma.staff.findFirst({
    where: {
      id: staffId,
      pharmacyId: pharmacy.id,
      isDeleted: false
    },
    include: staffInclude
  });
  if (!staff) {
    throw new NotFoundError("Staff member not found.");
  }
  return staff;
}
async function getStaffById(ownerId, staffId) {
  return getOwnedStaff(ownerId, staffId);
}
async function updateStaff(ownerId, staffId, data) {
  const staff = await getOwnedStaff(ownerId, staffId);
  await prisma.user.update({
    where: { id: staff.userId },
    data: {
      ...data.name !== void 0 ? { name: data.name } : {},
      ...data.phone !== void 0 ? { phone: data.phone || null } : {},
      ...data.isActive !== void 0 ? { status: data.isActive ? UserAccountStatus.ACTIVE : UserAccountStatus.SUSPENDED } : {}
    }
  });
  return prisma.staff.update({
    where: { id: staffId },
    data: {
      ...data.canManageInventory !== void 0 ? { canManageInventory: data.canManageInventory } : {},
      ...data.canManageSales !== void 0 ? { canManageSales: data.canManageSales } : {},
      ...data.canManageCustomers !== void 0 ? { canManageCustomers: data.canManageCustomers } : {},
      ...data.canViewReports !== void 0 ? { canViewReports: data.canViewReports } : {},
      ...data.canManagePurchases !== void 0 ? { canManagePurchases: data.canManagePurchases } : {},
      ...data.isActive !== void 0 ? { isActive: data.isActive } : {}
    },
    include: staffInclude
  });
}
async function archiveStaff(ownerId, staffId) {
  const staff = await getOwnedStaff(ownerId, staffId);
  await prisma.user.update({
    where: { id: staff.userId },
    data: {
      status: UserAccountStatus.SUSPENDED
    }
  });
  return prisma.staff.update({
    where: { id: staffId },
    data: {
      isActive: false,
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date()
    },
    include: staffInclude
  });
}
async function getMyStaffProfile(userId) {
  const staff = await prisma.staff.findUnique({
    where: { userId },
    include: {
      ...staffInclude,
      pharmacy: true
    }
  });
  if (!staff || staff.isDeleted) {
    throw new NotFoundError("Staff profile not found.");
  }
  return staff;
}

// src/modules/staff/staff.validation.ts
import { z as z15 } from "zod";
var permissionSchema = {
  canManageInventory: z15.coerce.boolean().optional(),
  canManageSales: z15.coerce.boolean().optional(),
  canManageCustomers: z15.coerce.boolean().optional(),
  canViewReports: z15.coerce.boolean().optional(),
  canManagePurchases: z15.coerce.boolean().optional()
};
var createStaffSchema = z15.object({
  name: z15.string().trim().min(1, "Name is required"),
  email: z15.string().trim().email("Valid email is required"),
  password: z15.string().min(6, "Password must be at least 6 characters"),
  phone: z15.string().trim().optional(),
  ...permissionSchema
});
var updateStaffSchema = z15.object({
  name: z15.string().trim().min(1).optional(),
  phone: z15.string().trim().optional(),
  isActive: z15.coerce.boolean().optional(),
  ...permissionSchema
});
var staffQuerySchema = z15.object({
  page: z15.coerce.number().int().min(1).optional(),
  limit: z15.coerce.number().int().min(1).max(100).optional(),
  searchTerm: z15.string().optional(),
  isActive: z15.coerce.boolean().optional()
});

// src/modules/staff/staff.controller.ts
var createStaff2 = async (req, res, next) => {
  try {
    const payload = createStaffSchema.parse(req.body);
    const result = await createStaff(req.user.id, payload);
    sendCreated(res, result, "Staff account created successfully");
  } catch (error) {
    next(error);
  }
};
var getStaffList2 = async (req, res, next) => {
  try {
    const query = staffQuerySchema.parse(req.query);
    const { staff, meta } = await getStaffList(req.user.id, query);
    sendSuccess(res, staff, "Staff retrieved successfully", 200, meta);
  } catch (error) {
    next(error);
  }
};
var getStaffById2 = async (req, res, next) => {
  try {
    const result = await getStaffById(req.user.id, String(req.params.id));
    sendSuccess(res, result, "Staff retrieved successfully");
  } catch (error) {
    next(error);
  }
};
var updateStaff2 = async (req, res, next) => {
  try {
    const payload = updateStaffSchema.parse(req.body);
    const result = await updateStaff(req.user.id, String(req.params.id), payload);
    sendSuccess(res, result, "Staff updated successfully");
  } catch (error) {
    next(error);
  }
};
var archiveStaff2 = async (req, res, next) => {
  try {
    const result = await archiveStaff(req.user.id, String(req.params.id));
    sendSuccess(res, result, "Staff deactivated successfully");
  } catch (error) {
    next(error);
  }
};
var getMyStaffProfile2 = async (req, res, next) => {
  try {
    const result = await getMyStaffProfile(req.user.id);
    sendSuccess(res, result, "Staff profile retrieved successfully");
  } catch (error) {
    next(error);
  }
};

// src/modules/staff/staff.routes.ts
var router7 = Router15();
router7.get("/me", auth_middleware_default(UserRole.STAFF), getMyStaffProfile2);
router7.get("/", auth_middleware_default(UserRole.PHARMACY), getStaffList2);
router7.post("/", auth_middleware_default(UserRole.PHARMACY), createStaff2);
router7.get("/:id", auth_middleware_default(UserRole.PHARMACY), getStaffById2);
router7.patch("/:id", auth_middleware_default(UserRole.PHARMACY), updateStaff2);
router7.delete("/:id", auth_middleware_default(UserRole.PHARMACY), archiveStaff2);
var staff_routes_default = router7;

// src/modules/public-discovery/public-discovery.routes.ts
import { Router as Router16 } from "express";

// src/modules/public-discovery/public-discovery.service.ts
var toNumber2 = (value) => value === null || value === void 0 ? null : Number(value);
var publicInventoryWhere = {
  status: PharmacyInventoryStatus.ACTIVE,
  stockQuantity: { gt: 0 },
  pharmacy: {
    status: PharmacyStatus.APPROVED
  }
};
var medicineCardSelect = {
  id: true,
  name: true,
  genericName: true,
  strength: true,
  image: true,
  description: true,
  createdAt: true,
  category: { select: { id: true, name: true, slug: true } },
  type: { select: { id: true, name: true } },
  unit: { select: { id: true, name: true, symbol: true } },
  inventory: {
    where: publicInventoryWhere,
    select: {
      pharmacyId: true,
      stockQuantity: true,
      sellingPrice: true,
      pharmacy: {
        select: {
          id: true,
          name: true,
          address: true,
          phone: true,
          logo: true
        }
      }
    }
  }
};
var pharmacyPublicSelect = {
  id: true,
  name: true,
  pharmacyType: true,
  establishedYear: true,
  openingHours: true,
  website: true,
  phone: true,
  address: true,
  logo: true,
  createdAt: true
};
function summarizeMedicine(medicine) {
  const prices = medicine.inventory.map((item) => Number(item.sellingPrice));
  const pharmacyIds = new Set(medicine.inventory.map((item) => item.pharmacyId));
  const totalStock = medicine.inventory.reduce(
    (sum, item) => sum + item.stockQuantity,
    0
  );
  return {
    id: medicine.id,
    name: medicine.name,
    genericName: medicine.genericName,
    strength: medicine.strength,
    image: medicine.image,
    description: medicine.description,
    createdAt: medicine.createdAt,
    category: medicine.category,
    type: medicine.type,
    unit: medicine.unit,
    availablePharmacyCount: pharmacyIds.size,
    minPrice: prices.length ? Math.min(...prices) : null,
    maxPrice: prices.length ? Math.max(...prices) : null,
    totalStock,
    availabilityStatus: totalStock > 0 ? "In Stock" : "Out of Stock"
  };
}
function buildMedicineWhere(query) {
  const inventoryWhere = {
    ...publicInventoryWhere
  };
  if (query.pharmacyId) inventoryWhere.pharmacyId = query.pharmacyId;
  if (query.minPrice !== void 0 || query.maxPrice !== void 0) {
    inventoryWhere.sellingPrice = {
      ...query.minPrice !== void 0 ? { gte: query.minPrice } : {},
      ...query.maxPrice !== void 0 ? { lte: query.maxPrice } : {}
    };
  }
  if (query.availability === "lowStock") {
    inventoryWhere.stockQuantity = {
      gt: 0,
      lte: prisma.pharmacyInventory.fields.lowStockAlertQuantity
    };
  }
  const where = {
    isDeleted: false,
    status: MedicineStatus.ACTIVE,
    inventory: { some: inventoryWhere }
  };
  if (query.searchTerm) {
    where.OR = [
      { name: { contains: query.searchTerm, mode: "insensitive" } },
      { genericName: { contains: query.searchTerm, mode: "insensitive" } },
      { strength: { contains: query.searchTerm, mode: "insensitive" } },
      { description: { contains: query.searchTerm, mode: "insensitive" } }
    ];
  }
  if (query.categoryId) where.categoryId = query.categoryId;
  if (query.typeId) where.typeId = query.typeId;
  return where;
}
function medicineOrderBy(query) {
  if (query.sortBy === "name") return { name: query.sortOrder ?? "asc" };
  if (query.sortBy === "recent") return { createdAt: query.sortOrder ?? "desc" };
  return { createdAt: "desc" };
}
async function getPublicMedicineFilters() {
  const [categories, types, pharmacies] = await Promise.all([
    prisma.category.findMany({
      where: {
        isActive: true,
        isDeleted: false,
        medicines: { some: { inventory: { some: publicInventoryWhere } } }
      },
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true }
    }),
    prisma.medicineType.findMany({
      where: {
        isActive: true,
        isDeleted: false,
        medicines: { some: { inventory: { some: publicInventoryWhere } } }
      },
      orderBy: { name: "asc" },
      select: { id: true, name: true }
    }),
    prisma.pharmacy.findMany({
      where: {
        status: PharmacyStatus.APPROVED,
        inventory: { some: publicInventoryWhere }
      },
      orderBy: { name: "asc" },
      select: { id: true, name: true, address: true }
    })
  ]);
  return { categories, types, pharmacies };
}
async function getPublicMedicines(query) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 12;
  const skip = (page - 1) * limit;
  const where = buildMedicineWhere(query);
  const shouldSortByPrice = query.sortBy === "price";
  const medicineFindArgs = {
    where,
    skip: shouldSortByPrice ? 0 : skip,
    orderBy: medicineOrderBy(query),
    select: medicineCardSelect
  };
  if (!shouldSortByPrice) medicineFindArgs.take = limit;
  const [total, records] = await Promise.all([
    prisma.medicine.count({ where }),
    prisma.medicine.findMany(medicineFindArgs)
  ]);
  let medicines = records.map(summarizeMedicine);
  if (shouldSortByPrice) {
    const direction = query.sortOrder === "desc" ? -1 : 1;
    medicines = medicines.sort((a, b) => ((a.minPrice ?? 0) - (b.minPrice ?? 0)) * direction).slice(skip, skip + limit);
  }
  return {
    medicines,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}
async function getPublicMedicineDetails(id) {
  const medicine = await prisma.medicine.findFirst({
    where: {
      id,
      isDeleted: false,
      status: MedicineStatus.ACTIVE,
      inventory: { some: publicInventoryWhere }
    },
    select: {
      ...medicineCardSelect,
      boxSize: true,
      vat: true,
      leafSetting: {
        select: {
          id: true,
          name: true,
          leavesPerStrip: true,
          stripsPerBox: true
        }
      },
      inventory: {
        where: publicInventoryWhere,
        orderBy: [{ sellingPrice: "asc" }, { updatedAt: "desc" }],
        select: {
          id: true,
          pharmacyId: true,
          stockQuantity: true,
          sellingPrice: true,
          expiryDate: true,
          shelf: true,
          pharmacy: { select: pharmacyPublicSelect }
        }
      }
    }
  });
  if (!medicine) throw new NotFoundError("Medicine not found");
  const pharmacyMap = /* @__PURE__ */ new Map();
  for (const item of medicine.inventory) {
    const existing = pharmacyMap.get(item.pharmacyId);
    if (existing) {
      existing.stockQuantity += item.stockQuantity;
      existing.minPrice = Math.min(existing.minPrice, Number(item.sellingPrice));
      existing.maxPrice = Math.max(existing.maxPrice, Number(item.sellingPrice));
      continue;
    }
    pharmacyMap.set(item.pharmacyId, {
      pharmacy: item.pharmacy,
      stockQuantity: item.stockQuantity,
      minPrice: Number(item.sellingPrice),
      maxPrice: Number(item.sellingPrice),
      expiryDate: item.expiryDate,
      shelf: item.shelf
    });
  }
  const relatedWhere = {
    id: { not: medicine.id },
    isDeleted: false,
    status: MedicineStatus.ACTIVE,
    inventory: { some: publicInventoryWhere }
  };
  const relatedOr = [
    ...medicine.category?.id ? [{ categoryId: medicine.category.id }] : [],
    ...medicine.type?.id ? [{ typeId: medicine.type.id }] : []
  ];
  if (relatedOr.length) relatedWhere.OR = relatedOr;
  const related = await prisma.medicine.findMany({
    where: relatedWhere,
    take: 4,
    orderBy: { createdAt: "desc" },
    select: medicineCardSelect
  });
  return {
    ...summarizeMedicine(medicine),
    boxSize: medicine.boxSize,
    vat: toNumber2(medicine.vat),
    leafSetting: medicine.leafSetting,
    availablePharmacies: Array.from(pharmacyMap.values()),
    relatedMedicines: related.map(summarizeMedicine)
  };
}
async function getPublicPharmacies(query) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 12;
  const skip = (page - 1) * limit;
  const where = {
    status: PharmacyStatus.APPROVED,
    inventory: { some: publicInventoryWhere }
  };
  if (query.searchTerm) {
    where.OR = [
      { name: { contains: query.searchTerm, mode: "insensitive" } },
      { address: { contains: query.searchTerm, mode: "insensitive" } }
    ];
  }
  const orderBy = query.sortBy === "recent" ? { createdAt: query.sortOrder ?? "desc" } : { name: query.sortOrder ?? "asc" };
  const [pharmacies, total] = await Promise.all([
    prisma.pharmacy.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: {
        ...pharmacyPublicSelect,
        _count: {
          select: {
            inventory: {
              where: publicInventoryWhere
            }
          }
        }
      }
    }),
    prisma.pharmacy.count({ where })
  ]);
  return {
    pharmacies: pharmacies.map((pharmacy) => ({
      ...pharmacy,
      availableMedicineCount: pharmacy._count.inventory,
      _count: void 0
    })),
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}
async function getPublicPharmacyDetails(id) {
  const pharmacy = await prisma.pharmacy.findFirst({
    where: {
      id,
      status: PharmacyStatus.APPROVED,
      inventory: { some: publicInventoryWhere }
    },
    select: {
      ...pharmacyPublicSelect,
      inventory: {
        where: {
          status: PharmacyInventoryStatus.ACTIVE,
          stockQuantity: { gt: 0 },
          medicine: {
            isDeleted: false,
            status: MedicineStatus.ACTIVE
          }
        },
        orderBy: [{ medicine: { name: "asc" } }],
        select: {
          stockQuantity: true,
          sellingPrice: true,
          medicine: {
            select: {
              id: true,
              name: true,
              genericName: true,
              strength: true,
              image: true,
              category: { select: { id: true, name: true, slug: true } },
              type: { select: { id: true, name: true } }
            }
          }
        }
      }
    }
  });
  if (!pharmacy) throw new NotFoundError("Pharmacy not found");
  const medicineMap = /* @__PURE__ */ new Map();
  for (const item of pharmacy.inventory) {
    const existing = medicineMap.get(item.medicine.id);
    if (existing) {
      existing.stockQuantity += item.stockQuantity;
      existing.minPrice = Math.min(existing.minPrice, Number(item.sellingPrice));
      existing.maxPrice = Math.max(existing.maxPrice, Number(item.sellingPrice));
      continue;
    }
    medicineMap.set(item.medicine.id, {
      ...item.medicine,
      stockQuantity: item.stockQuantity,
      minPrice: Number(item.sellingPrice),
      maxPrice: Number(item.sellingPrice)
    });
  }
  return {
    ...pharmacy,
    inventory: void 0,
    availableMedicineCount: medicineMap.size,
    medicines: Array.from(medicineMap.values())
  };
}

// src/modules/public-discovery/public-discovery.validation.ts
import { z as z16 } from "zod";
var optionalString = z16.preprocess(
  (value) => value === "" ? void 0 : value,
  z16.string().trim().optional()
);
var optionalNumber = z16.preprocess(
  (value) => value === "" ? void 0 : value,
  z16.coerce.number().min(0).optional()
);
var publicMedicineQuerySchema = z16.object({
  page: z16.coerce.number().int().min(1).optional(),
  limit: z16.coerce.number().int().min(1).max(48).optional(),
  searchTerm: optionalString,
  categoryId: optionalString,
  typeId: optionalString,
  pharmacyId: optionalString,
  minPrice: optionalNumber,
  maxPrice: optionalNumber,
  availability: z16.preprocess(
    (value) => value === "" ? void 0 : value,
    z16.enum(["inStock", "lowStock"]).optional()
  ),
  sortBy: z16.preprocess(
    (value) => value === "" ? void 0 : value,
    z16.enum(["name", "price", "recent"]).optional()
  ),
  sortOrder: z16.preprocess(
    (value) => value === "" ? void 0 : value,
    z16.enum(["asc", "desc"]).optional()
  )
});
var publicPharmacyQuerySchema = z16.object({
  page: z16.coerce.number().int().min(1).optional(),
  limit: z16.coerce.number().int().min(1).max(48).optional(),
  searchTerm: optionalString,
  sortBy: z16.preprocess(
    (value) => value === "" ? void 0 : value,
    z16.enum(["name", "recent"]).optional()
  ),
  sortOrder: z16.preprocess(
    (value) => value === "" ? void 0 : value,
    z16.enum(["asc", "desc"]).optional()
  )
});
var publicIdParamSchema = z16.object({
  id: z16.string().min(1)
});

// src/modules/public-discovery/public-discovery.controller.ts
async function getMedicineFilters(_req, res, next) {
  try {
    const filters = await getPublicMedicineFilters();
    sendSuccess(res, filters, "Public medicine filters retrieved successfully");
  } catch (error) {
    next(error);
  }
}
async function getMedicines(req, res, next) {
  try {
    const query = publicMedicineQuerySchema.parse(req.query);
    const { medicines, meta } = await getPublicMedicines(query);
    sendSuccess(res, medicines, "Public medicines retrieved successfully", 200, meta);
  } catch (error) {
    next(error);
  }
}
async function getMedicineDetails(req, res, next) {
  try {
    const { id } = publicIdParamSchema.parse(req.params);
    const medicine = await getPublicMedicineDetails(id);
    sendSuccess(res, medicine, "Public medicine details retrieved successfully");
  } catch (error) {
    next(error);
  }
}
async function getPharmacies(req, res, next) {
  try {
    const query = publicPharmacyQuerySchema.parse(req.query);
    const { pharmacies, meta } = await getPublicPharmacies(query);
    sendSuccess(res, pharmacies, "Public pharmacies retrieved successfully", 200, meta);
  } catch (error) {
    next(error);
  }
}
async function getPharmacyDetails(req, res, next) {
  try {
    const { id } = publicIdParamSchema.parse(req.params);
    const pharmacy = await getPublicPharmacyDetails(id);
    sendSuccess(res, pharmacy, "Public pharmacy details retrieved successfully");
  } catch (error) {
    next(error);
  }
}

// src/modules/public-discovery/public-discovery.routes.ts
var publicDiscoveryRoutes = Router16();
publicDiscoveryRoutes.get("/medicine-filters", getMedicineFilters);
publicDiscoveryRoutes.get("/medicines", getMedicines);
publicDiscoveryRoutes.get("/medicines/:id", getMedicineDetails);
publicDiscoveryRoutes.get("/pharmacies", getPharmacies);
publicDiscoveryRoutes.get("/pharmacies/:id", getPharmacyDetails);
var public_discovery_routes_default = publicDiscoveryRoutes;

// src/router/centralRoutes.ts
var router8 = Router17();
router8.use("/auth", auth_routes_default);
router8.use("/public", public_discovery_routes_default);
router8.use("/pharmacies", pharmacy_routes_default);
router8.use("/pharmacy/inventory", inventory_routes_default);
router8.use("/pharmacy/purchases", purchase_routes_default);
router8.use("/pharmacy/customers", customer_routes_default);
router8.use("/pharmacy/invoices", invoice_routes_default);
router8.use("/pharmacy/analytics", pharmacyAnalyticsRoutes);
router8.use("/pharmacy/staff", staff_routes_default);
router8.use("/medicine-requests", medicine_request_routes_default);
router8.use("/admin/categories", category_routes_default);
router8.use("/admin/medicine-types", medicine_type_routes_default);
router8.use("/admin/units", unit_routes_default);
router8.use("/admin/leaf-settings", leaf_setting_routes_default);
router8.use("/admin/suppliers", supplier_routes_default);
router8.use("/admin/medicines", medicine_routes_default);
router8.use("/admin/analytics", adminAnalyticsRoutes);
var centralRoutes_default = router8;

// src/middleware/notFoundHandler.ts
var notFoundHandler = (req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found!`, 404);
  next(error);
};
var notFoundHandler_default = notFoundHandler;

// src/middleware/globalErrorHandler.ts
import { ZodError } from "zod";

// src/utils/errorFormatter.ts
var formatZodError = (error) => error.issues.map((issue) => ({
  message: issue.message,
  code: issue.code,
  ...issue.path.length > 0 && { field: issue.path.join(".") }
}));
var formatPrismaValidationError = (error) => [{ message: error.message, code: "PRISMA_VALIDATION_ERROR" }];
var formatPrismaClientRequestError = (error) => {
  const field = Array.isArray(error.meta?.target) ? error.meta.target.join(".") : error.meta?.target;
  const base = { message: error.message, code: error.code, ...field && { field } };
  const messages = {
    P2002: `Duplicate value for ${field || "unique field"}`,
    P2025: "Requested record was not found",
    P2003: `Unable to delete. This ${field || "item"} is already used in other records.`,
    P2000: `Value too long for ${field || "field"}`,
    P2021: "Table does not exist in the database",
    P2022: "Column does not exist in the database"
  };
  return [{ ...base, message: messages[error.code] ?? error.message }];
};
var formatPrismaClientInitError = (error) => [{ message: error.message, code: "PRISMA_CONNECTION_ERROR" }];
var formatPrismaClientRuntimeError = (error) => [
  {
    message: error.message,
    code: error instanceof prismaNamespace_exports.PrismaClientRustPanicError ? "PRISMA_RUST_PANIC" : "PRISMA_UNKNOWN_REQUEST_ERROR"
  }
];
var formatGenericError = (error) => [
  { message: error.message || "Something went wrong", code: error.name || "GENERIC_ERROR" }
];
var createErrorResponse = (message, errorSource, err, isDevelopment2 = false) => {
  const response = { success: false, message, errorSource };
  if (isDevelopment2 && err) {
    const debug = {
      name: err.name,
      message: err.message
    };
    if (err.stack) {
      debug.stack = err.stack;
    }
    response.debug = debug;
  }
  return response;
};

// src/utils/errorLogger.ts
var logErrorToConsole = (error, isDevelopment2) => {
  if (!isDevelopment2) return;
  console.error("=".repeat(60));
  console.error("ERROR:", error?.message);
  console.error("STACK:", error?.stack);
  console.error("=".repeat(60));
};

// src/middleware/globalErrorHandler.ts
var isDevelopment = route_config_default.NODE_ENV === "development";
var globalErrorHandler = (err, _req, res, _next) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errorSource = [
    {
      message: "Something went wrong",
      code: "INTERNAL_SERVER_ERROR"
    }
  ];
  logErrorToConsole(err, isDevelopment);
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    errorSource = formatZodError(err);
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSource = [
      {
        message: err.message,
        code: err.constructor.name
      }
    ];
  } else if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = 400;
    message = "Database Validation Error";
    errorSource = formatPrismaValidationError(err);
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    errorSource = formatPrismaClientRequestError(err);
    switch (err.code) {
      case "P2002":
        statusCode = 409;
        message = "Resource already exists";
        break;
      case "P2025":
        statusCode = 404;
        message = "Resource not found";
        break;
      case "P2003":
        statusCode = 409;
        message = "Foreign key constraint failed";
        break;
      case "P2021":
      case "P2022":
      case "P2024":
        statusCode = 500;
        message = "Database Operation Error";
        break;
      default:
        statusCode = 400;
        message = "Database Operation Error";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    statusCode = 500;
    message = "Database Connection Error";
    errorSource = formatPrismaClientInitError(err);
  } else if (err instanceof prismaNamespace_exports.PrismaClientRustPanicError || err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = 500;
    message = "Database Runtime Error";
    errorSource = formatPrismaClientRuntimeError(err);
  } else if (err instanceof SyntaxError) {
    statusCode = 400;
    message = "Invalid Request Format";
    errorSource = formatGenericError(err);
  } else if (err instanceof Error) {
    statusCode = 500;
    message = "Internal Server Error";
    errorSource = formatGenericError(err);
  }
  const errorResponse = createErrorResponse(
    message,
    errorSource,
    err instanceof Error ? err : void 0,
    isDevelopment
  );
  res.status(statusCode).json(errorResponse);
};
var globalErrorHandler_default = globalErrorHandler;

// src/app.ts
var app = express();
app.use(
  cors({
    origin: [
      route_config_default.FRONTEND_URL || "http://localhost:3000",
      route_config_default.BACKEND_BASE_URL || "http://localhost:5000",
      "http://localhost:3000",
      "http://localhost:5000"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "x-intended-role"]
  })
);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.get("/health", (_req, res) => {
  res.json({ status: "ok", env: route_config_default.NODE_ENV, ts: (/* @__PURE__ */ new Date()).toISOString() });
});
app.use("/api/v1", centralRoutes_default);
app.use(notFoundHandler_default);
app.use(globalErrorHandler_default);
var app_default = app;

// src/vercel.ts
var vercel_default = app_default;
export {
  vercel_default as default
};
