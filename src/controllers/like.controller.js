import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;
  //TODO: toggle like on video

  if (!videoId) {
    throw new ApiError(400, "no video found");
  }

  if (!userId) {
    throw new ApiError(400, "no user found");
  }

  const alreadyLiked = await Like.findOne({ video: videoId, likedBy: userId });
  console.log(alreadyLiked);

  if (alreadyLiked) {
    // const deletedLike = await Like.findOneAndDelete({
    //   video: videoId,
    //   likedBy: userId,
    // });
    await alreadyLiked.deleteOne();

    return res.status(200).json(new ApiResponse(200, {}, "deleted like done"));
  } else {
    const like = await Like.create({
      video: videoId,
      likedBy: userId,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { like, username: req.user?.username },
          "like done"
        )
      );
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user?._id;
  //TODO: toggle like on comment

  const alreadyLiked = await Like.findOne({
    comment: commentId,
    likedBy: userId,
  });
  if (alreadyLiked) {
    await alreadyLiked.deleteOne();
    return res.status(200).json(new ApiResponse(200, {}, "Like removed"));
  } else {
    const like = await Like.create({
      comment: commentId,
      likedBy: userId,
    });
    return res.status(200).json(new ApiResponse(200, like, "like done"));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
  const userId = req.user?._id;

  const alreadyLiked = await Like.findOne({
    tweet: tweetId,
    likedBy: userId,
  });
  if (alreadyLiked) {
    await alreadyLiked.deleteOne();
    return res.status(200).json(new ApiResponse(200, {}, "Like removed"));
  } else {
    const like = await Like.create({
      tweet: tweetId,
      likedBy: userId,
    });
    return res.status(200).json(new ApiResponse(200, like, "like done"));
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const userId = req.user?._id;
  const likedVideos = await Like.find({
    likedBy: userId,
    video: { $ne: null },
  });
  return res.status(200).json(new ApiResponse(200, likedVideos, "done"));
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
