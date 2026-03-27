import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true, unique: true },
    originalName: { type: String, required: true },
    path: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    type: {
      type: String,
      enum: ["image", "video", "audio", "document", "other"],
      required: true,
      index: true,
    },
    alt: { type: String, default: "", trim: true },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

mediaSchema.virtual("url").get(function () {
  return `${process.env.BASE_URL}/${this.path.replace(/\\/g, "/")}`;
});

const Media = mongoose.model("Media", mediaSchema);
export { Media };
