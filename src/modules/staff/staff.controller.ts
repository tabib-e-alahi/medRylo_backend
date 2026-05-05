import { Request, Response, NextFunction } from "express";
import { sendCreated, sendSuccess } from "../../utils/sendResponse";
import * as staffService from "./staff.service";
import { createStaffSchema, staffQuerySchema, updateStaffSchema } from "./staff.validation";

export const createStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = createStaffSchema.parse(req.body);
    const result = await staffService.createStaff(req.user.id, payload);
    sendCreated(res, result, "Staff account created successfully");
  } catch (error) {
    next(error);
  }
};

export const getStaffList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = staffQuerySchema.parse(req.query);
    const { staff, meta } = await staffService.getStaffList(req.user.id, query);
    sendSuccess(res, staff, "Staff retrieved successfully", 200, meta);
  } catch (error) {
    next(error);
  }
};

export const getStaffById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await staffService.getStaffById(req.user.id, String(req.params.id));
    sendSuccess(res, result, "Staff retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const updateStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = updateStaffSchema.parse(req.body);
    const result = await staffService.updateStaff(req.user.id, String(req.params.id), payload);
    sendSuccess(res, result, "Staff updated successfully");
  } catch (error) {
    next(error);
  }
};

export const archiveStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await staffService.archiveStaff(req.user.id, String(req.params.id));
    sendSuccess(res, result, "Staff deactivated successfully");
  } catch (error) {
    next(error);
  }
};

export const getMyStaffProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await staffService.getMyStaffProfile(req.user.id);
    sendSuccess(res, result, "Staff profile retrieved successfully");
  } catch (error) {
    next(error);
  }
};
