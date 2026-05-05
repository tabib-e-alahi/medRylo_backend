import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import categoryRoutes from "../modules/categories/category.routes";
import medicineTypeRoutes from "../modules/medicine-types/medicine-type.routes";
import unitRoutes from "../modules/units/unit.routes";
import leafSettingRoutes from "../modules/leaf-settings/leaf-setting.routes";
import supplierRoutes from "../modules/suppliers/supplier.routes";
import medicineRoutes from "../modules/medicines/medicine.routes";
import pharmacyRoutes from "../modules/pharmacies/pharmacy.routes";
import inventoryRoutes from "../modules/inventory/inventory.routes";
import medicineRequestRoutes from "../modules/medicine-requests/medicine-request.routes";
import purchaseRoutes from "../modules/purchases/purchase.routes";
import customerRoutes from "../modules/customers/customer.routes";
import invoiceRoutes from "../modules/invoices/invoice.routes";
import { adminAnalyticsRoutes, pharmacyAnalyticsRoutes } from "../modules/analytics/analytics.routes";
import staffRoutes from "../modules/staff/staff.routes";
import publicDiscoveryRoutes from "../modules/public-discovery/public-discovery.routes";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/public", publicDiscoveryRoutes);
router.use("/pharmacies", pharmacyRoutes);
router.use("/pharmacy/inventory", inventoryRoutes);
router.use("/pharmacy/purchases", purchaseRoutes);
router.use("/pharmacy/customers", customerRoutes);
router.use("/pharmacy/invoices", invoiceRoutes);
router.use("/pharmacy/analytics", pharmacyAnalyticsRoutes);
router.use("/pharmacy/staff", staffRoutes);
router.use("/medicine-requests", medicineRequestRoutes);

// Admin catalogue routes
router.use("/admin/categories", categoryRoutes);
router.use("/admin/medicine-types", medicineTypeRoutes);
router.use("/admin/units", unitRoutes);
router.use("/admin/leaf-settings", leafSettingRoutes);
router.use("/admin/suppliers", supplierRoutes);
router.use("/admin/medicines", medicineRoutes);
router.use("/admin/analytics", adminAnalyticsRoutes);

export default router;
