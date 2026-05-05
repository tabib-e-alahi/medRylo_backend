import { Request, Response, NextFunction } from "express";
import { makeSignature } from "better-auth/crypto";
import { getMe, demoLogin, removeProfileImage, updateProfileImage } from "./auth.service";
import { demoLoginParamsSchema } from "./auth.validation";
import { sendSuccess } from "../../utils/sendResponse";
import envConfig from "../../config/route.config";
import { BadRequestError } from "../../errors/AppError";
import { uploadImage } from "../uploads/upload.service";

/**
 * GET /api/v1/auth/me
 * Returns the current authenticated user and session info
 */
export const getMeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await getMe(req.headers);
    sendSuccess(res, data, "User retrieved successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/auth/demo-login/:role
 * Signs in as a demo user (creates if needed)
 * Returns set-cookie header for session
 */
export const demoLoginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role } = demoLoginParamsSchema.parse(req.params);

    const signInResult = await demoLogin(role);

    // Better Auth signInEmail returns { token, user } 
    // We need to set the session cookie manually since we're using the internal API
    if (signInResult && typeof signInResult === "object" && "token" in signInResult) {
      const token = (signInResult as any).token;
      const signedToken = `${token}.${await makeSignature(token, envConfig.BETTER_AUTH_SECRET)}`;
      const isProduction = envConfig.NODE_ENV === "production";

      res.cookie("session_token", signedToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }

    // Get user data to return
    const userData = signInResult && typeof signInResult === "object" && "user" in signInResult
      ? (signInResult as any).user
      : null;

    sendSuccess(
      res,
      {
        user: userData
          ? {
              id: userData.id,
              name: userData.name,
              email: userData.email,
              role: userData.role,
            }
          : null,
      },
      `Demo ${role} login successful`
    );
  } catch (error) {
    next(error);
  }
};

export const updateProfileImageController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const uploadedImage = await uploadImage(req.file, "userAvatar");
    if (!uploadedImage) {
      throw new BadRequestError("Profile image is required.");
    }

    const user = await updateProfileImage(req.user.id, uploadedImage);
    sendSuccess(res, user, "Profile image updated successfully");
  } catch (error) {
    next(error);
  }
};

export const removeProfileImageController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await removeProfileImage(req.user.id);
    sendSuccess(res, user, "Profile image removed successfully");
  } catch (error) {
    next(error);
  }
};
