
import Table from "../models/Table.js";

// Create a new table
export const createTable = async (req, res) => {
  try {
    const { tableNumber, capacity } = req.body;

    if (!tableNumber || !capacity) {
      return res.status(400).json({
        success: false,
        message: "Table number and capacity are required.",
      });
    }

    if (Number(capacity) < 1 || !Number.isInteger(Number(capacity))) {
      return res.status(400).json({
        success: false,
        message: "Capacity must be a positive whole number.",
      });
    }

    const existingTable = await Table.findOne({
      tableNumber: tableNumber.trim(),
    });

    if (existingTable) {
      return res.status(409).json({
        success: false,
        message: "Table number already exists.",
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

    const table = await Table.findById(id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found.",
      });
    }

    if (tableNumber !== undefined) {
      if (typeof tableNumber !== "string" || tableNumber.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Table number cannot be empty.",
        });
      }

      table.tableNumber = tableNumber.trim();
    }

    if (capacity !== undefined) {
      if (!Number.isInteger(Number(capacity)) || Number(capacity) < 1) {
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

    return res.status(500).json({
      success: false,
      message: "Unable to update table.",
    });
  }
};

// Activate or deactivate table
export const updateTableStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be true or false.",
      });
    }

    const table = await Table.findByIdAndUpdate(
      id,
      { isActive },
      { new: true, runValidators: true }
    );

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Table ${isActive ? "activated" : "deactivated"} successfully.`,
      table,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update table status.",
    });
  }
};

// Delete table
export const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;

    const table = await Table.findByIdAndDelete(id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Table deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete table.",
    });
  }
};
