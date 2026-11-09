
import express from "express";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import { ROLES } from "../constants/roles.js";

import {
  createOrder,
  getAllOrders,
  markOrderAsServed,
} from "../controllers/orderController.js";

const router = express.Router();

router.use(protect, authorize(ROLES.ADMIN, ROLES.STAFF));

router.post("/", createOrder);
router.get("/", getAllOrders);
router.patch("/:id/serve", markOrderAsServed);

export default router;
