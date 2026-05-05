import { Router } from "express";
import authMiddleware, { UserRole } from "../../middleware/auth.middleware";
import * as customerController from "./customer.controller";

const router = Router();
const requireSalesUser = [authMiddleware(UserRole.PHARMACY, UserRole.STAFF)];

router.get("/", ...requireSalesUser, customerController.getCustomers);
router.post("/", ...requireSalesUser, customerController.createCustomer);
router.get("/:id", ...requireSalesUser, customerController.getCustomerById);
router.patch("/:id", ...requireSalesUser, customerController.updateCustomer);
router.delete("/:id", ...requireSalesUser, customerController.archiveCustomer);

export default router;
