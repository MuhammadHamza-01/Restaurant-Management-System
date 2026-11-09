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

    // Do not change the bill after receiving payment
    if (order.paidAmount > 0) {
      return res.status(400).json({
        success: false,
        message: "Bill cannot be changed after receiving payment",
      });
    }

    const newDiscount =
      discount !== undefined ? Number(discount) : order.discount;

    const newServiceCharge =
      serviceCharge !== undefined ? Number(serviceCharge) : order.serviceCharge;

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
    order.total = order.subtotal - newDiscount + newServiceCharge;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Bill updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update bill",
    });
  }
};

// Record a payment
export const createPayment = async (req, res) => {
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

    const remainingBalance = order.total - order.paidAmount;

    if (paymentAmount > remainingBalance) {
      return res.status(400).json({
        success: false,
        message: `Remaining balance is Rs. ${remainingBalance}`,
      });
    }

    const payment = await Payment.create({
      order: order._id,
      amount: paymentAmount,
      method,
      reference: reference || "",
      receivedBy: req.user._id,
    });

    order.paidAmount += amount;

    if (order.paidAmount >= order.total) {
      order.paidAmount = order.total;
      order.paymentStatus = "paid";

      // Complete the order after full payment.
      order.orderStatus = "completed";
    } else {
      order.paymentStatus = "partial";
    }

    
    if (order.orderStatus !== "served") {
      return res.status(400).json({
        success: false,
        message: "Only served orders can receive payments",
      });
    }
    await order.save();

    res.status(201).json({
      success: true,
      message: "Payment recorded successfully",
      payment,
      paidAmount: order.paidAmount,
      remainingBalance: order.total - order.paidAmount,
      paymentStatus: order.paymentStatus,
    });
  } catch (error) {
    res.status(500).json({
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

    res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment history",
    });
  }
};
