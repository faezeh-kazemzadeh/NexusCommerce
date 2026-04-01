import { Content } from "../models/content.model.js";

export const getContentsService = async ({
  page = 1,
  limit = 10,
  search = "",
  type = null,
  status = null,
  category = null,
}) => {
  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.max(Number(limit) || 10, 1);
  const skip = (pageNumber - 1) * limitNumber;

  let query = {};
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { body: { $regex: search, $options: "i" } },
    ];
  }

  if (type) {
    query.type = type;
  }

  if (status) {
    query.status = status;
  }

  if (category) {
    query.category = category;
  }

  const [contents, totalContents] = await Promise.all([
    Content.find(query)
      .populate("author", " email firstname lastname")
      .populate("category", "name")
      .populate("tags", "name")
      .populate("cover", "path filename")
      .populate("media", "path filename")
      .populate("mainMediaFile", "path filename")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean(),
    Content.countDocuments(query),
  ]);
  return {
    contents,
    pagination: {
      total: totalContents,
      page: pageNumber,
      pages: Math.ceil(totalContents / limitNumber),
      limit: limitNumber,
    },
  };
};
