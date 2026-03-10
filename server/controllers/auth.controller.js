import _ from "lodash";
import bcrypt from "bcrypt";
import crypto from "crypto";

import asyncHandler from "express-async-handler";
import { User } from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import { generateTokens } from "../utils/token.js";
import { sendEmail } from "../utils/sendEmail.js";
import { RefreshToken } from "../models/refreshToken.model.js";
//  @Destination    Register User
//  @Route          POST /api/users/signup
//  @Access         Public
export const signup = asyncHandler(async (req, res, next) => {
  const { error } = User.validateUser(req.body);
  if (error) return next(errorHandler(400, error.details[0].message));
  let user = await User.findOne({ email: req.body.email });
  if (user) return next(errorHandler(400, "User exist"));

  user = new User(
    _.pick(req.body, ["firstname", "lastname", "email", "password", "phone"]),
  );
  await user.save();

  await generateTokens(res, user);
  const { password: pass, ...userDetails } = user._doc;
  res.status(200).json({
    success: true,
    message: "Registration successful! You are now logged in.",
    user: userDetails,
  });
});

//  @Destination    Authenticate User
//  @Route          POST /api/users/signin
//  @Access         Public
export const signin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const validUser = await User.findOne({ email }).select("+password");
  console.log("User Roles from DB:", validUser);

  if (!validUser) {
    return next(
      errorHandler(401, "Please provide a valid email address and password."),
    );
  }

  if (validUser.isDeleted) {
    return next(errorHandler(403, "User has been deleted"));
  }

  if (!validUser.active) {
    return next(errorHandler(403, "User account is not active"));
  }

  const isPasswordValid = await bcrypt.compare(password, validUser.password);
  if (!isPasswordValid) {
    return next(errorHandler(401, "Invalid email or password"));
  }
  await generateTokens(res, validUser);
  const { password: pass, ...userDetails } = validUser._doc;
  res.status(200).json({
    success: true,
    message: "Login successful",
    user: userDetails,
  });
});

//  @Destination    Logout User
//  @Route          POST /api/users/signout
//  @Access         Public
export const signout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  if (refreshToken) {
    const hashed = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    await RefreshToken.deleteOne({ token: hashed });
  }
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
  };

  res.clearCookie("access_token", cookieOptions);
  res.clearCookie("refresh_token", cookieOptions);
  res.status(200).json({ success: true, message: "Logged out" });
});

//  @Destination    refreshToken
//  @Route          POST /api/auth/refreshtoken
//  @Access         Public
export const refreshToken = asyncHandler(async (req, res, next) => {
  const oldToken = req.cookies.refresh_token;
  if (!oldToken) return next(errorHandler(401, "No Refresh Token"));

  const hashedOld = crypto.createHash("sha256").update(oldToken).digest("hex");
  const tokenInDB = await RefreshToken.findOne({ token: hashedOld });

  if (!tokenInDB) return next(errorHandler(403, "Invalid Refresh Token"));

  const user = await User.findById(tokenInDB.user);
  if (!user || !user.active || user.isDeleted)
    return next(errorHandler(403, "User unavailable"));

  // حذف توکن قبلی (Rotation)
  await RefreshToken.deleteOne({ _id: tokenInDB._id });

  // تولید توکن جدید و ذخیره در DB
  const { accessToken } = await generateTokens(res, user);

  res.status(200).json({ success: true, accessToken });
});
//  @Destination    Forgot Password
//  @Route          POST /api/auth/forgot-password
//  @Access         Public
export const forgotPassword = asyncHandler(async (req, res, next) => {
  if (!req.body.email) {
    return next(errorHandler(400, "Email address is required."));
  }
  if (!req.body.email.includes("@")) {
    return next(errorHandler(400, "Please provide a valid email address."));
  }
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(errorHandler(404, "User not found"));
  }
  if (user.isDeleted) {
    return next(errorHandler(403, "User account has been deleted."));
  }

  if (!user.active) {
    return next(errorHandler(403, "User account is inactive."));
  }
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  // افزودن آدرس فرانت‌اند به لینک ریست پسورد : در صورتیکه هر دو سرور و فرانت‌اند در یک دامنه باشند، می‌توان از req.get("host") استفاده کرد. اما در صورتیکه فرانت‌اند در دامنه‌ای جداگانه باشد، باید آدرس فرانت‌اند را از متغیرهای محیطی (مانند FRONTEND_URL) خواند.
  // const resetURL = `${req.protocol}://${req.get(
  //   "host",
  // )}/reset-password/${resetToken}`;
  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const message = `  <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333333; line-height: 1.6;">
      <h2 style="color: #0056b3;">Password Reset Request</h2>
      <p>Hello,</p>
      <p>You are receiving this email because you (or someone else) has requested a password reset for your account.</p>
      <p>To complete the password reset process, please click on the button below:</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${resetURL}" 
           style="display: inline-block; padding: 12px 25px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 18px; font-weight: bold;">
          Reset My Password
        </a>
      </p>
      <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
      <p style="word-break: break-all; font-size: 14px; color: #555555;">${resetURL}</p>
      <p style="font-size: 14px; color: #777777;">
        This link is valid for <strong>1 hour</strong>. After that, you will need to request a new password reset link.
      </p>
      <p style="font-size: 14px; color: #777777;">
        If you did not request a password reset, please ignore this email.
      </p>
      <p style="margin-top: 40px; font-size: 14px; color: #999999;">Best regards,<br>Your App Team</p>
    </div>`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset Token",
      message,
    });
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(errorHandler(500, "Error sending email"));
  }
});

//  @Destination     Validate Token
//  @Route           POST /api/auth/validate-token/:token
//  @Access          Public
export const validateToken = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }, // بررسی زمان انقضا
  }).select("+resetPasswordToken +resetPasswordExpires");

  if (!user) {
    return next(errorHandler(400, "Invalid or expired token"));
  }

  if (!user.active || user.isDeleted) {
    return next(errorHandler(403, "User account is not valid"));
  }

  res.status(200).json({ success: true, message: "Token is valid" });
});

//  @Destination     Reset Password
//  @Route           PUT /api/auth/reset-password
//  @Access          Public
export const resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
  }).select("+resetPasswordToken +resetPasswordExpires +password");

  if (!user) return next(errorHandler(400, "Invalid Token"));

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
  res.status(200).json({ success: true });
});

//  @Destination    Get User Pofile
//  @Route          GET /api/users/profile
//  @Access         Public
export const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) return next(errorHandler(404, "User not found"));
  res.status(200).json(user);
});

//  @Destination    Update User Profile
//  @Route          PUT /api/users/profile
//  @Access         Private
export const updateUserProfile = asyncHandler(async (req, res, next) => {
  const { error } = User.validateUserProfile(req.body);
  if (error) return next(errorHandler(400, error.details[0].message));
  const allowedFields = ["firstname", "lastname", "phone"];
  const updateFields = _.pick(req.body, allowedFields);

  const updatedUser = await User.findByIdAndUpdate(req.user._id, updateFields, {
    new: true,
    runValidators: true,
  });
  if (!updatedUser) {
    return next(errorHandler(404, "User not found"));
  }

  res.status(200).json({
    success: true,
    message: "Profile Update successful",
    user: updatedUser,
  });
});
