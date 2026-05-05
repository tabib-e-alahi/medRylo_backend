import sharp from "sharp";
import cloudinary from "../../config/claudinary.config";
import { BadRequestError } from "../../errors/AppError";

type UploadPreset = "medicine" | "pharmacyLogo" | "userAvatar";

type UploadResult = {
  secureUrl: string;
  publicId: string;
};

const presets: Record<
  UploadPreset,
  { folder: string; width: number; height?: number; fit: keyof sharp.FitEnum }
> = {
  medicine: {
    folder: "meditrack/medicines",
    width: 900,
    fit: "inside",
  },
  pharmacyLogo: {
    folder: "meditrack/pharmacy/logos",
    width: 480,
    height: 480,
    fit: "inside",
  },
  userAvatar: {
    folder: "meditrack/users/avatars",
    width: 320,
    height: 320,
    fit: "cover",
  },
};

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

async function processImage(file: Express.Multer.File, preset: UploadPreset) {
  if (!allowedMimeTypes.has(file.mimetype)) {
    throw new BadRequestError("Only JPG, PNG, and WEBP image files are allowed.");
  }

  const config = presets[preset];
  const pipeline = sharp(file.buffer, { failOn: "warning" })
    .rotate()
    .resize({
      width: config.width,
      height: config.height,
      fit: config.fit,
      withoutEnlargement: true,
    })
    .webp({ quality: 82 });

  return pipeline.toBuffer();
}

export async function uploadImage(
  file: Express.Multer.File | undefined,
  preset: UploadPreset
): Promise<UploadResult | null> {
  if (!file) return null;

  const buffer = await processImage(file, preset);
  const folder = presets[preset].folder;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        format: "webp",
      },
      (error, result) => {
        if (error || !result) {
          reject(new BadRequestError("Image upload failed. Please try again."));
          return;
        }

        resolve({
          secureUrl: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    stream.end(buffer);
  });
}
