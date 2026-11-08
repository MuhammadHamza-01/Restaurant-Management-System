import { generateToken } from "./generateToken.js";

export const setTokenCookie = (res, userId) => {
  const token = generateToken(userId);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};