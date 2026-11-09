
import express from "express";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import { ROLES } from "../constants/roles.js";

import {
  createMenuItem,
  getAllMenuItems,
  updateMenuItem,
  deleteMenuItem,
  updateMenuItemAvailability,
} from "../controllers/menuItemController.js";

const router = express.Router();

router.use(protect);

// Admin and staff can view menu items.
router.get("/", authorize(ROLES.ADMIN, ROLES.STAFF), getAllMenuItems);

// Only admin can manage menu items.
router.post("/", authorize(ROLES.ADMIN), createMenuItem);
router.patch("/:id", authorize(ROLES.ADMIN), updateMenuItem);
router.delete("/:id", authorize(ROLES.ADMIN), deleteMenuItem);
router.patch(
  "/:id/availability",
  authorize(ROLES.ADMIN),
  updateMenuItemAvailability
);

export default router;
