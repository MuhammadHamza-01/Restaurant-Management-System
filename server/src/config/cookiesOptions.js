const isProduction = process.env.NODE_ENV === "production";

const sameSite = process.env.COOKIE_SAME_SITE || "lax";

const secure =
  isProduction || process.env.COOKIE_SECURE === "true";

const baseCookieOptions = {
  httpOnly: true,
  secure,
  sameSite,
  path: "/",
};

export const accessCookieOptions = {
  ...baseCookieOptions,
  maxAge: 15 * 60 * 1000,
};

export const refreshCookieOptions = {
  ...baseCookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const clearCookieOptions = {
  httpOnly: true,
  secure,
  sameSite,
  path: "/",
};

export const ACCESS_COOKIE_NAME = "accessToken";
export const REFRESH_COOKIE_NAME = "refreshToken";