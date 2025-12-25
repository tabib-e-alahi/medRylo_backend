import { Router } from "express";
import * as supplierController from "./supplier.controller";
import { requireAdmin } from "../../middleware/auth.middleware";

const supplierRoutes: Router  = Router();

supplierRoutes.get("/", ...requireAdmin, supplierController.getAllSuppliers);
supplierRoutes.get("/:id", ...requireAdmin, supplierController.getSupplierById);
supplierRoutes.post("/", ...requireAdmin, supplierController.createSupplier);
supplierRoutes.put("/:id", ...requireAdmin, supplierController.updateSupplier);
supplierRoutes.delete("/:id", ...requireAdmin, supplierController.deleteSupplier);

export default supplierRoutes;
