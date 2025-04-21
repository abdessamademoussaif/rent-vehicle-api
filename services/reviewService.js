const factory = require('./handlersFactory');
const Review = require('../models/reviewModel');

// Nested route support
// Example: GET /api/v1/vehicles/:vehicleId/reviews
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.vehicleId) filterObject = { vehicle: req.params.vehicleId };
  req.filterObj = filterObject;
  next();
};

// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @access  Public
exports.getReviews = factory.getAll(Review);

// @desc    Get a single review by ID
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = factory.getOne(Review);

// Middleware to auto-fill vehicle ID and user ID in nested route
exports.setVehicleIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.vehicle) req.body.vehicle = req.params.vehicleId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

// @desc    Create a new review
// @route   POST /api/v1/reviews
// @access  Private (user)
exports.createReview = factory.createOne(Review);

// @desc    Update an existing review
// @route   PUT /api/v1/reviews/:id
// @access  Private (user)
exports.updateReview = factory.updateOne(Review);

// @desc    Delete a review
// @route   DELETE /api/v1/reviews/:id
// @access  Private (user, manager, admin)
exports.deleteReview = factory.deleteOne(Review);
