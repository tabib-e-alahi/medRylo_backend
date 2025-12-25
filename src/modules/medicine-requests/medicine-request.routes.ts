import { Router } from "express";
import authMiddleware, { UserRole, requireAdmin } from "../../middleware/auth.middleware";
import * as medicineRequestController from "./medicine-request.controller";

const router: Router  = Router();
const requireApprovedPharmacyUser = [authMiddleware(UserRole.PHARMACY)];

router.get("/pharmacy", ...requireApprovedPharmacyUser, medicineRequestController.getMyMedicineRequests);
router.post("/pharmacy", ...requireApprovedPharmacyUser, medicineRequestController.createMedicineRequest);

router.get("/admin", ...requireAdmin, medicineRequestController.getAdminMedicineRequests);
router.patch("/admin/:id/approve", ...requireAdmin, medicineRequestController.approveMedicineRequest);
router.patch("/admin/:id/reject", ...requireAdmin, medicineRequestController.rejectMedicineRequest);

export default router;
