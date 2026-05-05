import { Router } from "express";
import authMiddleware, { UserRole } from "../../middleware/auth.middleware";
import * as analyticsController from "./analytics.controller";

export const adminAnalyticsRoutes = Router();
adminAnalyticsRoutes.get("/overview", authMiddleware(UserRole.ADMIN), analyticsController.getAdminOverview);
adminAnalyticsRoutes.get("/pharmacies", authMiddleware(UserRole.ADMIN), analyticsController.getAdminPharmacies);
adminAnalyticsRoutes.get("/medicines", authMiddleware(UserRole.ADMIN), analyticsController.getAdminMedicines);
adminAnalyticsRoutes.get("/sales-summary", authMiddleware(UserRole.ADMIN), analyticsController.getAdminSalesSummary);

export const pharmacyAnalyticsRoutes = Router();
const requirePharmacyAnalytics = [authMiddleware(UserRole.PHARMACY, UserRole.STAFF)];
pharmacyAnalyticsRoutes.get("/overview", ...requirePharmacyAnalytics, analyticsController.getPharmacyOverview);
pharmacyAnalyticsRoutes.get("/sales", ...requirePharmacyAnalytics, analyticsController.getPharmacySales);
pharmacyAnalyticsRoutes.get("/purchases", ...requirePharmacyAnalytics, analyticsController.getPharmacyPurchases);
pharmacyAnalyticsRoutes.get("/inventory", ...requirePharmacyAnalytics, analyticsController.getPharmacyInventory);
pharmacyAnalyticsRoutes.get("/payments", ...requirePharmacyAnalytics, analyticsController.getPharmacyPayments);
