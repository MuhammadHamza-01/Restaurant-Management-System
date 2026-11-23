
import Order from "../models/Order.js";

// Get active kitchen orders
export const getKitchenOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      orderStatus: {
        $in: ["pending", "preparing", "ready"],
      },
    })
      .populate("table", "tableNumber")
      .populate("createdBy", "name")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get kitchen orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch kitchen orders",
    });
  }
};

// Chef marks an order as ready
export const updateKitchenOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    if (orderStatus !== "ready") {
      return res.status(400).json({
        success: false,
        message: "Chef can only mark orders as ready",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Support existing legacy preparing orders.
    // New orders will move directly from pending to ready.
    if (!["pending", "preparing"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot mark an order as ready from ${order.orderStatus}`,
      });
    }

    order.orderStatus = "ready";

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order marked as ready",
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
