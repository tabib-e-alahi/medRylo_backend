import { Request, Response, NextFunction } from "express";
import * as unitService from "./unit.service";
import { createUnitSchema, updateUnitSchema } from "./unit.validation";
import { sendSuccess, sendCreated } from "../../utils/sendResponse";

export const createUnit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createUnitSchema.parse(req.body);
    const result = await unitService.createUnit(validatedData);
    sendCreated(res, result, "Unit created successfully");
  } catch (error) {
    next(error);
  }
};

export const getAllUnits = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      searchTerm: req.query.searchTerm as string,
      sortBy: req.query.sortBy as string,
      sortOrder: (req.query.sortOrder as "asc" | "desc") || "desc",
      isActive: req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : undefined,
    };

    const { units, meta } = await unitService.getAllUnits(query);
    sendSuccess(res, units, "Units retrieved successfully", 200, meta);
  } catch (error) {
    next(error);
  }
};

export const getUnitById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await unitService.getUnitById(req.params.id);
    sendSuccess(res, result, "Unit retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const updateUnit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = updateUnitSchema.parse(req.body);
    const result = await unitService.updateUnit(req.params.id, validatedData);
    sendSuccess(res, result, "Unit updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteUnit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await unitService.deleteUnit(req.params.id);
    sendSuccess(res, null, "Unit deleted successfully");
  } catch (error) {
    next(error);
  }
};
