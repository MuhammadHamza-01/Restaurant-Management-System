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

// All category routes require admin authentication
router.use(protect, authorize(ROLES.ADMIN));

router.post("/", createCategory);
router.get("/", getAllCategories);
router.patch("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
