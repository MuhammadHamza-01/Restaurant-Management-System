import mongoose from "mongoose";
import Table from "../models/Table.js";
import Order from "../models/Order.js";

const ACTIVE_ORDER_STATUSES = ["pending", "ready"];

// Create a new table
export const createTable = async (req, res) => {
  try {
    const { tableNumber, capacity } = req.body;

    if (
      typeof tableNumber !== "string" ||
      !tableNumber.trim() ||
      capacity === undefined ||
      !Number.isInteger(Number(capacity)) ||
      Number(capacity) < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "A table number and valid capacity are required.",
      });
    }

    const table = await Table.create({
      tableNumber: tableNumber.trim(),
      capacity: Number(capacity),
    });

    return res.status(201).json({
      success: true,
      message: "Table created successfully.",
      table,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Table number already exists.",
      });
    }

    console.error("Create Table Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create table.",
    });
  }
};

// Get all tables
export const getAllTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tables.length,
      tables,
    });
  } catch (error) {
    console.error("Get Tables Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch tables.",
    });
  }
};

// Update table details
export const updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    const { tableNumber, capacity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid table ID.",
      });
    }

    const table = await Table.findById(id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found.",
      });
    }

    if (tableNumber !== undefined) {
      if (
        typeof tableNumber !== "string" ||
        !tableNumber.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Table number cannot be empty.",
        });
      }

      table.tableNumber = tableNumber.trim();
    }

    if (capacity !== undefined) {
      if (
        !Number.isInteger(Number(capacity)) ||
        Number(capacity) < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Capacity must be a positive whole number.",
        });
      }

      table.capacity = Number(capacity);
    }

    await table.save();

    return res.status(200).json({
      success: true,
      message: "Table updated successfully.",
      table,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Table number already exists.",
      });
    }

    console.error("Update Table Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update table.",
    });
  }
};

// Activate or deactivate a table
export const updateTableStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid table ID.",
      });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be true or false.",
      });
    }

    const table = await Table.findById(id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found.",
      });
    }

    if (!isActive && table.isOccupied) {
      return res.status(409).json({
        success: false,
        message: "An occupied table cannot be deactivated.",
      });
    }

    table.isActive = isActive;
    await table.save();

    return res.status(200).json({
      success: true,
      message: `Table ${isActive ? "activated" : "deactivated"} successfully.`,
      table,
    });
  } catch (error) {
    console.error("Update Table Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update table status.",
    });
  }
};

// Delete a table
export const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid table ID.",
      });
    }

    const table = await Table.findById(id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found.",
      });
    }

    const activeOrder = await Order.findOne({
      table: id,
      orderStatus: { $in: ACTIVE_ORDER_STATUSES },
    });

    if (table.isOccupied || activeOrder) {
      return res.status(409).json({
        success: false,
        message: "A table with an active order cannot be deleted.",
      });
    }

    await table.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Table deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Table Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete table.",
    });
  }
};