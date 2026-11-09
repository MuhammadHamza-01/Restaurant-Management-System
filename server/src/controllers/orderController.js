import mongoose from "mongoose";

import Order from "../models/Order.js";
import Table from "../models/Table.js";
import MenuItem from "../models/MenuItem.js";

// Create a new dine-in order
export const createOrder = async (req, res) => {
  try {
    const { table, items, notes } = req.body;

    // Validate required fields
    if (!table || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Table and order items are required.",
      });
    }

    // Validate table ID
    if (!mongoose.Types.ObjectId.isValid(table)) {
      return res.status(400).json({
        success: false,
        message: "Invalid table ID.",
      });
    }

    // Find active table
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

    // Check whether the table already has an active order
    const existingOrder = await Order.findOne({
      table,
      orderStatus: {
        $in: ["pending", "preparing", "ready", "served"],
      },
    });

    if (existingOrder) {
      return res.status(409).json({
        success: false,
        message: "This table already has an active order.",
      });
    }

    // Validate and calculate order items
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
      const itemSubtotal = menuItem.price * quantity;

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        quantity,
        price: menuItem.price,
        subtotal: itemSubtotal,
      });

      subtotal += itemSubtotal;
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`;

    // Save order
    const order = await Order.create({
      orderNumber,
      table: selectedTable._id,
      items: orderItems,
      subtotal,
      total: subtotal,
      notes: notes || "",
      createdBy: req.user._id,
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("table", "tableNumber capacity")
      .populate("createdBy", "name");

    return res.status(201).json({
      success: true,
      message: "Order created successfully.",
      order: populatedOrder,
    });
  } catch (error) {
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
      .populate("table", "tableNumber capacity")
      .populate("createdBy", "name")
      .populate("items.menuItem", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch orders.",
    });
  }
};
