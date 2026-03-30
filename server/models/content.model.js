import mongoose from "mongoose";
import Joi from "joi";
import objectid from "joi-objectid";
import { generateUniqueSlug } from "../utils/slugify.js";

Joi.objectId = objectid(Joi);

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },

    body: {
      type: String,
      trim: true,
      maxlength: [1000, "Body cannot exceed 1000 characters"],
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],

    cover: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
    },

    media: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media",
      },
    ],

    type: {
      type: String,
      enum: ["article", "video", "podcast", "gallery", "review", "news"],
      required: true,
      default: "article",
      index: true,
    },

    //  MEDIA
    mainMediaFile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
    },

    externalUrl: {
      type: String,
      trim: true,
    },

    duration: {
      type: Number,
      min: 1,
    },

    //  NEWS
    source: {
      type: String,
      trim: true,
      maxlength: [100, "Source cannot exceed 100 characters"],
    },

    //  REVIEW
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    pros: [
      {
        type: String,
        trim: true,
        maxlength: 200,
      },
    ],

    cons: [
      {
        type: String,
        trim: true,
        maxlength: 200,
      },
    ],
  },
  {
    timestamps: true,
  },
);

//  SLUG
contentSchema.pre("save", async function (next) {
  if (!this.isModified("title") && !this.isNew) return next();

  try {
    this.slug = await generateUniqueSlug(this.title, this.constructor);
    next();
  } catch (err) {
    next(err);
  }
});

//  VALIDATION
const baseSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  body: Joi.string().min(10).max(1000).allow("", null),

  author: Joi.objectId().required(),
  category: Joi.objectId().required(),

  tags: Joi.array().items(Joi.objectId()),
  status: Joi.string().valid("draft", "published", "archived"),

  type: Joi.string()
    .valid("article", "video", "podcast", "gallery", "review", "news")
    .required(),

  cover: Joi.objectId(),
  media: Joi.array().items(Joi.objectId()),

  mainMediaFile: Joi.objectId(),
  externalUrl: Joi.string().uri(),
  duration: Joi.number().min(1),

  source: Joi.string().max(100),

  rating: Joi.number().min(1).max(5),
  pros: Joi.array().items(Joi.string().max(200)),
  cons: Joi.array().items(Joi.string().max(200)),
});

const validateContent = (data) => {
  const schema = baseSchema
    .when(".type", {
      is: "article",
      then: Joi.object({
        body: Joi.required(),
        cover: Joi.required(),
        source: Joi.forbidden(),
        rating: Joi.forbidden(),
        pros: Joi.forbidden(),
        cons: Joi.forbidden(),
        duration: Joi.forbidden(),
        mainMediaFile: Joi.forbidden(),
        externalUrl: Joi.forbidden(),
      }),
    })
    .when(".type", {
      is: "gallery",
      then: Joi.object({
        cover: Joi.required(),
        media: Joi.array().items(Joi.objectId()).min(1).required(),
        source: Joi.forbidden(),
        rating: Joi.forbidden(),
        pros: Joi.forbidden(),
        cons: Joi.forbidden(),
        duration: Joi.forbidden(),
        mainMediaFile: Joi.forbidden(),
        externalUrl: Joi.forbidden(),
      }),
    })
    .when(".type", {
      is: Joi.valid("video", "podcast"),
      then: Joi.object({
        cover: Joi.required(),
        duration: Joi.required(),
        source: Joi.forbidden(),
        rating: Joi.forbidden(),
        pros: Joi.forbidden(),
        cons: Joi.forbidden(),
      }).xor("mainMediaFile", "externalUrl"),
    })
    .when(".type", {
      is: "news",
      then: Joi.object({
        body: Joi.required(),
        source: Joi.required(),
        rating: Joi.forbidden(),
        pros: Joi.forbidden(),
        cons: Joi.forbidden(),
        duration: Joi.forbidden(),
        mainMediaFile: Joi.forbidden(),
        externalUrl: Joi.forbidden(),
      }),
    })
    .when(".type", {
      is: "review",
      then: Joi.object({
        body: Joi.required(),
        rating: Joi.required(),
        duration: Joi.forbidden(),
        mainMediaFile: Joi.forbidden(),
        externalUrl: Joi.forbidden(),
        source: Joi.forbidden(),
      }),
    });

  return schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });
};
const Content = mongoose.model("Content", contentSchema);

export { Content, validateContent };
