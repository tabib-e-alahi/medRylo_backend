import { Router } from "express";
import * as medicineTypeController from "./medicine-type.controller";
import { requireAdmin } from "../../middleware/auth.middleware";

const medicineTypeRoutes = Router();

medicineTypeRoutes.get("/", ...requireAdmin, medicineTypeController.getAllMedicineTypes);
medicineTypeRoutes.get("/:id", ...requireAdmin, medicineTypeController.getMedicineTypeById);
medicineTypeRoutes.post("/", ...requireAdmin, medicineTypeController.createMedicineType);
medicineTypeRoutes.put("/:id", ...requireAdmin, medicineTypeController.updateMedicineType);
medicineTypeRoutes.delete("/:id", ...requireAdmin, medicineTypeController.deleteMedicineType);

export default medicineTypeRoutes;
