import User from "../models/User.js";
import { ROLES } from "../constants/roles.js";

const STAFF_ROLES = [
  ROLES.STAFF,
  ROLES.CHEF,
  ROLES.DELIVERY,
];

// Create a staff account
export const createStaffUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Validate staff role
    if (!STAFF_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid staff role.",
      });
    }

    // Validate password
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
    }

    // Check existing email
    const existingUser = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    // Create staff account
    const user = await User.create({
      name,
      email: email.trim().toLowerCase(),
      password,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "Staff account created successfully.",
      user,
    });
  } catch (error) {
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

// Activate or deactivate a staff account
export const updateStaffStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const { id } = req.params;

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
      { isActive },
      { new: true, runValidators: true }
    );

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
    return res.status(500).json({
      success: false,
      message: "Unable to update staff account status.",
    });
  }
};


// Get all staff members
export const getAllStaffUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: STAFF_ROLES },
    })
      .select("name email role isActive createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
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
    const { name, email, role } = req.body;

    // Validate required fields
    if (!name || !email || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email and role are required.",
      });
    }

    // Validate name
    if (name.trim().length < 3 || name.trim().length > 50) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 3 and 50 characters.",
      });
    }

    // Validate role
    if (!STAFF_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid staff role.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if email belongs to another account
    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: id },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // Update staff account
    const user = await User.findOneAndUpdate(
      {
        _id: id,
        role: { $in: STAFF_ROLES },
      },
      {
        name: name.trim(),
        email: normalizedEmail,
        role,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Staff account not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Staff information updated successfully.",
      user,
    });

  } catch (error) {
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

