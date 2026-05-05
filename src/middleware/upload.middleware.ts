import { Request, Response, NextFunction } from "express";
import { medicineImageUpload, pharmacyLogoUpload, userAvatarUpload } from "../config/multer.config";
import { BadRequestError } from "../errors/AppError";

const normalizeUploadError = (err: unknown) => {
  if (!err) return null;
  if (err instanceof Error && err.message.includes("File too large")) {
    return new BadRequestError("Image size must be 1 MB or less.");
  }
  if (err instanceof Error) return new BadRequestError(err.message);
  return new BadRequestError("Invalid image upload.");
};

// ── Medicine image (single field: "image") ────────────────
export const uploadMedicineImage = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  medicineImageUpload.single("image")(req, res, (err) => {
    const uploadError = normalizeUploadError(err);
    if (uploadError) return next(uploadError);
    next();
  });
};

// optional variant (for updates — image may not be resent)
export const uploadMedicineImageOptional = uploadMedicineImage;

// ── Pharmacy logo (single field: "logo") ──────────────────
export const uploadPharmacyLogo = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  pharmacyLogoUpload.single("logo")(req, res, (err) => {
    const uploadError = normalizeUploadError(err);
    if (uploadError) return next(uploadError);
    next();
  });
};

export const uploadPharmacyLogoOptional = uploadPharmacyLogo;

// ── User avatar (single field: "avatar") ──────────────────
export const uploadUserAvatar = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  userAvatarUpload.single("avatar")(req, res, (err) => {
    const uploadError = normalizeUploadError(err);
    if (uploadError) return next(uploadError);
    next();
  });
};
