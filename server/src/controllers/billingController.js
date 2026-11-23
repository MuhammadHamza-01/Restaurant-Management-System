
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";

// Update bill adjustments
export const updateBill = async (req, res) => {
  try {
    const { id } = req.params;
    const { discount, serviceCharge } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (["completed", "cancelled"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "This order's bill can no longer be changed",
      });
    }

    if (order.paidAmount > 0) {
      return res.status(400).json({
        success: false,
        message: "Bill cannot be changed after receiving payment",
      });
    }

    const newDiscount =
      discount !== undefined ? Number(discount) : order.discount;

    const newServiceCharge =
      serviceCharge !== undefined
        ? Number(serviceCharge)
        : order.serviceCharge;

    if (
      !Number.isFinite(newDiscount) ||
      !Number.isFinite(newServiceCharge) ||
      newDiscount < 0 ||
      newServiceCharge < 0 ||
      newDiscount > order.subtotal
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid discount or service charge",
      });
    }

    order.discount = newDiscount;
    order.serviceCharge = newServiceCharge;
    order.total = Number(
      (order.subtotal - newDiscount + newServiceCharge).toFixed(2)
    );

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Bill updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update bill error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update bill",
    });
  }
};

// Record a payment
export const createPayment = async (req, res) => {
  let payment;

  try {
    const { id } = req.params;
    const { amount, method, reference } = req.body;

    const paymentAmount = Number(amount);

    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid payment amount",
      });
    }

    if (!["cash", "card", "bank_transfer"].includes(method)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Customers pay at the counter after their order is ready.
    if (order.orderStatus !== "ready") {
      return res.status(400).json({
        success: false,
        message: "Only ready orders can receive payment",
      });
    }

    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "This order has already been fully paid",
      });
    }

    const currentPaidAmount = Number(order.paidAmount || 0);

    const remainingBalance = Number(
      (order.total - currentPaidAmount).toFixed(2)
    );

    if (remainingBalance <= 0) {
      return res.status(400).json({
        success: false,
        message: "No remaining balance",
      });
    }

    if (paymentAmount > remainingBalance) {
      return res.status(400).json({
        success: false,
        message: `Remaining balance is Rs. ${remainingBalance}`,
      });
    }

    const newPaidAmount = Number(
      (currentPaidAmount + paymentAmount).toFixed(2)
    );

    const isFullyPaid = newPaidAmount >= order.total;

    // Create the payment record first.
    payment = await Payment.create({
      order: order._id,
      amount: paymentAmount,
      method,
      reference: reference || "",
      receivedBy: req.user._id,
    });

    // Compare-and-set prevents two simultaneous payments from
    // overwriting each other's balance updates.
    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id: order._id,
        orderStatus: "ready",
        paymentStatus: { $ne: "paid" },
        paidAmount: currentPaidAmount,
      },
      {
        $set: {
          paidAmount: newPaidAmount,
          paymentStatus: isFullyPaid ? "paid" : "partial",
          orderStatus: isFullyPaid ? "completed" : "ready",
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedOrder) {
      await Payment.deleteOne({ _id: payment._id });
      payment = null;

      return res.status(409).json({
        success: false,
        message: "This order was updated by another request. Refresh and try again.",
      });
    }

    return res.status(201).json({
      success: true,
      message: isFullyPaid
        ? "Payment received. Order completed successfully."
        : "Partial payment received successfully.",
      payment,
      order: updatedOrder,
      paidAmount: updatedOrder.paidAmount,
      remainingBalance: Number(
        (updatedOrder.total - updatedOrder.paidAmount).toFixed(2)
      ),
      paymentStatus: updatedOrder.paymentStatus,
    });
  } catch (error) {
    // Avoid leaving a payment record if the order update fails.
    if (payment?._id) {
      await Payment.deleteOne({ _id: payment._id }).catch((cleanupError) => {
        console.error("Payment cleanup error:", cleanupError);
      });
    }

    console.error("Create payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to record payment",
    });
  }
};

// Get payment history for an order
export const getOrderPayments = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const payments = await Payment.find({ order: id })
      .populate("receivedBy", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error("Get payments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payment history",
    });
  }
};
