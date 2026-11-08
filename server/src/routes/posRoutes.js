import express from "express";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  authorize(ROLES.ADMIN, ROLES.STAFF),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome to POS Dashboard",
    });
  },
);

export default router;
