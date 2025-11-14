import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const userId = req.user?._id;
  const {content} = req.body;
  const tweet = await Tweet.create({
    content,
    owner: userId,
  });
  return res.status(200).json(new ApiResponse(200, tweet, "tweet created"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  //   const userId = req.user?._id;
  const {userId} = req.params;

  const tweets = await Tweet.find({ owner: userId });
  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "user tweets fetched"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet

  const {tweetId} = req.params;
  const {content} = req.body;
  const update = await Tweet.findByIdAndUpdate(
    tweetId,
    { content },
    {
      new: true,
    }
  );
  return res.status(200).json(new ApiResponse(200, update, "tweet updated"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const {tweetId} = req.params;
  const deletedTweet = await Tweet.findByIdAndDelete(tweetId);
  return res
    .status(200)
    .json(new ApiResponse(200, deletedTweet, "tweet deleted"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
