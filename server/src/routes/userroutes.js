import express from "express";

import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  updateUserStatus,
} from "../controllers/userController.js";

import {
  protect,
  authorize,
} from "../middlewares/authMiddleware.js";

import { ROLES } from "../constants/roles.js";

const router = express.Router();

// All staff-management routes require admin access
router.use(protect, authorize(ROLES.ADMIN));

router.route("/")
  .post(createUser)
  .get(getAllUsers);

router.route("/:id")
  .get(getUserById)
  .put(updateUser);

router.patch("/:id/status", updateUserStatus);

export default router;