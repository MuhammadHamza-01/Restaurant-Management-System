import express from "express";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import { ROLES } from "../constants/roles.js";

import {
  getKitchenOrders,
  updateKitchenOrderStatus,
} from "../controllers/kitchenController.js";

const router = express.Router();

// Protect all kitchen routes
router.use(protect, authorize(ROLES.ADMIN, ROLES.CHEF));

// Get active kitchen orders
router.get("/orders", getKitchenOrders);

// Update order preparation status
router.patch("/orders/:id/status", updateKitchenOrderStatus);

export default router;