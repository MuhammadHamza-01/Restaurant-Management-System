import mongoose from "mongoose";
import User from "../models/User.js";
import { ROLES } from "../constants/roles.js";

const STAFF_ROLES = [
  ROLES.WAITER,
  ROLES.CHEF,
  ROLES.CASHIER,
];

// Create a staff account
export const createStaffUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and role are required.",
      });
    }

    if (typeof name !== "string" || name.trim().length < 3 || name.trim().length > 50) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 3 and 50 characters.",
      });
    }

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email.",
      });
    }

    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
    }

    if (!STAFF_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid staff role.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "Staff account created successfully.",
      user,
    });
  } catch (error) {
    console.error("Create staff error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create staff account.",
    });
  }
};

// Get all staff members
export const getAllStaffUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: STAFF_ROLES },
    })
      .select("name email role isActive createdAt lastLoginAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get staff error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch staff members.",
    });
  }
};

// Update staff information
export const updateStaffUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid staff ID.",
      });
    }

    const user = await User.findOne({
      _id: id,
      role: { $in: STAFF_ROLES },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Staff account not found.",
      });
    }

    if (name !== undefined) {
      if (
        typeof name !== "string" ||
        name.trim().length < 3 ||
        name.trim().length > 50
      ) {
        return res.status(400).json({
          success: false,
          message: "Name must be between 3 and 50 characters.",
        });
      }

      user.name = name.trim();
    }

    if (email !== undefined) {
      if (typeof email !== "string" || !email.trim()) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid email.",
        });
      }

      const normalizedEmail = email.trim().toLowerCase();

      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email already exists.",
        });
      }

      user.email = normalizedEmail;
    }

    if (role !== undefined) {
      if (!STAFF_ROLES.includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid staff role.",
        });
      }

      user.role = role;
    }

    if (password !== undefined) {
      if (typeof password !== "string" || password.length < 8) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 8 characters.",
        });
      }

      user.password = password;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Staff information updated successfully.",
      user,
    });
  } catch (error) {
    console.error("Update staff error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to update staff information.",
    });
  }
};

// Activate or deactivate a staff account
export const updateStaffStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid staff ID.",
      });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be true or false.",
      });
    }

    const user = await User.findOneAndUpdate(
      {
        _id: id,
        role: { $in: STAFF_ROLES },
      },
      { $set: { isActive } },
      {
        new: true,
        runValidators: true,
      }
    ).select("name email role isActive");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Staff account not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Staff account ${isActive ? "activated" : "deactivated"} successfully.`,
      user,
    });
  } catch (error) {
    console.error("Update staff status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update staff account status.",
    });
  }
};