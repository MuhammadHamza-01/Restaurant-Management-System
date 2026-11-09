
import express from "express";

import { protect, authorize } from "../middlewares/authMiddleware.js";
import { ROLES } from "../constants/roles.js";

import {
  createOrder,
  getAllOrders,
} from "../controllers/orderController.js";

const router = express.Router();

// Only authorized restaurant users can access orders
router.use(
  protect,
  authorize(ROLES.ADMIN, ROLES.STAFF)
);

router.post("/", createOrder);
router.get("/", getAllOrders);

export default router;
