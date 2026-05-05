import { Router } from "express";
import * as publicDiscoveryController from "./public-discovery.controller";

const publicDiscoveryRoutes = Router();

publicDiscoveryRoutes.get("/medicine-filters", publicDiscoveryController.getMedicineFilters);
publicDiscoveryRoutes.get("/medicines", publicDiscoveryController.getMedicines);
publicDiscoveryRoutes.get("/medicines/:id", publicDiscoveryController.getMedicineDetails);
publicDiscoveryRoutes.get("/pharmacies", publicDiscoveryController.getPharmacies);
publicDiscoveryRoutes.get("/pharmacies/:id", publicDiscoveryController.getPharmacyDetails);

export default publicDiscoveryRoutes;
