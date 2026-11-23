import User from "../models/User.js";
import { setTokenCookie } from "../utils/setTokenCookie.js";

// @desc    Public registration disabled
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req, res) => {
  return res.status(403).json({
    success: false,
    message: "Public registration is disabled. Contact your administrator.",
  });
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

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed.",
    });
  }
};

// @desc    Get currently logged-in user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req, res) => {
  return res.status(200).json({
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