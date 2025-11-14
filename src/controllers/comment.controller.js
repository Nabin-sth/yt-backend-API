import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "invalid video id");
  }
  const { page = 1, limit = 10 } = req.query;

  const sortOptions = { createdAt: -1 };
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const parsedLimit = parseInt(limit);
  const filters = {};
  filters.video = videoId;
  const comments = await Comment.find(filters)
    .sort(sortOptions)
    .skip(skip)
    .limit(parsedLimit);

  return res.status(200).json(new ApiResponse(200, comments, "Success"));
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  const { content } = req.body;

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: req.user?._id,
  });
  return res.status(200).json(new ApiResponse(200, comment, "Success"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "content is reqd");
  }
  const comment = await Comment.findByIdAndUpdate(
    commentId,
    {
      content,
    },
    {
      new: true,
    }
  );
  return res.status(200).json(new ApiResponse(200, comment, "Success"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;
  const comment = await Comment.findByIdAndDelete(commentId);
  return res.status(200).json(new ApiResponse(200, comment, "Success"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
