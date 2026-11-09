
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

// Only authenticated admins can manage restaurant tables
router.use(protect, authorize(ROLES.ADMIN));

router.post("/", createTable);
router.get("/", getAllTables);
router.patch("/:id", updateTable);
router.patch("/:id/status", updateTableStatus);
router.delete("/:id", deleteTable);

export default router;
