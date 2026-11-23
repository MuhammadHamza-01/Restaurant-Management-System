import express from "express";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import { ROLES } from "../constants/roles.js";

import {
  createOrder,
  getAllOrders,
} from "../controllers/orderController.js";

const router = express.Router();

router.use(protect);

// Only Admin and Waiter can create dine-in orders.
router.post("/", authorize(ROLES.ADMIN, ROLES.WAITER), createOrder);

// Admin, Waiter and Cashier can view orders.
router.get(
  "/",
  authorize(ROLES.ADMIN, ROLES.WAITER, ROLES.CASHIER),
  getAllOrders
);

export default router;