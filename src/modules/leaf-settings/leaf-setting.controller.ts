import { Request, Response, NextFunction } from "express";
import * as leafSettingService from "./leaf-setting.service";
import { createLeafSettingSchema, updateLeafSettingSchema } from "./leaf-setting.validation";
import { sendSuccess, sendCreated } from "../../utils/sendResponse";

export const createLeafSetting = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createLeafSettingSchema.parse(req.body);
    const result = await leafSettingService.createLeafSetting(validatedData);
    sendCreated(res, result, "Leaf setting created successfully");
  } catch (error) {
    next(error);
  }
};

export const getAllLeafSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      searchTerm: req.query.searchTerm as string,
      sortBy: req.query.sortBy as string,
      sortOrder: (req.query.sortOrder as "asc" | "desc") || "desc",
      isActive: req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : undefined,
    };

    const { leafSettings, meta } = await leafSettingService.getAllLeafSettings(query);
    sendSuccess(res, leafSettings, "Leaf settings retrieved successfully", 200, meta);
  } catch (error) {
    next(error);
  }
};

export const getLeafSettingById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await leafSettingService.getLeafSettingById(req.params.id);
    sendSuccess(res, result, "Leaf setting retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const updateLeafSetting = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = updateLeafSettingSchema.parse(req.body);
    const result = await leafSettingService.updateLeafSetting(req.params.id, validatedData);
    sendSuccess(res, result, "Leaf setting updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteLeafSetting = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await leafSettingService.deleteLeafSetting(req.params.id);
    sendSuccess(res, null, "Leaf setting deleted successfully");
  } catch (error) {
    next(error);
  }
};
