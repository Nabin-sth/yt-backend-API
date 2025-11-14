import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const parsedLimit = parseInt(limit);

  const match = {};

  if (query) {
    match.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }

  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    match.owner = new mongoose.Types.ObjectId(userId);
  }

  const sortOrder = sortType === "asc" ? 1 : -1;
  const sortOptions = { [sortType]: sortOrder };

  const videos = await Video.aggregate([
    { $match: match },
    { $limit: parsedLimit },
    { $skip: skip },
    { $sort: sortOptions },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
      },
    },
    {
      $project: {
        thumbnail: 1,
        videoFile: 1,
        title: 1,
        description: 1,
        createdAt: 1,
        "ownerDetails.fullName": 1,
        "ownerDetails.email": 1,
      },
    },
  ]);
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        data: videos,
        limit: parsedLimit,
        page: parseInt(page),
      },
      "done"
    )
  );
});

// const getAllVideos = asyncHandler(async (req, res) => {
//   const {
//     page = 1,
//     limit = 10,
//     query,
//     sortBy = "createdAt",
//     sortType = "desc",
//     userId,
//   } = req.query;

//   const skip = (parseInt(page) - 1) * parseInt(limit);
//   const sortOrder = sortType === "asc" ? 1 : -1;

//   // Build match stage
//   const match = {};

//   if (query) {
//     match.$or = [
//       { title: { $regex: query, $options: "i" } },
//       { description: { $regex: query, $options: "i" } },
//     ];
//   }

//   if (userId && mongoose.Types.ObjectId.isValid(userId)) {
//     match.owner = new mongoose.Types.ObjectId(userId);
//   }

//   const videos = await Video.aggregate([
//     { $match: match },
//     { $sort: { [sortBy]: sortOrder } },
//     { $skip: skip },
//     { $limit: parseInt(limit) },
//     {
//       $lookup: {
//         from: "users", // name of the related collection
//         localField: "owner", // field in Video
//         foreignField: "_id", // field in User
//         as: "ownerDetails",
//       },
//     },
//     {
//       $unwind: {
//         path: "$ownerDetails",
//         preserveNullAndEmptyArrays: true,
//       },
//     },
//     {
//       $project: {
//         title: 1,
//         description: 1,
//         createdAt: 1,
//         "ownerDetails.fullName": 1,
//         "ownerDetails.email": 1,
//       },
//     },
//   ]);

//   return res.status(200).json(
//     new ApiResponse(
//       200,
//       {
//         data: videos,
//         page: parseInt(page),
//         limit: parseInt(limit),
//       },
//       "Videos fetched successfully"
//     )
//   );
// });

// const getAllVideos = asyncHandler(async (req, res) => {
//   const {
//     page = 1,
//     limit = 10,
//     query,
//     sortBy = "createdAt",
//     sortType = "desc",
//     userId,
//   } = req.query;

//   const filters = {};
//   if (query) {
//     filters.$or = [
//       { title: { $regex: query, $options: "i" } },
//       { description: { $regex: query, $options: "i" } },
//     ];
//   }

//   if (userId) {
//     filters.owner = userId.trim();
//   }

//   const sortOrder = sortType === "asc" ? 1 : -1;
//   const sortOptions = { [sortBy]: sortOrder };

//   const skip = (parseInt(page) - 1) * parseInt(limit);
//   const parsedLimit = parseInt(limit);

//   const [videos, total] = await Promise.all([
//     Video.find(filters).sort(sortOptions).skip(skip).limit(parsedLimit),
//     Video.countDocuments(filters),
//   ]);

//   return res.status(200).json(
//     new ApiResponse(
//       200,
//       {
//         data: videos,
//         page: parseInt(page),
//         limit: parsedLimit,
//         totalPages: Math.ceil(total / parsedLimit),
//         totalResults: total,
//       },
//       "fetched success"
//     )
//   );
// });

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video

  if (!title || !description) {
    throw new ApiError(400, "title and description reqqd");
  }

  const videoFilePath = req.files?.videoFile[0].path;

  const thumbnailPath = req.files?.thumbnail[0].path;

  if (!videoFilePath || !thumbnailPath) {
    throw new ApiError(400, "video and thumbnail required");
  }

  const video = await uploadOnCloudinary(videoFilePath);

  if (!video) {
    throw new ApiError(400, "Error while uploading video");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailPath);

  if (!thumbnail) {
    throw new ApiError(400, "Error while uploading thumbnail");
  }

  const createdVideo = await Video.create({
    videoFile: video.url,
    thumbnail: thumbnail.url,
    title,
    description,
    duration: video.duration,
    isPublished: true,
    owner: req.user._id,
  });
  return res.status(200).json(new ApiResponse(200, createdVideo, "done"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId);
  //TODO: get video by id
  if (!video) {
    throw new ApiError(400, "file has been deleted or wrong videoId");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video, "video fetched by id"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail

  const { title, description } = req.body;
  if (!title || !description) {
    throw new ApiError(400, "tilte and desc rqed");
  }

  const thumbnailPath = req.file.path;
  if (!thumbnailPath) {
    throw new ApiError(400, "thumnail reqd");
  }
  const thumbnail = await uploadOnCloudinary(thumbnailPath);

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      title,
      description,
      thumbnail: thumbnail.url,
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "updaed video"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  const deletedVideo = await Video.findByIdAndDelete(videoId);
  return res
    .status(200)
    .json(new ApiResponse(200, deletedVideo, "deleted video"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId);
  video.isPublished = !video.isPublished; // Toggle boolean
  const toggledVideo = await video.save({ validateBeforeSave: false });
  console.log(toggledVideo);
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Toggled successfully"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
