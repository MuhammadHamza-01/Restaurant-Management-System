
import express from "express";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import { ROLES } from "../constants/roles.js";

import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.use(protect);

// Admin and staff can view categories.
router.get("/", authorize(ROLES.ADMIN, ROLES.STAFF), getAllCategories);

// Only admin can manage categories.
router.post("/", authorize(ROLES.ADMIN), createCategory);
router.patch("/:id", authorize(ROLES.ADMIN), updateCategory);
router.delete("/:id", authorize(ROLES.ADMIN), deleteCategory);

export default router;
