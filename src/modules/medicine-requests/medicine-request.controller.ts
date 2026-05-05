import { Request, Response, NextFunction } from "express";
import { sendCreated, sendSuccess } from "../../utils/sendResponse";
import * as medicineRequestService from "./medicine-request.service";
import {
  approveMedicineRequestSchema,
  createMedicineRequestSchema,
  medicineRequestQuerySchema,
  rejectMedicineRequestSchema,
} from "./medicine-request.validation";

export const createMedicineRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = createMedicineRequestSchema.parse(req.body);
    const result = await medicineRequestService.createMedicineRequest(req.user.id, payload);
    sendCreated(res, result, "Medicine request submitted successfully");
  } catch (error) {
    next(error);
  }
};

export const getMyMedicineRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = medicineRequestQuerySchema.parse(req.query);
    const { requests, meta } = await medicineRequestService.getMyMedicineRequests(req.user.id, query);
    sendSuccess(res, requests, "Medicine requests retrieved successfully", 200, meta);
  } catch (error) {
    next(error);
  }
};

export const getAdminMedicineRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = medicineRequestQuerySchema.parse(req.query);
    const { requests, meta } = await medicineRequestService.getAdminMedicineRequests(query);
    sendSuccess(res, requests, "Medicine requests retrieved successfully", 200, meta);
  } catch (error) {
    next(error);
  }
};

export const approveMedicineRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = approveMedicineRequestSchema.parse(req.body);
    const result = await medicineRequestService.approveMedicineRequest(String(req.params.id), payload);
    sendSuccess(res, result, "Medicine request approved and added to global database");
  } catch (error) {
    next(error);
  }
};

export const rejectMedicineRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = rejectMedicineRequestSchema.parse(req.body);
    const result = await medicineRequestService.rejectMedicineRequest(String(req.params.id), payload);
    sendSuccess(res, result, "Medicine request rejected successfully");
  } catch (error) {
    next(error);
  }
};
