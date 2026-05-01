import asyncHandler from "express-async-handler";
import { Media } from "../models/media.model.js";
import { errorHandler } from "../utils/error.js";
import mongoose from "mongoose";
import {
  saveMediaInfoToDatabase,
  deletePhysicalFile,
  deleteMediaDocumentAndPhysicalFile,
  getAllMediaFilesService,
} from "../services/media.service.js";
const uploadMediaHandler = async (req, res, next, isMultiple = false) => {
  const files = isMultiple ? req.files : req.file;

  if (!files || (Array.isArray(files) && files.length === 0)) {
    return next(errorHandler(400, "No file(s) received for upload."));
  }

  const { alt } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const mediaDocs = await saveMediaInfoToDatabase(
      files,
      req.user._id,
      alt,
      session,
    );

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: isMultiple
        ? "Files uploaded successfully."
        : "File uploaded successfully.",
      media: mediaDocs,
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    if (Array.isArray(files)) {
      await Promise.all(files.map((file) => deletePhysicalFile(file)));
    } else {
      await deletePhysicalFile(files);
    }

    console.error("Upload error:", error);
    next(errorHandler(500, error.message || "Error uploading media."));
  } finally {
    session.endSession();
  }
};

export const uploadSingleMedia = asyncHandler((req, res, next) =>
  uploadMediaHandler(req, res, next, false),
);

export const uploadMultipleMedia = asyncHandler((req, res, next) =>
  uploadMediaHandler(req, res, next, true),
);

export const deleteMedia = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const mediaDoc = await Media.findById(id).session(session);

    if (!mediaDoc) {
      await session.abortTransaction();
      return next(errorHandler(404, "Media not found."));
    }

    await deleteMediaDocumentAndPhysicalFile(mediaDoc, session);

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Media deleted successfully.",
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    next(errorHandler(500, error.message));
  } finally {
    session.endSession();
  }
});

export const deleteMultipleMedia = asyncHandler(async (req, res, next) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return next(errorHandler(400, "No media IDs provided."));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const isAdmin = req.user.roles && req.user.roles.includes("admin");

    const query = isAdmin
      ? { _id: { $in: ids } }
      : { _id: { $in: ids }, uploadedBy: req.user._id };

    // find media documents that match the provided IDs and belong to the user
    const mediaDocs = await Media.find(query).session(session);

    if (!mediaDocs.length) {
      await session.abortTransaction();
      return next(errorHandler(404, "No matching media found to delete."));
    }

    const foundIds = mediaDocs.map((m) => m._id);

    // remove media documents from database
    await Media.deleteMany({ _id: { $in: foundIds } }).session(session);

    await session.commitTransaction();

    // remove physical files after committing transaction to ensure data integrity
    await Promise.all(mediaDocs.map((media) => deletePhysicalFile(media)));

    res.status(200).json({
      success: true,
      message: "Media files deleted successfully.",
      requestedCount: ids.length,
      deletedCount: mediaDocs.length,
    });
  } catch (error) {
    if (session.inTransaction()) await session.abortTransaction();
    next(
      errorHandler(
        500,
        error.message || "An error occurred during batch deletion.",
      ),
    );
  } finally {
    session.endSession();
  }
});

export const getMediaList = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, type, scope } = req.query;

  const filters = { status: "active" };
  if (type) filters.type = type;
  const isAdmin =
    req.user && req.user.roles && req.user.roles.includes("admin");
  if (!isAdmin || scope === "self") {
    filters.uploadedBy = req.user._id;
  }

  const result = await getAllMediaFilesService(filters, page, limit);

  res.status(200).json({
    success: true,
    ...result,
  });
});
