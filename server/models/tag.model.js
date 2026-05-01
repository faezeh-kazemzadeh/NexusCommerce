import mongoose from "mongoose";
import { generateUniqueSlug } from "../utils/slugify.js";
import Joi from "joi";

const TagSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tag name is required"],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [50, "Tag name must be less than 50 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Tag description must be less than 200 characters"],
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        return {
          _id: ret._id,
          name: ret.name,
          slug: ret.slug,
          description: ret.description,
          usageCount: ret.usageCount,
          createdAt: ret.createdAt,
        };
      },
    },
  },
);

TagSchema.statics.validateTag = (tag) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).trim().required(),
    description: Joi.string().max(200).allow("", null),
  });
  return schema.validate(tag, { abortEarly: false });
};

TagSchema.pre("save", async function (next) {
  if (!this.isModified("name")) {
    return next();
  }
  try {
    this.slug = await generateUniqueSlug(this.name, this.constructor);
    next();
  } catch (err) {
    next(err);
  }
});

export const Tag = mongoose.model("Tag", TagSchema);
