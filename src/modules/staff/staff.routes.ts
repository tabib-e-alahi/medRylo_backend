import { Router } from "express";
import authMiddleware, { UserRole } from "../../middleware/auth.middleware";
import * as staffController from "./staff.controller";

const router: Router  = Router();

router.get("/me", authMiddleware(UserRole.STAFF), staffController.getMyStaffProfile);
router.get("/", authMiddleware(UserRole.PHARMACY), staffController.getStaffList);
router.post("/", authMiddleware(UserRole.PHARMACY), staffController.createStaff);
router.get("/:id", authMiddleware(UserRole.PHARMACY), staffController.getStaffById);
router.patch("/:id", authMiddleware(UserRole.PHARMACY), staffController.updateStaff);
router.delete("/:id", authMiddleware(UserRole.PHARMACY), staffController.archiveStaff);

export default router;
