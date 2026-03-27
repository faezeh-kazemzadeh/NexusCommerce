// Helper function to determine media type based on MIME type
export const getMediaType = (mimetype) => {
  if (mimetype.startsWith("image")) return "image";
  if (mimetype.startsWith("video")) return "video";
  if (mimetype.startsWith("audio")) return "audio";

  if (
    mimetype === "application/pdf" ||
    mimetype === "application/msword" ||
    mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return "document";
  }

  return "other";
};

// normalize input to handle both single and multiple file uploads with corresponding alt texts
export const normalizeInput = (fileOrFiles, altText) => {
  const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];

  const alts = Array.isArray(altText)
    ? altText
    : Array(files.length).fill(altText || "");

  return { files, alts };
};
