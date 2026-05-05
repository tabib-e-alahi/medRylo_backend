import { Request, Response, NextFunction } from "express";
import { sendCreated, sendSuccess } from "../../utils/sendResponse";
import * as purchaseService from "./purchase.service";
import {
  createPurchaseSchema,
  purchaseQuerySchema,
  updatePaymentSchema,
  updatePurchaseStatusSchema,
} from "./purchase.validation";

export const getActiveSuppliers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query: { searchTerm?: string; limit?: number } = {};
    if (req.query.searchTerm) query.searchTerm = String(req.query.searchTerm);
    if (req.query.limit) query.limit = Number(req.query.limit);

    const result = await purchaseService.getActiveSuppliers(req.user.id, query);
    sendSuccess(res, result, "Suppliers retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const createPurchase = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = createPurchaseSchema.parse(req.body);
    const result = await purchaseService.createPurchase(req.user.id, payload);
    sendCreated(res, result, "Purchase created successfully");
  } catch (error) {
    next(error);
  }
};

export const getPurchases = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = purchaseQuerySchema.parse(req.query);
    const { purchases, meta } = await purchaseService.getPurchases(req.user.id, query);
    sendSuccess(res, purchases, "Purchases retrieved successfully", 200, meta);
  } catch (error) {
    next(error);
  }
};

export const getPurchaseById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await purchaseService.getPurchaseById(req.user.id, String(req.params.id));
    sendSuccess(res, result, "Purchase retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const updatePurchasePayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = updatePaymentSchema.parse(req.body);
    const result = await purchaseService.updatePurchasePayment(req.user.id, String(req.params.id), payload);
    sendSuccess(res, result, "Purchase payment updated successfully");
  } catch (error) {
    next(error);
  }
};

export const updatePurchaseStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = updatePurchaseStatusSchema.parse(req.body);
    const result = await purchaseService.updatePurchaseStatus(req.user.id, String(req.params.id), payload);
    sendSuccess(res, result, "Purchase status updated successfully");
  } catch (error) {
    next(error);
  }
};
