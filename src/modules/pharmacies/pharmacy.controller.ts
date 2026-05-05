import { Request, Response, NextFunction } from "express";
import * as pharmacyService from "./pharmacy.service";
import { approvePharmacySchema, rejectPharmacySchema, resubmitPharmacySchema } from "./pharmacy.validation";
import { sendSuccess } from "../../utils/sendResponse";
import { uploadImage } from "../uploads/upload.service";

export const getMyPharmacyStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const pharmacy = await pharmacyService.getPharmacyByUserId(userId);
    sendSuccess(res, pharmacy, "Pharmacy status retrieved");
  } catch (error) {
    next(error);
  }
};

export const getPendingPharmacies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pharmacies = await pharmacyService.getPendingPharmacies();
    sendSuccess(res, pharmacies, "Pending pharmacies retrieved");
  } catch (error) {
    next(error);
  }
};

export const approvePharmacy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = approvePharmacySchema.parse(req.params);
    const pharmacy = await pharmacyService.approvePharmacy(id);
    sendSuccess(res, pharmacy, "Pharmacy approved successfully");
  } catch (error) {
    next(error);
  }
};

export const rejectPharmacy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = rejectPharmacySchema.parse({ ...req.params, ...req.body });
    const pharmacy = await pharmacyService.rejectPharmacy(id, req.body.reason);
    sendSuccess(res, pharmacy, "Pharmacy rejected successfully");
  } catch (error) {
    next(error);
  }
};

export const resubmitPharmacy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const validatedData = resubmitPharmacySchema.parse(req.body);
    const uploadedLogo = await uploadImage(req.file, "pharmacyLogo");
    const pharmacy = await pharmacyService.resubmitPharmacy(userId, {
      ...validatedData,
      ...(uploadedLogo
        ? {
            logo: uploadedLogo.secureUrl,
            logoPublicId: uploadedLogo.publicId,
          }
        : {}),
    });
    sendSuccess(res, pharmacy, "Pharmacy information resubmitted");
  } catch (error) {
    next(error);
  }
};

export const createPharmacy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    
    const uploadedLogo = await uploadImage(req.file, "pharmacyLogo");
    
    const pharmacyData = {
      ...req.body,
      logo: uploadedLogo?.secureUrl || null,
      logoPublicId: uploadedLogo?.publicId || null,
      // Convert numeric strings to numbers
      establishedYear: req.body.establishedYear ? parseInt(req.body.establishedYear) : undefined,
      staffCount: req.body.staffCount ? parseInt(req.body.staffCount) : undefined,
    };

    const pharmacy = await pharmacyService.createPharmacy(userId, pharmacyData);
    sendSuccess(res, pharmacy, "Pharmacy profile created successfully", 201);
  } catch (error) {
    next(error);
  }
};
