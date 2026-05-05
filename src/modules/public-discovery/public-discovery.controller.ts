import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../utils/sendResponse";
import * as publicDiscoveryService from "./public-discovery.service";
import {
  publicIdParamSchema,
  publicMedicineQuerySchema,
  publicPharmacyQuerySchema,
} from "./public-discovery.validation";

export async function getMedicineFilters(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const filters = await publicDiscoveryService.getPublicMedicineFilters();
    sendSuccess(res, filters, "Public medicine filters retrieved successfully");
  } catch (error) {
    next(error);
  }
}

export async function getMedicines(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = publicMedicineQuerySchema.parse(req.query);
    const { medicines, meta } = await publicDiscoveryService.getPublicMedicines(query);
    sendSuccess(res, medicines, "Public medicines retrieved successfully", 200, meta);
  } catch (error) {
    next(error);
  }
}

export async function getMedicineDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = publicIdParamSchema.parse(req.params);
    const medicine = await publicDiscoveryService.getPublicMedicineDetails(id);
    sendSuccess(res, medicine, "Public medicine details retrieved successfully");
  } catch (error) {
    next(error);
  }
}

export async function getPharmacies(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = publicPharmacyQuerySchema.parse(req.query);
    const { pharmacies, meta } = await publicDiscoveryService.getPublicPharmacies(query);
    sendSuccess(res, pharmacies, "Public pharmacies retrieved successfully", 200, meta);
  } catch (error) {
    next(error);
  }
}

export async function getPharmacyDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = publicIdParamSchema.parse(req.params);
    const pharmacy = await publicDiscoveryService.getPublicPharmacyDetails(id);
    sendSuccess(res, pharmacy, "Public pharmacy details retrieved successfully");
  } catch (error) {
    next(error);
  }
}
