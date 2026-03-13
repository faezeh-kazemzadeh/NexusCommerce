import { Tag } from "../models/tag.model.js";
import { errorHandler } from "../utils/error.js";

export const getAllTagsService = async () => {
  return await Tag.find({}).sort({ createdAt: -1 }).lean();
};

export const createTagService = async (tagData) => {
  const existingTag = await Tag.findOne({ name: tagData.name.toLowerCase() });
  if (existingTag) {
    throw errorHandler(400, "Tag with this name already exists");
  }

  const newTag = new Tag(tagData);
  return await newTag.save();
};

export const updateTagService = async (id, updateData) => {
  const tag = await Tag.findById(id);
  if (!tag) throw errorHandler(404, "Tag not found");

  if (updateData.name && updateData.name.toLowerCase() !== tag.name) {
    const existingTag = await Tag.findOne({
      name: updateData.name.toLowerCase(),
    });
    if (existingTag) {
      throw errorHandler(400, "Tag with this name already exists");
    }
    tag.name = updateData.name;
  }

  if (updateData.description !== undefined) {
    tag.description = updateData.description;
  }

  return await tag.save();
};

export const deleteTagService = async (id) => {
  const tag = await Tag.findById(id);
  if (!tag) throw errorHandler(404, "Tag not found");

  if (tag.usageCount > 0) {
    throw errorHandler(400, "Cannot delete a tag that is currently in use");
  }

  return await Tag.findByIdAndDelete(id);
};

export const updateTagUsageCount = async (tagIds, increment = 1) => {
  if (!tagIds || tagIds.length === 0) return;
  await Tag.updateMany(
    { _id: { $in: tagIds } },
    { $inc: { usageCount: increment } },
  );
};

export const getActiveTagsService = async () => {
  return await Tag.find({ usageCount: { $gt: 0 } }).sort({ usageCount: -1 });
};
