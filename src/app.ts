import express, { Application } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import envConfig from "./config/route.config";
import router from "./router/centralRoutes";
import notFoundHandler from "./middleware/notFoundHandler";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app: Application = express();

app.use(
  cors({
    origin: [
      envConfig.FRONTEND_URL || "http://localhost:3000",
      envConfig.BACKEND_BASE_URL || "http://localhost:5000",
      "http://localhost:3000",
      "http://localhost:5000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "x-intended-role"],
  })
);


app.all("/api/auth/*splat", toNodeHandler(auth));

// ── Body parsing ──────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Health check ──────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", env: envConfig.NODE_ENV, ts: new Date().toISOString() });
});


app.use("/api/v1", router);


app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
