import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// const getChannelStats = asyncHandler(async (req, res) => {
//   // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
//   const user = req.user?._id;
//   const channelStats = await Video.aggregate([
//     {
//       $match: {
//         owner: user,
//       },
//     },
//     {
//       $lookup: {
//         from: "subscriptions",
//         localField: "owner",
//         foreignField: "channel",
//         as: "subscribers",
//       },
//     },
//     {
//       $lookup: {
//         from: "likes",
//         localField: "owner",
//         foreignField: "likedBy",
//         as: "videoLikes",
//       },
//     },
//     {
//       $addFields: {
//         subscribersCount: {
//           $size: "$subscribers",
//         },
//         // totalViews: {
//         //   $size: "$views",
//         // },
//         totalLikes: {
//           $size: "$videoLikes",
//         },
//       },
//     },
//     {
//       $project: {
//         subscribersCount: 1,
//         totalLikes: 1,
//         // totalViews: 1,
//         fullName: 1,
//         username: 1,
//       },
//     },
//   ]);
//   return res.status(200).json(new ApiResponse(200, channelStats, "done"));
// });

const getChannelStats = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  // Aggregate total videos, views, and likes for the user's channel
  const videoStats = await Video.aggregate([
    {
      $match: {
        owner: userId,
      },
    },
    {
      $group: {
        _id: "$owner",
        totalVideos: { $sum: 1 },
        totalViews: { $sum: "$views" }, // assuming each video has a `views` number
        videoIds: { $push: "$_id" },
      },
    },
  ]);

  const totalVideos = videoStats[0]?.totalVideos || 0;
  const totalViews = videoStats[0]?.totalViews || 0;
  const videoIds = videoStats[0]?.videoIds || [];

  // Count total likes across all videos
  const likesCount = await Like.countDocuments({
    video: { $in: videoIds },
  });

  // Count total subscribers
  const subscribersCount = await Subscription.countDocuments({
    channel: userId,
  });

  const subscribedToCount = await Subscription.countDocuments({
    subscriber: userId,
  });

  const channelStats = {
    totalVideos,
    totalViews,
    totalLikes: likesCount,
    subscribersCount,
    subscribedToCount,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, channelStats, "Channel stats fetched successfully")
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const user = req.user?._id;
  const videos = await Video.find({ owner: user });
  return res
    .status(200)
    .json(new ApiResponse(200, videos, "channel videos fetched"));
});

export { getChannelStats, getChannelVideos };
