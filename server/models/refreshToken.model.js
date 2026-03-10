import mongoose from "mongoose";
const RefreshTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // توکن بعد از انقضا خودکار حذف می‌شود
    },
  },
  { timestamps: true },
);

export const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);
