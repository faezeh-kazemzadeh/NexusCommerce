import jwt from "jsonwebtoken";
import crypto from "crypto";
import { RefreshToken } from "../models/refreshToken.model.js";

const generateTokens = async (res, user, oldRefreshToken = null) => {
  const payload = {
    _id: user._id,
    roles: Array.isArray(user.roles) ? user.roles : [user.roles || "user"],
  };

  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    path: "/", // ensure cookies are sent for all routes
  };

  res.cookie("access_token", accessToken, {
    ...cookieOptions,
    maxAge: 1 * 60 * 60 * 1000,
  });
  res.cookie("refresh_token", refreshToken, {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  const hashedToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  // remove old tokens for the user (rotation)
  if (oldRefreshToken) {
    const hashedOld = crypto
      .createHash("sha256")
      .update(oldRefreshToken)
      .digest("hex");
    await RefreshToken.deleteOne({ token: hashedOld });
  } else {
    await RefreshToken.deleteMany({
      user: user._id,
      expiresAt: { $lt: new Date() },
    });

    // threshold of 5 active tokens per user to prevent token spamming
    const tokenCount = await RefreshToken.countDocuments({ user: user._id });
    if (tokenCount >= 5) {
      // delete the oldest token to maintain the limit
      const oldestToken = await RefreshToken.findOne({ user: user._id }).sort({
        createdAt: 1,
      });
      if (oldestToken) await RefreshToken.deleteOne({ _id: oldestToken._id });
    }
  }
  await RefreshToken.create({
    token: hashedToken,
    user: user._id,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
};

export { generateTokens };
