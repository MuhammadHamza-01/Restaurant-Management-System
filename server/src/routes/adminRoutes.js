import express from "express";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import { ROLES } from "../constants/roles.js";
import {
  createStaffUser,
  updateStaffStatus,
  getAllStaffUsers,
  updateStaffUser
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/dashboard", protect, authorize(ROLES.ADMIN), (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Admin Dashboard",
    user: req.user.name,
  });
});

router.post("/staff", protect, authorize(ROLES.ADMIN), createStaffUser);
router.get("/staff", protect, authorize(ROLES.ADMIN), getAllStaffUsers);
router.patch("/staff/:id/status",protect,authorize(ROLES.ADMIN),updateStaffStatus,);
router.patch("/staff/:id",protect,authorize(ROLES.ADMIN),updateStaffUser);

export default router;
