
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

// All menu item routes require admin authentication
router.use(protect, authorize(ROLES.ADMIN));

router.post("/", createMenuItem);
router.get("/", getAllMenuItems);
router.patch("/:id", updateMenuItem);
router.delete("/:id", deleteMenuItem);
router.patch("/:id/availability", updateMenuItemAvailability);

export default router;
 