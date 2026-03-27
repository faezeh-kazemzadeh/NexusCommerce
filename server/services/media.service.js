import { Media } from "../models/media.model.js";
import fs from "fs/promises";
import { getMediaType, normalizeInput } from "../utils/fileHelper.js";

const saveMediaInfoToDatabase = async (
  fileOrFiles,
  userId,
  altText,
  session,
) => {
  const { files, alts } = normalizeInput(fileOrFiles, altText);

  if (!files.length) {
    return Array.isArray(fileOrFiles) ? [] : null;
  }

  const mediaDocs = files.map((file, index) => ({
    filename: file.filename,
    originalName: file.originalname,
    path: file.path,
    mimeType: file.mimetype,
    size: file.size,
    type: getMediaType(file.mimetype),
    alt: alts[index],
    uploadedBy: userId,
  }));

  const saved = await Media.insertMany(mediaDocs, { session });

  return Array.isArray(fileOrFiles) ? saved : saved[0];
};

const deletePhysicalFile = async (fileInfo) => {
  if (!fileInfo?.path) return;

  try {
    await fs.unlink(fileInfo.path);
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }
};

const deleteMediaDocumentAndPhysicalFile = async (mediaDoc, session = null) => {
  if (!mediaDoc) return;

  await deletePhysicalFile(mediaDoc);
  await mediaDoc.deleteOne({ session });
};

const getAllMediaFilesService = async (filters = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const query = Media.find(filters)
    .populate("uploadedBy", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const [data, total] = await Promise.all([
    query.exec(),
    Media.countDocuments(filters),
  ]);

  return {
    data,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};
export {
  saveMediaInfoToDatabase,
  deletePhysicalFile,
  deleteMediaDocumentAndPhysicalFile,
  getAllMediaFilesService,
};
