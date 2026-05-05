import { Request, Response, NextFunction } from "express";
import * as medicineTypeService from "./medicine-type.service";
import { createMedicineTypeSchema, updateMedicineTypeSchema } from "./medicine-type.validation";
import { sendSuccess, sendCreated } from "../../utils/sendResponse";

export const createMedicineType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createMedicineTypeSchema.parse(req.body);
    const result = await medicineTypeService.createMedicineType(validatedData);
    sendCreated(res, result, "Medicine type created successfully");
  } catch (error) {
    next(error);
  }
};

export const getAllMedicineTypes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      searchTerm: req.query.searchTerm as string,
      sortBy: req.query.sortBy as string,
      sortOrder: (req.query.sortOrder as "asc" | "desc") || "desc",
      isActive: req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : undefined,
    };

    const { medicineTypes, meta } = await medicineTypeService.getAllMedicineTypes(query);
    sendSuccess(res, medicineTypes, "Medicine types retrieved successfully", 200, meta);
  } catch (error) {
    next(error);
  }
};

export const getMedicineTypeById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await medicineTypeService.getMedicineTypeById(req.params.id);
    sendSuccess(res, result, "Medicine type retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const updateMedicineType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = updateMedicineTypeSchema.parse(req.body);
    const result = await medicineTypeService.updateMedicineType(req.params.id, validatedData);
    sendSuccess(res, result, "Medicine type updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteMedicineType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await medicineTypeService.deleteMedicineType(req.params.id);
    sendSuccess(res, null, "Medicine type deleted successfully");
  } catch (error) {
    next(error);
  }
};
