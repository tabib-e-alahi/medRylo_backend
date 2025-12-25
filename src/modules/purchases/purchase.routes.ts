import { Router } from "express";
import authMiddleware, { UserRole } from "../../middleware/auth.middleware";
import * as purchaseController from "./purchase.controller";

const router: Router  = Router();
const requireApprovedPharmacyUser = [authMiddleware(UserRole.PHARMACY)];

router.get("/suppliers", ...requireApprovedPharmacyUser, purchaseController.getActiveSuppliers);
router.get("/", ...requireApprovedPharmacyUser, purchaseController.getPurchases);
router.post("/", ...requireApprovedPharmacyUser, purchaseController.createPurchase);
router.get("/:id", ...requireApprovedPharmacyUser, purchaseController.getPurchaseById);
router.patch("/:id/payment", ...requireApprovedPharmacyUser, purchaseController.updatePurchasePayment);
router.patch("/:id/status", ...requireApprovedPharmacyUser, purchaseController.updatePurchaseStatus);

export default router;
