import cloudinary from "../config/claudinary.config";

// Extract public_id from a Cloudinary URL
export const extractPublicId = (url: string): string | null => {
  try {
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;

    const afterUpload = parts.slice(uploadIndex + 1);
    // skip version segment like v1234567
    const withoutVersion = afterUpload[0]?.startsWith("v")
      ? afterUpload.slice(1)
      : afterUpload;

    const publicIdWithExt = withoutVersion.join("/");
    return publicIdWithExt.replace(/\.[^/.]+$/, ""); // strip extension
  } catch {
    return null;
  }
};

export const deleteFromCloudinaryByPublicId = async (
  publicId?: string | null
): Promise<void> => {
  if (!publicId) {
    return;
  }
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    // Log but don't throw — failed delete should not break the main operation
    console.error(`[Cloudinary] Failed to delete ${publicId}:`, error);
  }
};

// Delete a single image from Cloudinary by URL
export const deleteFromCloudinary = async (url: string): Promise<void> => {
  const publicId = extractPublicId(url);
  if (!publicId) {
    console.warn(`[Cloudinary] Could not extract public_id from: ${url}`);
    return;
  }
  await deleteFromCloudinaryByPublicId(publicId);
};

// Delete multiple images from Cloudinary
export const deleteMultipleFromCloudinary = async (urls: string[]): Promise<void> => {
  const validUrls = urls.filter(Boolean);
  if (validUrls.length === 0) return;
  await Promise.all(validUrls.map(deleteFromCloudinary));
};
