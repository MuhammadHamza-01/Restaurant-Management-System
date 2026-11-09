
import express from "express";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import { ROLES } from "../constants/roles.js";

import {
  createTable,
  getAllTables,
  updateTable,
  updateTableStatus,
  deleteTable,
} from "../controllers/tableController.js";

const router = express.Router();

router.use(protect);

// Admin and staff can view tables.
router.get("/", authorize(ROLES.ADMIN, ROLES.STAFF), getAllTables);

// Only admin can manage tables.
router.post("/", authorize(ROLES.ADMIN), createTable);
router.patch("/:id", authorize(ROLES.ADMIN), updateTable);
router.patch("/:id/status", authorize(ROLES.ADMIN), updateTableStatus);
router.delete("/:id", authorize(ROLES.ADMIN), deleteTable);

export default router;
