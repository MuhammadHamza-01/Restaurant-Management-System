import crypto from "crypto";
import mongoose from "mongoose";

import User from "../models/User.js";
import Session from "../models/Session.js";

import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  getRefreshTokenExpiry,
} from "../utils/generateToken.js";

// Compare hashes safely
const safeCompare = (a, b) => {
  const bufferA = Buffer.from(a, "hex");
  const bufferB = Buffer.from(b, "hex");

  if (bufferA.length !== bufferB.length) return false;

  return crypto.timingSafeEqual(bufferA, bufferB);
};

// Extract session ID from refresh token
const extractSessionId = (token) => {
  if (typeof token !== "string") return null;

  const [sessionId, secret, ...extra] = token.split(".");

  if (
    !sessionId ||
    !secret ||
    extra.length ||
    !mongoose.Types.ObjectId.isValid(sessionId)
  ) {
    return null;
  }

  return sessionId;
};

// Generate authentication credentials for a session
const createSessionCredentials = async (user, session = null) => {
  const currentSession =
    session || new Session({ user: user._id });

  const refreshToken = generateRefreshToken(
    currentSession._id.toString()
  );

  currentSession.refreshTokenHash = hashToken(refreshToken);
  currentSession.expiresAt = getRefreshTokenExpiry();

  await currentSession.save();

  return {
    accessToken: generateAccessToken(user),
    refreshToken,
    sessionId: currentSession._id.toString(),
  };
};

// 1. Register a new customer
export const registerUser = async ({ name, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new Error("An account with this email already exists");
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    role: "customer",
  });

  return user;
};

// 2. Login user and create session
export const loginUser = async ({
  email,
  password,
  userAgent,
  ipAddress,
}) => {
  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    throw new Error("Your account has been deactivated");
  }

  user.lastLoginAt = new Date();
  await user.save();

  const session = new Session({
    user: user._id,
    userAgent: userAgent || null,
    ipAddress: ipAddress || null,
  });

  const credentials = await createSessionCredentials(
    user,
    session
  );

  return {
    user,
    ...credentials,
  };
};

// 3. Refresh session and rotate refresh token
export const refreshSession = async (refreshToken) => {
  const sessionId = extractSessionId(refreshToken);

  if (!sessionId) {
    throw new Error("Invalid refresh token");
  }

  const session = await Session.findOne({
    _id: sessionId,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  })
    .select("+refreshTokenHash")
    .populate("user");

  if (!session || !session.user) {
    throw new Error("Session expired or revoked");
  }

  if (!safeCompare(
    hashToken(refreshToken),
    session.refreshTokenHash
  )) {
    throw new Error("Invalid refresh token");
  }

  const user = session.user;

  if (!user.isActive) {
    await Session.updateOne(
      { _id: session._id, revokedAt: null },
      { $set: { revokedAt: new Date() } }
    );

    throw new Error("Your account has been deactivated");
  }

  const newRefreshToken = generateRefreshToken(
    session._id.toString()
  );

  const newTokenHash = hashToken(newRefreshToken);

  // Atomic rotation prevents two concurrent requests from
  // successfully rotating the same refresh token.
  const updatedSession = await Session.findOneAndUpdate(
    {
      _id: session._id,
      refreshTokenHash: session.refreshTokenHash,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    },
    {
      $set: {
        refreshTokenHash: newTokenHash,
        expiresAt: getRefreshTokenExpiry(),
      },
    },
    { new: true }
  );

  if (!updatedSession) {
    throw new Error("Session is no longer valid");
  }

  return {
    user,
    accessToken: generateAccessToken(user),
    refreshToken: newRefreshToken,
    sessionId: session._id.toString(),
  };
};

// 4. Logout current session
export const logoutUser = async (refreshToken) => {
  const sessionId = extractSessionId(refreshToken);

  if (!sessionId) return;

  const session = await Session.findOne({
    _id: sessionId,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  }).select("+refreshTokenHash");

  if (
    !session ||
    !safeCompare(hashToken(refreshToken), session.refreshTokenHash)
  ) {
    return;
  }

  session.revokedAt = new Date();
  await session.save();
};

// 5. Logout from all devices
export const logoutAllSessions = async (userId) => {
  await Session.updateMany(
    {
      user: userId,
      revokedAt: null,
    },
    {
      $set: { revokedAt: new Date() },
    }
  );
};

// 6. Get authenticated user's profile
export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user || !user.isActive) {
    throw new Error("User account not found or inactive");
  }

  return user;
};