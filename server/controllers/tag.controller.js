import asyncHandler from "express-async-handler";
import _ from "lodash";
import * as tagService from "../services/tag.service.js";

export const getTags = asyncHandler(async (req, res) => {
  const {
    search = "",
    page = 1,
    limit = 10,
    sort = "createdAt",
  } = req.query || {};
  const result = await tagService.getTagsService({ search, page, limit, sort });
  res
    .status(200)
    .json({ success: true, tags: result.tags, pagination: result.pagination });
});

export const createTag = asyncHandler(async (req, res) => {
  const data = _.pick(req.body, ["name", "description"]);
  const tag = await tagService.createTagService(data);
  res.status(201).json({ success: true, tag });
});

export const updateTag = asyncHandler(async (req, res) => {
  const data = _.pick(req.body, ["name", "description"]);
  const tag = await tagService.updateTagService(req.params.id, data);
  res.status(200).json({ success: true, tag });
});

export const deleteTag = asyncHandler(async (req, res) => {
  await tagService.deleteTagService(req.params.id);
  res.status(200).json({ success: true, message: "Tag deleted successfully" });
});
