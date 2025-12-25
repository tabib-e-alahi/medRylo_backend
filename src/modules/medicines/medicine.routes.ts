import { Router } from "express";
import * as medicineController from "./medicine.controller";
import { requireAdmin } from "../../middleware/auth.middleware";
import { uploadMedicineImage, uploadMedicineImageOptional } from "../../middleware/upload.middleware";

const medicineRoutes: Router  = Router();

medicineRoutes.get("/", ...requireAdmin, medicineController.getAllMedicines);
medicineRoutes.get("/:id", ...requireAdmin, medicineController.getMedicineById);
medicineRoutes.post("/", ...requireAdmin, uploadMedicineImage, medicineController.createMedicine);
medicineRoutes.put("/:id", ...requireAdmin, uploadMedicineImageOptional, medicineController.updateMedicine);
medicineRoutes.delete("/:id", ...requireAdmin, medicineController.deleteMedicine);

export default medicineRoutes;
