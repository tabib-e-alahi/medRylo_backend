import { Router } from "express";
import * as leafSettingController from "./leaf-setting.controller";
import { requireAdmin } from "../../middleware/auth.middleware";

const leafSettingRoutes = Router();

leafSettingRoutes.get("/", ...requireAdmin, leafSettingController.getAllLeafSettings);
leafSettingRoutes.get("/:id", ...requireAdmin, leafSettingController.getLeafSettingById);
leafSettingRoutes.post("/", ...requireAdmin, leafSettingController.createLeafSetting);
leafSettingRoutes.put("/:id", ...requireAdmin, leafSettingController.updateLeafSetting);
leafSettingRoutes.delete("/:id", ...requireAdmin, leafSettingController.deleteLeafSetting);

export default leafSettingRoutes;
