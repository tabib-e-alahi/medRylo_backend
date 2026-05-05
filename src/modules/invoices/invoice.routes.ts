import { Router } from "express";
import authMiddleware, { UserRole } from "../../middleware/auth.middleware";
import * as invoiceController from "./invoice.controller";

const router = Router();
const requireSalesUser = [authMiddleware(UserRole.PHARMACY, UserRole.STAFF)];

router.get("/", ...requireSalesUser, invoiceController.getInvoices);
router.post("/", ...requireSalesUser, invoiceController.createInvoice);
router.get("/:id", ...requireSalesUser, invoiceController.getInvoiceById);
router.patch("/:id/cancel", ...requireSalesUser, invoiceController.cancelInvoice);
router.get("/:id/payments", ...requireSalesUser, invoiceController.getInvoicePayments);
router.post("/:id/payments", ...requireSalesUser, invoiceController.createPayment);

export default router;
