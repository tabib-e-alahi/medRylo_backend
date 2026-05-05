import multer from "multer";

export const MAX_IMAGE_SIZE = 1 * 1024 * 1024;

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const imageFileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (allowedMimeTypes.has(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new Error("Only JPG, PNG, and WEBP image files are allowed."));
};

export const imageMemoryUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFileFilter,
  limits: { fileSize: MAX_IMAGE_SIZE },
});

export const medicineImageUpload = imageMemoryUpload;
export const pharmacyLogoUpload = imageMemoryUpload;
export const userAvatarUpload = imageMemoryUpload;
