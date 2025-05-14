const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');  
const ApiError = require('../utils/apiError');
const multerOptions = ({ fileSizeLimit = 10 * 1024 * 1024 }) => {

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,  
    params: {
      folder: 'rent_vehicle_images', 
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],  
      transformation: [{ width: 500, height: 500, crop: 'limit' }]  
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
    limits: { fileSize: fileSizeLimit }, 
  });
};
 

exports.uploadSingleImage = (fieldName, options = {}) => multerOptions(options).single(fieldName);


exports.uploadMixOfImages = (arrayOfFields, options = {}) =>
  multerOptions(options).fields(arrayOfFields); 
