import asyncHandler from "express-async-handler";
import { Content, validateContent } from "../models/content.model.js";
import {
  saveContentMediaToDb,
  deletePhysicalFile,
} from "../services/media.service.js";
import mongoose from "mongoose";
import { errorHandler } from "../utils/error.js";
import fs from "fs/promises";

import { getContentsService } from "../services/content.service.js";

export const createContent = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let mediaIds = {};
    if (req.files && Object.keys(req.files).length > 0) {
      mediaIds = await saveContentMediaToDb(req.files, req.user._id, session);
    }

    const contentData = {
      ...req.body,
      author: req.user._id,
      ...mediaIds,
    };
    if (contentData.cover) contentData.cover = contentData.cover.toString();
    if (contentData.mainMediaFile)
      contentData.mainMediaFile = contentData.mainMediaFile.toString();
    if (contentData.media)
      contentData.media = contentData.media.map((id) => id.toString());
    const { error, value } = await validateContent(contentData);
    if (error) {
      throw errorHandler(400, error.details.map((d) => d.message).join(", "));
    }

    const content = new Content(value);
    await content.save({ session });

    await session.commitTransaction();
    res.status(201).json({ success: true, data: content });
  } catch (err) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    if (req.files) {
      const allFiles = Object.values(req.files).flat();

      for (const file of allFiles) {
        try {
          await deletePhysicalFile(file);
          console.log(`File deleted from storage: ${file.path}`);
        } catch (unlinkError) {
          console.error("Could not delete physical file:", unlinkError);
        }
      }
    }
    next(err);
  } finally {
    session.endSession();
  }
});

export const getContents = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    type,
    status,
    category,
  } = req.query;

  try {
    const result = await getContentsService({
      page,
      limit,
      search,
      type,
      status,
      category,
    });
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
});

export const deleteContent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const content = await Content.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
      deletedAt: new Date(),
      status: "deleted",
    },
    { new: true },
  );

  if (!content) return next(errorHandler(404, "Content not found"));

  res.json({ success: true, message: "Content marked as deleted" });
});

export const restoreContent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const content = await Content.findByIdAndUpdate(
    id,
    {
      isDeleted: false,
      deletedAt: null,
      status: "draft",
    },
    { new: true },
  );

  if (!content) return next(errorHandler(404, "Content not found"));

  res.json({ success: true, message: "Content restored successfully" });
});
