const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const factory = require("./handlersFactory");
const ApiError = require("../utils/apiError");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const createToken = require("../utils/createToken");
const User = require("../models/userModel");
const cloudinary = require("../config/cloudinary");

// Upload single image
exports.uploadUserImage = uploadSingleImage("profileImg");

exports.uploadUserImageToCloudinary = asyncHandler(async (req, res, next) => {
  if (req.file) {
    console.log("req.body:", req.body);
    console.log("req.files:", req.file);
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "users",
    });

    // Save URL and public_id in request body
    req.body.profileImg = result.secure_url;
    req.body.profileImgPublicId = result.public_id;
  }
  next();
});

// @desc    Get list of users
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getUsers = factory.getAll(User);

// @desc    Get specific user by id
// @route   GET /api/v1/users/:id
// @access  Private/Admin
exports.getUser = factory.getOne(User);

// @desc    Create user
// @route   POST  /api/v1/users
// @access  Private/Admin
exports.createUser = factory.createOne(User);

// @desc    Update specific user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      role: req.body.role,
    },
  );
  res.status(200).json({ data: document });
});
// @desc    Change user password
// @route   PUT /api/v1/users/changePassword/:id
// @access  Private/Admin
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

// @desc    Delete specific user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = factory.deleteOne(User);

// @desc    Get Logged user data
// @route   GET /api/v1/users/getMe
// @access  Private/Protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc    Count users
// @route   GET /api/v1/users/count
// @access  Private/Admin
exports.countUsers = factory.count(User)

// @desc    Update logged user password
// @route   PUT /api/v1/users/updateMyPassword
// @access  Private/Protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  // 1) Update user password based user payload (req.user._id)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  // 2) Generate token
  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
});

// @desc    Update logged user data (without password, role)
// @route   PUT /api/v1/users/updateMe
// @access  Private/Protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      phone: req.body.phone,
    },
    { new: true }
  );

  res.status(200).json({ data: updatedUser });
});

// @desc    Update logged user image
// @route   PUT /api/v1/users/updateImgMe
// @access  Private/Protect
exports.updateLoggedUserImage = asyncHandler(async (req, res, next) => {
  const updateUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      profileImg: req.body.profileImg,
      profileImgPublicId: req.body.profileImgPublicId,
    },
    { new: true }
  );
  res.status(200).json({ data: updateUser });
});

// @desc    Deactivate logged user
// @route   DELETE /api/v1/users/deleteMe
// @access  Private/Protect
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status((2007)[[]]).json({ status: "Success" });
});
// @desc    Deactivate user
// @route   DELETE /api/v1/users/deactivate/:id
// @access  Private/Admin

exports.deactivateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { active: false },
    { new: true }
  );

  if (!user) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }

  res.status(200).json({ status: "success", data: null });
});

// @desc    Activate user
// @route   PUT /api/v1/users/activate/:id
// @access  Private/Admin

exports.activateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { active: true },
    { new: true }
  );

  if (!user) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }

  res.status(200).json({ status: "success", data: null });
});


