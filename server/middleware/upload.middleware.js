import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { errorHandler } from "../utils/error.js";

const allowedMimeTypes = {
  image: ["image/png", "image/jpg", "image/jpeg", "image/gif", "image/webp"],
  video: ["video/mp4", "video/mpeg", "video/quicktime", "video/x-matroska"],
  document: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  audio: ["audio/mpeg", "audio/wav"],
};

const allAllowedMimeTypes = Object.values(allowedMimeTypes).flat();

const fileSizeLimits = {
  image: 10 * 1024 * 1024, // 10MB
  video: 700 * 1024 * 1024, // 700MB
  document: 20 * 1024 * 1024, // 20MB
  audio: 50 * 1024 * 1024, // 50MB
  default: 10 * 1024 * 1024, // 10MB
};

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const mime = file.mimetype;
    let folder = "upload/others";
    for (const [type, mimes] of Object.entries(allowedMimeTypes)) {
      if (mimes.includes(mime)) {
        folder = `upload/${type}`;
        break;
      }
    }
    await fs.mkdir(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .replace(/_+/g, "_");

    const uniqueId = Math.round(Math.random() * 1e4);
    cb(null, `${safeName}-${Date.now()}-${uniqueId}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!allAllowedMimeTypes.includes(file.mimetype)) {
    const error = errorHandler(400, `Invalid file type: ${file.mimetype}`, 400);
    error.name = "ExtensionError";
    return cb(error, false);
  }
  cb(null, true);
};

// Set a global file size limit to prevent excessively large uploads
const MAX_GLOBAL_FILE_SIZE = 700 * 1024 * 1024;

const multerInstance = multer({
  storage,
  limits: { fileSize: MAX_GLOBAL_FILE_SIZE },
  fileFilter,
});

const createUploadMiddleware = (multerAction) => {
  return async (req, res, next) => {
    try {
      if (!req.is("multipart/form-data")) {
        return next(
          errorHandler(415, "Content-Type must be multipart/form-data"),
        );
      }

      await new Promise((resolve, reject) => {
        multerAction(req, res, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      // check each file against its specific size limit
      const filesToCheck = req.file ? [req.file] : req.files || [];

      for (const file of filesToCheck) {
        let limit = fileSizeLimits.default;

        // find the specific limit based on the file's MIME type
        for (const [type, mimes] of Object.entries(allowedMimeTypes)) {
          if (mimes.includes(file.mimetype)) {
            limit = fileSizeLimits[type];
            break;
          }
        }

        if (file.size > limit) {
          // remove the uploaded file if it exceeds the specific limit
          await fs.unlink(file.path);
          const limitInMB = limit / (1024 * 1024);
          throw errorHandler(
            413,
            `File "${file.originalname}" is too large. Maximum allowed for this type is ${limitInMB}MB.`,
          );
        }
      }

      next();
    } catch (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return next(errorHandler(413, "File size exceeds the global limit."));
        }
        return next(errorHandler(422, `Upload error: ${err.message}`));
      }

      const status = typeof err.statusCode === "number" ? err.statusCode : 400;
      const message = err.message || "An error occurred during upload";

      next(errorHandler(status, message));
    }
  };
};

export const uploadSingle = createUploadMiddleware(
  multerInstance.single("file"),
);
export const uploadArray = createUploadMiddleware(
  multerInstance.array("files", 10),
);

export {
  multerInstance,
  allowedMimeTypes,
  fileSizeLimits,
  createUploadMiddleware,
};
