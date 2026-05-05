import { Router } from "express";
import * as unitController from "./unit.controller";
import { requireAdmin } from "../../middleware/auth.middleware";

const unitRoutes = Router();

unitRoutes.get("/", ...requireAdmin, unitController.getAllUnits);
unitRoutes.get("/:id", ...requireAdmin, unitController.getUnitById);
unitRoutes.post("/", ...requireAdmin, unitController.createUnit);
unitRoutes.put("/:id", ...requireAdmin, unitController.updateUnit);
unitRoutes.delete("/:id", ...requireAdmin, unitController.deleteUnit);

export default unitRoutes;
