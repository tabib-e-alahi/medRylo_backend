import { Router } from "express";
import * as pharmacyController from "./pharmacy.controller";
import { requireAuth, requireAdmin } from "../../middleware/auth.middleware";
import { uploadPharmacyLogo, uploadPharmacyLogoOptional } from "../../middleware/upload.middleware";

const router: Router = Router();

// Pharmacy status, creation and resubmission
router.get("/status", ...requireAuth, pharmacyController.getMyPharmacyStatus);
router.post("/", ...requireAuth, uploadPharmacyLogo, pharmacyController.createPharmacy);
router.patch("/resubmit", ...requireAuth, uploadPharmacyLogoOptional, pharmacyController.resubmitPharmacy);

// Admin approval routes
router.get("/admin/pending", ...requireAdmin, pharmacyController.getPendingPharmacies);
router.patch("/admin/:id/approve", ...requireAdmin, pharmacyController.approvePharmacy);
router.patch("/admin/:id/reject", ...requireAdmin, pharmacyController.rejectPharmacy);

export default router;
