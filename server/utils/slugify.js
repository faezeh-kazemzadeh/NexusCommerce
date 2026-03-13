import slugify from "slugify";

export const generateSlug = (text) => {
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
    replacement: "-",
    remove: /[*+~.()'"!:@]/g,
  });
};

export const generateUniqueSlug = async (title, model) => {
  const baseSlug = generateSlug(title);

  const existingSlugs = await model
    .find({ slug: new RegExp(`^${baseSlug}(-[0-9]+)?$`, "i") })
    .select("slug")
    .lean();

  if (existingSlugs.length === 0) return baseSlug;

  const indexes = existingSlugs.map((s) => {
    const parts = s.slug.split("-");
    const lastPart = parts[parts.length - 1];
    return isNaN(lastPart) ? 0 : parseInt(lastPart);
  });
  const maxIndex = Math.max(...indexes);
  return `${baseSlug}-${maxIndex + 1}`;
};
