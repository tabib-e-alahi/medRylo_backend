import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../../utils/sendResponse";
import * as analyticsService from "./analytics.service";
import { analyticsQuerySchema } from "./analytics.validation";
import { UserRole } from "../../constant/enum";

export const getAdminOverview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = analyticsQuerySchema.parse(req.query);
    const result = await analyticsService.getAdminOverview(query);
    sendSuccess(res, result, "Admin analytics retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const getAdminPharmacies = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await analyticsService.getAdminPharmacyAnalytics();
    sendSuccess(res, result, "Pharmacy analytics retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const getAdminMedicines = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await analyticsService.getAdminMedicineAnalytics();
    sendSuccess(res, result, "Medicine analytics retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const getAdminSalesSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = analyticsQuerySchema.parse(req.query);
    const result = await analyticsService.getAdminSalesSummary(query);
    sendSuccess(res, result, "Platform sales summary retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const getPharmacyOverview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = analyticsQuerySchema.parse(req.query);
    const result = await analyticsService.getPharmacyOverview(req.user.id, req.user.role as UserRole, query);
    sendSuccess(res, result, "Pharmacy analytics retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const getPharmacySales = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = analyticsQuerySchema.parse(req.query);
    const result = await analyticsService.getPharmacySalesAnalytics(req.user.id, req.user.role as UserRole, query);
    sendSuccess(res, result, "Sales analytics retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const getPharmacyPurchases = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = analyticsQuerySchema.parse(req.query);
    const result = await analyticsService.getPharmacyPurchaseAnalytics(req.user.id, req.user.role as UserRole, query);
    sendSuccess(res, result, "Purchase analytics retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const getPharmacyInventory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await analyticsService.getPharmacyInventoryAnalytics(req.user.id, req.user.role as UserRole);
    sendSuccess(res, result, "Inventory analytics retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const getPharmacyPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = analyticsQuerySchema.parse(req.query);
    const result = await analyticsService.getPharmacyPaymentAnalytics(req.user.id, req.user.role as UserRole, query);
    sendSuccess(res, result, "Payment analytics retrieved successfully");
  } catch (error) {
    next(error);
  }
};
