const asyncHandler = require('express-async-handler');
const factory = require('./handlersFactory');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const Category = require('../models/categoryModel');
const cloudinary = require('../config/cloudinary');


exports.uploadCategoryImage = uploadSingleImage('image');

exports.uploadCategoryImageToCloudinary = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'categories',
    });

    req.body.image = result.secure_url;
  }
  next();
});


// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = factory.getAll(Category);

// @desc    Get specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = factory.getOne(Category);

// @desc    Create category
// @route   POST  /api/v1/categories
// @access  Private/Admin-Manager
exports.createCategory = factory.createOne(Category);

// @desc    Update specific category
// @route   PUT /api/v1/categories/:id
// @access  Private/Admin-Manager
exports.updateCategory = factory.updateOne(Category);

// @desc    Delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin
exports.deleteCategory = factory.deleteOne(Category);


// @desc    count all categories
// @route   get /api/v1/categories/count
// @access  Private/Admin
exports.countCategories = factory.count(Category);
