const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const path = require('path');

const factory = require('./handlersFactory');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const Mark = require('../models/markModel');

// Upload single image
exports.uploadMarkImage = uploadSingleImage('image');

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const mimeType = req.file.mimetype;
  const originalExt = mimeType.split('/')[1];
  const extension = ['jpeg', 'png', 'webp'].includes(originalExt) ? originalExt : 'jpeg';
  const filename = `mark-${uuidv4()}-${Date.now()}.${extension}`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFile(`uploads/marks/${filename}`);

  // Save image into our db 
   req.body.image = filename;

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
