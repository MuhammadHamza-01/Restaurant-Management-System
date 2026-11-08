import User from "../models/User.js";
import { ROLES } from "../constants/roles.js";
import { setTokenCookie } from "../utils/setTokenCookie.js";

// @desc    Register a new customer
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and password.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: ROLES.CUSTOMER,
    });

    setTokenCookie(res, user._id);

    res.status(201).json({
      success: true,
      message: "Account registered successfully.",
      user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Registration failed.",
    });
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated.",
      });
    }

    user.lastLoginAt = new Date();
    await user.save();

    setTokenCookie(res, user._id);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed.",
    });
  }
};

// @desc    Get currently logged-in user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Public
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};
