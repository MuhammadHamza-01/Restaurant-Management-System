
import express from "express";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import { ROLES } from "../constants/roles.js";

import {
  updateBill,
  createPayment,
  getOrderPayments,
} from "../controllers/billingController.js";

const router = express.Router();

// Only admin and staff can manage billing
router.use(protect, authorize(ROLES.ADMIN, ROLES.STAFF));

// Update discount and service charge
router.patch("/orders/:id", updateBill);

// Record a payment
router.post("/orders/:id/payments", createPayment);

// Get payment history
router.get("/orders/:id/payments", getOrderPayments);

export default router;
