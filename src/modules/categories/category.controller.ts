import { Request, Response, NextFunction } from "express";
import * as categoryService from "./category.service";
import { createCategorySchema, updateCategorySchema } from "./category.validation";
import { sendSuccess, sendCreated } from "../../utils/sendResponse";

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createCategorySchema.parse(req.body);
    const result = await categoryService.createCategory(validatedData);
    sendCreated(res, result, "Category created successfully");
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      searchTerm: req.query.searchTerm as string,
      sortBy: req.query.sortBy as string,
      sortOrder: (req.query.sortOrder as "asc" | "desc") || "desc",
      isActive: req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : undefined,
    };

    const { categories, meta } = await categoryService.getAllCategories(query);
    sendSuccess(res, categories, "Categories retrieved successfully", 200, meta);
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await categoryService.getCategoryById(req.params.id);
    sendSuccess(res, result, "Category retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = updateCategorySchema.parse(req.body);
    const result = await categoryService.updateCategory(req.params.id, validatedData);
    sendSuccess(res, result, "Category updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    sendSuccess(res, null, "Category deleted successfully");
  } catch (error) {
    next(error);
  }
};
