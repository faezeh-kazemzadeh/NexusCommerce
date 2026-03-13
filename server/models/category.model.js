import mongoose from "mongoose";
import Joi from "joi";
import { generateUniqueSlug } from "../utils/slugify.js";

const CategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [50, "Category name must be less than 50 characters"],
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
      maxlength: [200, "Description must be less than 200 characters"],
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
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
          parent: ret.parent,
          usageCount: ret.usageCount,
          createdAt: ret.createdAt,
        };
      },
    },
  },
);

CategorySchema.statics.validateCategory = (category) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).trim().required(),
    description: Joi.string().max(200).allow("", null),
    parentCategory: Joi.string().hex().length(24).allow(null, ""),
  });
  return schema.validate(category, { abortEarly: false });
};

CategorySchema.pre("save", async function (next) {
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

export const Category = mongoose.model("Category", CategorySchema);
