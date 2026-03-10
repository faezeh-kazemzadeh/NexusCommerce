import mongoose from "mongoose";
import Joi from "joi";
import { joiPasswordExtendCore } from "joi-password";
import bcrypt from "bcrypt";
import crypto from "crypto";

const joiPassword = Joi.extend(joiPasswordExtendCore);

const UserSchema = mongoose.Schema(
  {
    email: {
      type: String,
      minlength: 12,
      maxlength: 250,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    firstname: {
      type: String,
      minlength: 3,
      maxlength: 150,
    },
    lastname: {
      type: String,
      minlength: 3,
      maxlength: 150,
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      minlength: 5,
      maxlength: 100,
      trim: true,
      required: true,
      select: false,
    },
    roles: {
      type: [String],
      enum: ["admin", "user", "editor"],
      default: ["user"],
      index: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true },
);

UserSchema.statics.validateUser = (user) => {
  const schema = Joi.object({
    firstname: Joi.string().min(3).max(150),
    lastname: Joi.string().min(3).max(150),
    phone: Joi.string().allow("", null),
    email: Joi.string().min(12).max(250).required().email(),
    roles: Joi.array().items(Joi.string().valid("admin", "user", "editor")),
    password: joiPassword
      .string()
      .minOfSpecialCharacters(1)
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(2)
      .noWhiteSpaces()
      .onlyLatinCharacters()
      .required()
      .messages({
        "password.minOfUppercase":
          "{#label} should contain at least {#min} uppercase character",
        "password.minOfSpecialCharacters":
          "{#label} should contain at least {#min} special character",
        "password.minOfLowercase":
          "{#label} should contain at least {#min} lowercase character",
        "password.minOfNumeric":
          "{#label} should contain at least {#min} numeric character",
        "password.noWhiteSpaces": "{#label} should not contain white spaces",
        "password.onlyLatinCharacters":
          "{#label} should contain only latin characters",
      }),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords do not match",
      }),
  });
  return schema.validate(user, { abortEarly: false });
};
UserSchema.statics.validateUserUpdate = (user) => {
  const schema = Joi.object({
    firstname: Joi.string().min(3).max(150),
    lastname: Joi.string().min(3).max(150),
    email: Joi.string().email(),
    phone: Joi.string().allow("", null),
    roles: Joi.array().items(Joi.string().valid("admin", "user", "editor")),
    active: Joi.boolean(),
  }).min(1);

  return schema.validate(user, { abortEarly: false });
};

UserSchema.statics.validateUserProfile = (user) => {
  const schema = Joi.object({
    firstname: Joi.string().min(3).max(150),
    lastname: Joi.string().min(3).max(150),
    phone: Joi.string(),
  });
  return schema.validate(user, { abortEarly: false });
};

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const RESET_TOKEN_EXPIRE = 10 * 60 * 1000;
  this.resetPasswordExpires = Date.now() + RESET_TOKEN_EXPIRE;
  return resetToken;
};

UserSchema.index({
  firstname: "text",
  lastname: "text",
  email: "text",
});
export const User = mongoose.model("User", UserSchema);
