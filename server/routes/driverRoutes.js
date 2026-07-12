import express from "express";

import {
  createDriver,
  getDrivers,
  getAvailableDrivers,
  getDriverById,
  updateDriver,
} from "../controllers/driverController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// =====================================
// GET Routes
// =====================================

// GET /api/drivers
router.get("/", protect, getDrivers);

// GET /api/drivers/available
router.get("/available", protect, getAvailableDrivers);

// GET /api/drivers/:id
router.get("/:id", protect, getDriverById);

// =====================================
// POST Routes
// =====================================

// Fleet Manager & Safety Officer
router.post(
  "/",
  protect,
  authorize("FLEET_MANAGER", "SAFETY_OFFICER"),
  createDriver
);

// =====================================
// PATCH Routes
// =====================================

// Fleet Manager & Safety Officer
router.patch(
  "/:id",
  protect,
  authorize("FLEET_MANAGER", "SAFETY_OFFICER"),
  updateDriver
);

export default router;