import express from "express";

import {
  protect,
  authorize,
} from "../middlewares/authMiddleware.js";

import { ROLES } from "../constants/roles.js";

import {
  createStaffUser,
  updateStaffStatus,
  getAllStaffUsers,
  updateStaffUser,
} from "../controllers/adminController.js";

const router = express.Router();

// All admin routes require an authenticated admin
router.use(protect, authorize(ROLES.ADMIN));

// Admin dashboard
router.get("/dashboard", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Admin Dashboard",
    user: req.user.name,
  });
});

// Staff management
router.post("/staff", createStaffUser);
router.get("/staff", getAllStaffUsers);
router.patch("/staff/:id", updateStaffUser);
router.patch("/staff/:id/status", updateStaffStatus);

export default router;