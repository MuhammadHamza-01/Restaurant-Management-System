import express from "express";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

router.get("/dashboard", protect, authorize(ROLES.CHEF), (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Kitchen Dashboard",
  });
});

export default router;
