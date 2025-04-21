const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');  // Import Cloudinary configuration
const ApiError = require('../utils/apiError');
const asyncHandler = require('express-async-handler');

const multerOptions = ({ fileSizeLimit = 10 * 1024 * 1024 }) => {
  // Set up Cloudinary storage
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,  // Cloudinary instance
    params: {
      folder: 'rent_vehicle_images',  // Optional: specify folder in Cloudinary
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],  // Allowed formats
      transformation: [{ width: 500, height: 500, crop: 'limit' }]  // Optional transformations (e.g., resizing)
    }
  });

  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new ApiError('Only image files are allowed', 400), false);
    }
  };

  return multer({
    storage: storage,
    fileFilter: multerFilter,
    limits: { fileSize: fileSizeLimit }, // File size limit (e.g., 10MB)
  });
};

// Reusable middleware function for a single image upload
exports.uploadSingleImage = (fieldName, options = {}) => multerOptions(options).single(fieldName);

// Reusable middleware function for multiple image uploads
exports.uploadMixOfImages = (arrayOfFields, options = {}) =>
  multerOptions(options).fields(arrayOfFields);


exports.uploadUserImageToCloudinary = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'users',
    });

    // Save URL and public_id in request body
    req.body.profileImg = result.secure_url;
    req.body.profileImgPublicId = result.public_id;
  }

  next();
});
