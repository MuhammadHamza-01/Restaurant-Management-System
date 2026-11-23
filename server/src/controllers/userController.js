import User from "../models/User.js";
import { ROLES } from "../constants/roles.js";

const STAFF_ROLES = [
  ROLES.WAITER,
  ROLES.CHEF,
  ROLES.CASHIER,
];

// @desc    Create staff account
// @route   POST /api/v1/users
// @access  Admin
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and role are required.",
      });
    }

    if (password.length < 8) {
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
        message: "Email is already registered.",
      });
    }

    const user = await User.create({
      name,
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
        message: "Email is already registered.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create staff account.",
    });
  }
};

// @desc    Get all staff accounts
// @route   GET /api/v1/users
// @access  Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: STAFF_ROLES },
    })
      .select("-password")
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
      message: "Failed to fetch staff accounts.",
    });
  }
};

// @desc    Get staff account by ID
// @route   GET /api/v1/users/:id
// @access  Admin
export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      role: { $in: STAFF_ROLES },
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Staff account not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid staff ID.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch staff account.",
    });
  }
};

// @desc    Update staff account
// @route   PUT /api/v1/users/:id
// @access  Admin
export const updateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const user = await User.findOne({
      _id: req.params.id,
      role: { $in: STAFF_ROLES },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Staff account not found.",
      });
    }

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length < 3) {
        return res.status(400).json({
          success: false,
          message: "Name must contain at least 3 characters.",
        });
      }

      user.name = name.trim();
    }

    if (email !== undefined) {
      if (typeof email !== "string" || !email.trim()) {
        return res.status(400).json({
          success: false,
          message: "A valid email is required.",
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
          message: "Email is already registered.",
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
      message: "Staff account updated successfully.",
      user,
    });
  } catch (error) {
    console.error("Update staff error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid staff ID.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update staff account.",
    });
  }
};

// @desc    Activate or deactivate staff account
// @route   PATCH /api/v1/users/:id/status
// @access  Admin
export const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid isActive value.",
      });
    }

    const user = await User.findOne({
      _id: req.params.id,
      role: { $in: STAFF_ROLES },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Staff account not found.",
      });
    }

    user.isActive = isActive;

    await user.save();

    return res.status(200).json({
      success: true,
      message: `Staff account ${isActive ? "activated" : "deactivated"} successfully.`,
      user,
    });
  } catch (error) {
    console.error("Update staff status error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid staff ID.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update staff status.",
    });
  }
};