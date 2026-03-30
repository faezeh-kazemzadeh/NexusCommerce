import {
  multerInstance,
  allowedMimeTypes,
  fileSizeLimits,
} from "./upload.middleware.js";
import { errorHandler } from "../utils/error.js";
import fs from "fs/promises";
import ffmpeg from "fluent-ffmpeg";

const mapping = {
  article: [{ name: "cover", maxCount: 1, types: ["image"] }],
  video: [
    { name: "cover", maxCount: 1, types: ["image"] },
    { name: "mainMediaFile", maxCount: 1, types: ["video"] },
  ],
  podcast: [
    { name: "cover", maxCount: 1, types: ["image"] },
    { name: "mainMediaFile", maxCount: 1, types: ["audio"] },
  ],
  gallery: [
    { name: "cover", maxCount: 1, types: ["image"] },
    { name: "media", maxCount: 10, types: ["image"] },
  ],
  news: [{ name: "cover", maxCount: 1, types: ["image"] }],
  review: [{ name: "cover", maxCount: 1, types: ["image"] }],
};

const getDuration = (path) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(path, (err, metadata) => {
      if (err) return reject(err);
      resolve(Math.round(metadata.format.duration));
    });
  });
};

export const contentUpload = (req, res, next) => {
  const type = req.query.type || req.body.type;
  if (!mapping[type]) return next(errorHandler(400, "Invalid content type"));

  const upload = multerInstance.fields(mapping[type]);

  upload(req, res, async (err) => {
    if (err) return next(err);
    if (!req.files) return next();

    const allFiles = Object.values(req.files).flat();
    try {
      await Promise.all(
        allFiles.map(async (file) => {
          let detectedType = "other";
          for (const [t, mimes] of Object.entries(allowedMimeTypes)) {
            if (mimes.includes(file.mimetype)) {
              detectedType = t;
              break;
            }
          }

          const config = mapping[type].find((c) => c.name === file.fieldname);

          if (!config || !config.types.includes(detectedType)) {
            await Promise.all(
              allFiles.map((f) => fs.unlink(f.path).catch(() => {})),
            );
            throw errorHandler(
              400,
              `Field ${file.fieldname} only accepts ${config?.types || []}`,
            );
          }

          if (
            config.name === "mainMediaFile" &&
            (detectedType === "video" || detectedType === "audio")
          ) {
            try {
              const duration = await getDuration(file.path);

              file.duration = duration;

              req.body.duration = duration;
            } catch (durationErr) {
              console.error("FFprobe error:", durationErr);

              await Promise.all(
                allFiles.map((f) => fs.unlink(f.path).catch(() => {})),
              );
              throw errorHandler(
                400,
                "Could not extract media duration. File might be corrupted.",
              );
            }
          }
        }),
      );
      next();
    } catch (error) {
      next(error);
    }
  });
};
