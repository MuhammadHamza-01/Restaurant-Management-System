
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


export const updateKitchenOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const allowedTransitions = {
      pending: "preparing",
      preparing: "ready",
    };

    const nextStatus = allowedTransitions[order.orderStatus];

    if (!nextStatus || nextStatus !== orderStatus) {
      return res.status(400).json({
        success: false,
        message: `Cannot change order from ${order.orderStatus} to ${orderStatus}`,
      });
    }

    order.orderStatus = orderStatus;

    await order.save();

    return res.status(200).json({
      success: true,
      message: `Order moved to ${orderStatus}`,
      order,
    });
  } catch (error) {
    console.error("Update kitchen order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};
