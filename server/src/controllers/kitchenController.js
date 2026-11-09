
import Order from "../models/Order.js";

// Get all active kitchen orders
export const getKitchenOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      orderStatus: { $in: ["pending", "preparing", "ready"] },
    })
      .populate("table", "tableNumber")
      .populate("createdBy", "name")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch kitchen orders",
    });
  }
};

// Update kitchen order status
export const updateKitchenOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const allowedNextStatus = {
      pending: "preparing",
      preparing: "ready",
    };

    if (!["preparing", "ready"].includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid kitchen order status",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (allowedNextStatus[order.orderStatus] !== orderStatus) {
      return res.status(400).json({
        success: false,
        message: `Cannot move order from ${order.orderStatus} to ${orderStatus}`,
      });
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};
