import { Router } from "express";
import {
  demoLoginController,
  getMeController,
  removeProfileImageController,
  updateProfileImageController,
} from "./auth.controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { uploadUserAvatar } from "../../middleware/upload.middleware";

const authRoutes:Router = Router();

// GET /api/v1/auth/me — current user session
authRoutes.get("/me", getMeController);

authRoutes.put(
  "/profile-image",
  ...requireAuth,
  uploadUserAvatar,
  updateProfileImageController
);

authRoutes.delete(
  "/profile-image",
  ...requireAuth,
  removeProfileImageController
);

// POST /api/v1/auth/demo-login/:role — demo login
authRoutes.post("/demo-login/:role", demoLoginController);

export default authRoutes;
