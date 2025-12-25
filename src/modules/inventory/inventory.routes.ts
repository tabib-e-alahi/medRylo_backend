import { Router } from "express";
import authMiddleware, { UserRole } from "../../middleware/auth.middleware";
import * as inventoryController from "./inventory.controller";

const router: Router  = Router();
const requireApprovedPharmacyUser = [authMiddleware(UserRole.PHARMACY, UserRole.STAFF)];

router.get("/medicines", ...requireApprovedPharmacyUser, inventoryController.getGlobalMedicines);
router.get("/", ...requireApprovedPharmacyUser, inventoryController.getInventory);
router.get("/:id", ...requireApprovedPharmacyUser, inventoryController.getInventoryItem);
router.post("/", ...requireApprovedPharmacyUser, inventoryController.createInventoryItem);
router.put("/:id", ...requireApprovedPharmacyUser, inventoryController.updateInventoryItem);
router.delete("/:id", ...requireApprovedPharmacyUser, inventoryController.archiveInventoryItem);

export default router;
