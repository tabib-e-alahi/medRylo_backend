export const USER_ROLE = {
  ADMIN: "ADMIN",
  PHARMACY: "PHARMACY",
  STAFF: "STAFF",
  USER: "USER",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export const USER_ACCOUNT_STATUS = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
} as const;

export type UserAccountStatus =
  (typeof USER_ACCOUNT_STATUS)[keyof typeof USER_ACCOUNT_STATUS];

export const MEDICINE_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  DISCONTINUED: "DISCONTINUED",
} as const;

export type MedicineStatus =
  (typeof MEDICINE_STATUS)[keyof typeof MEDICINE_STATUS];

export const PHARMACY_INVENTORY_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  ARCHIVED: "ARCHIVED",
} as const;

export type PharmacyInventoryStatus =
  (typeof PHARMACY_INVENTORY_STATUS)[keyof typeof PHARMACY_INVENTORY_STATUS];

export const MEDICINE_REQUEST_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type MedicineRequestStatus =
  (typeof MEDICINE_REQUEST_STATUS)[keyof typeof MEDICINE_REQUEST_STATUS];

export const PHARMACY_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type PharmacyStatus =
  (typeof PHARMACY_STATUS)[keyof typeof PHARMACY_STATUS];

export const PHARMACY_TYPE = {
  RETAIL: "RETAIL",
  WHOLESALE: "WHOLESALE",
  HOSPITAL: "HOSPITAL",
  CLINIC: "CLINIC",
} as const;

export type PharmacyType =
  (typeof PHARMACY_TYPE)[keyof typeof PHARMACY_TYPE];

export const PURCHASE_STATUS = {
  PENDING: "PENDING",
  RECEIVED: "RECEIVED",
  PARTIAL: "PARTIAL",
  CANCELLED: "CANCELLED",
} as const;

export type PurchaseStatus =
  (typeof PURCHASE_STATUS)[keyof typeof PURCHASE_STATUS];

export const PAYMENT_STATUS = {
  UNPAID: "UNPAID",
  PARTIAL: "PARTIAL",
  PAID: "PAID",
  CANCELLED: "CANCELLED",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const INVOICE_STATUS = {
  DRAFT: "DRAFT",
  ISSUED: "ISSUED",
  PAID: "PAID",
  PARTIAL: "PARTIAL",
  CANCELLED: "CANCELLED",
} as const;

export type InvoiceStatus =
  (typeof INVOICE_STATUS)[keyof typeof INVOICE_STATUS];

export const PAYMENT_MODE = {
  CASH: "CASH",
  CARD: "CARD",
  MOBILE_BANKING: "MOBILE_BANKING",
  BANK_TRANSFER: "BANK_TRANSFER",
} as const;

export type PaymentMode =
  (typeof PAYMENT_MODE)[keyof typeof PAYMENT_MODE];
