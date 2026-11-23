import mongoose from "mongoose";

import Order from "../models/Order.js";
import Table from "../models/Table.js";
import MenuItem from "../models/MenuItem.js";

const ACTIVE_ORDER_STATUSES = ["pending", "ready"];

// Create a new dine-in order
export const createOrder = async (req, res) => {
  let reservedTableId = null;

  try {
    const { table, items, notes = "" } = req.body;

    if (
      !table ||
      !mongoose.Types.ObjectId.isValid(table) ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid table and at least one order item are required.",
      });
    }

    if (typeof notes !== "string") {
      return res.status(400).json({
        success: false,
        message: "Order notes must be text.",
      });
    }

    const selectedTable = await Table.findOne({
      _id: table,
      isActive: true,
    });

    if (!selectedTable) {
      return res.status(404).json({
        success: false,
        message: "Table not found or inactive.",
      });
    }

    // Check for an existing active order, including older records.
    const existingOrder = await Order.findOne({
      table,
      orderStatus: { $in: ACTIVE_ORDER_STATUSES },
    });

    if (existingOrder) {
      return res.status(409).json({
        success: false,
        message: "This table already has an active order.",
      });
    }

    // Validate and calculate order items using database prices.
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      if (
        !item.menuItem ||
        !mongoose.Types.ObjectId.isValid(item.menuItem) ||
        !Number.isInteger(Number(item.quantity)) ||
        Number(item.quantity) < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid menu item or quantity.",
        });
      }

      const menuItem = await MenuItem.findOne({
        _id: item.menuItem,
        isAvailable: true,
      });

      if (!menuItem) {
        return res.status(400).json({
          success: false,
          message: "One or more menu items are unavailable.",
        });
      }

      const quantity = Number(item.quantity);
      const price = Number(menuItem.price);
      const itemSubtotal = Number((price * quantity).toFixed(2));

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        quantity,
        price,
        subtotal: itemSubtotal,
      });

      subtotal += itemSubtotal;
    }

    subtotal = Number(subtotal.toFixed(2));

    // Atomically reserve the table to prevent simultaneous orders.
    const reservedTable = await Table.findOneAndUpdate(
      {
        _id: table,
        isActive: true,
        isOccupied: { $ne: true },
      },
      {
        $set: { isOccupied: true },
      },
      {
        new: true,
      },
    );

    if (!reservedTable) {
      return res.status(409).json({
        success: false,
        message: "This table is no longer available.",
      });
    }

    reservedTableId = reservedTable._id;

    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const order = await Order.create({
      orderNumber,
      table: reservedTable._id,
      items: orderItems,
      subtotal,
      total: subtotal,
      orderStatus: "pending",
      paymentStatus: "unpaid",
      paidAmount: 0,
      notes: notes.trim(),
      createdBy: req.user._id,
    });
    reservedTableId = null;
    const populatedOrder = await Order.findById(order._id)
      .populate("table", "tableNumber capacity isOccupied")
      .populate("createdBy", "name")
      .populate("items.menuItem", "name");

    return res.status(201).json({
      success: true,
      message: "Order sent to kitchen successfully.",
      order: populatedOrder,
    });
  } catch (error) {
    // Release the table if order creation fails.
    if (reservedTableId) {
      await Table.findByIdAndUpdate(reservedTableId, {
        $set: { isOccupied: false },
      });
    }

    console.error("Create Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create order.",
    });
  }
};

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("table", "tableNumber capacity isOccupied")
      .populate("createdBy", "name")
      .populate("items.menuItem", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch orders.",
    });
  }
};
