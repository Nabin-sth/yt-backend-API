import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user?._id;
  console.log(new mongoose.Types.ObjectId(channelId));
  console.log(userId);
  if (new mongoose.Types.ObjectId(channelId).equals(userId)) {
    throw new ApiError(400, "Cannot subscribe to oneself");
  }

  const alreadySubscribed = await Subscription.findOne({
    subscriber: userId,
    channel: channelId,
  });
  if (alreadySubscribed) {
    await alreadySubscribed.deleteOne();
    return res.status(200).json(new ApiResponse(200, {}, "UnSubscribed"));
  } else {
    const subscription = await Subscription.create({
      channel: channelId,
      subscriber: userId,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, subscription, "Subscribed"));
  }

  // TODO: toggle subscription
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user?._id;
  //   const subscribers = await Subscription.find({ channel: channelId });
  //   console.log(subscribers);
  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriberDetails",
      },
    },
    {
      $unwind: "$subscriberDetails",
    },
    {
      $project: {
        _id: 0,
        subscriberId: "$subscriberDetails._id",
        fullName: "$subscriberDetails.fullName",
        username: "$subscriberDetails.username",
        email: "$subscriberDetails.email", // include what you need
        avatar: "$subscriberDetails.avatar", // optional
      },
    },
  ]);
  return res.status(200).json(new ApiResponse(200, subscribers, "done"));
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  const subscribedChannels = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "subscribedChannelDetails",
      },
    },
    {
      $unwind: "$subscribedChannelDetails",
    },
    {
      $project: {
        subscriberId: "$subscribedChannelDetails._id",
        fullName: "$subscribedChannelDetails.fullName",
        username: "$subscribedChannelDetails.username",
        email: "$subscribedChannelDetails.email", // include what you need
        avatar: "$subscribedChannelDetails.avatar", // optional
      },
    },
  ]);
  return res
    .status(200)
    .json(
      new ApiResponse(200, subscribedChannels, "Subscribed Channels details")
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
