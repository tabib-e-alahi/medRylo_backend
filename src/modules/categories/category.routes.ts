import { Router } from "express";
import * as categoryController from "./category.controller";
import { requireAdmin } from "../../middleware/auth.middleware";

const categoryRoutes = Router();

categoryRoutes.get("/", ...requireAdmin, categoryController.getAllCategories);
categoryRoutes.get("/:id", ...requireAdmin, categoryController.getCategoryById);
categoryRoutes.post("/", ...requireAdmin, categoryController.createCategory);
categoryRoutes.put("/:id", ...requireAdmin, categoryController.updateCategory);
categoryRoutes.delete("/:id", ...requireAdmin, categoryController.deleteCategory);

export default categoryRoutes;
