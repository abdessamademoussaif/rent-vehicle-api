const asyncHandler = require('express-async-handler');
const path = require('path');
const factory = require('./handlersFactory');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const Mark = require('../models/markModel');
const cloudinary = require('../config/cloudinary');


exports.uploadMarkImage = uploadSingleImage('image');

exports.uploadMarkImageToCloudinary = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'Marks',
    });

    req.body.image = result.secure_url;
  }
  next();
});

// @desc    Get list of Marks
// @route   GET /api/v1/marks
// @access  Public
exports.getMarks = factory.getAll(Mark);

// @desc    Get specific mark by id
// @route   GET /api/v1/marks/:id
// @access  Public
exports.getMark = factory.getOne(Mark);

// @desc    Create mark
// @route   POST  /api/v1/marks
// @access  Private
exports.createMark = factory.createOne(Mark);

// @desc    Update specific mark
// @route   PUT /api/v1/marks/:id
// @access  Private
exports.updateMark = factory.updateOne(Mark);

// @desc    Delete specific mark
// @route   DELETE /api/v1/marks/:id
// @access  Private
exports.deleteMark = factory.deleteOne(Mark);

// @desc    count all marks
// @route   get /api/v1/marks/count
// @access  Private/admin
exports.countMarks = factory.count(Mark);
