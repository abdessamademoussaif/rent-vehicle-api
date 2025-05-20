const asyncHandler = require("express-async-handler");

const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");
const factory = require("./handlersFactory");
const Vehicle = require("../models/vehicleModel");
const ApiError = require("../utils/apiError");

exports.uploadVehicleImages = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.setVehicleImagesUrls = asyncHandler(async (req, res, next) => {
  if (!req.files) return next();

  // 1- Image Cover
  if (req.files.imageCover && req.files.imageCover.length > 0) {
    req.body.imageCover = req.files.imageCover[0].path; // path is the Cloudinary URL
  }

  // 2- Other Images
  if (req.files.images && req.files.images.length > 0) {
    req.body.images = req.files.images.map((file) => file.path);
  }
  next();
});

exports.isAuthorized = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    return next(new ApiError(`No vehicle found for id ${id}`, 404));
  }
  if (
    req.user._id.toString() !== vehicle.owner._id.toString() &&
    req.user.role !== "admin"
  ) {
    return next(new ApiError(`You are not authorized to do this action`, 403));
  }

  next();
});

// @desc    Get list of vehicles
// @route   GET /api/v1/vehicles
// @access  Public
exports.getVehicles = factory.getAll(Vehicle, "Vehicles");

// @desc    Get specific vehicle by id
// @route   GET /api/v1/vehicles/:id
// @access  Public
exports.getVehicle = factory.getOne(Vehicle, "reviews");
// @desc    Get  vehicles by user id
// @route   GET /api/v1/vehicles/user/:userId
// @access  Private
exports.getVehiclesByUserId = asyncHandler(async (req, res, next) => {
  const vehicles = await Vehicle.find({ owner: req.params.userId });
  if (!vehicles) {
    return next(new ApiError("No vehicles found for this user", 404));
  }
  res.status(200).json({
    status: "success",
    results: vehicles.length,
    data: {
      vehicles,
    },
  });
});

// @desc    Count vehicles
// @route   GET /api/v1/vehicles/count
// @access  private/admin
exports.countVehicles = factory.count(Vehicle);
// @desc    Create vehicle
// @route   POST  /api/v1/vehicles
// @access  Private
exports.createVehicle = factory.createOne(Vehicle);
// @desc    Update specific vehicle
// @route   PUT /api/v1/vehicles/:id
// @access  Private
exports.updateVehicle = factory.updateOne(Vehicle);

// @desc    Delete specific vehicle
// @route   DELETE /api/v1/vehicles/:id
// @access  Private
exports.deleteVehicle = factory.deleteOne(Vehicle);
const mongoose = require("mongoose");
