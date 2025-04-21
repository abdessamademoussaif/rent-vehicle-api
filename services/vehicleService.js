const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');

const { uploadMixOfImages } = require('../middlewares/uploadImageMiddleware');
const factory = require('./handlersFactory');
const Vehicle = require('../models/vehicleModel');

exports.uploadVehicleImages = uploadMixOfImages([
  {
    name: 'imageCover',
    maxCount: 1,
    
  },
  {
    name: 'images',
    maxCount: 5,
  },
  
]);
exports.resizeVehicleImages = asyncHandler(async (req, res, next) => {
  
  // console.log(req.files);
  //1- Image processing for imageCover
  if (req.files.imageCover) {
    const imageCoverFileName = `vehicle-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/vehicles/${imageCoverFileName}`);

    // Save image into our db
    req.body.imageCover = imageCoverFileName;
  }
  //2- Image processing for images
  if (req.files.images) {
    console.log("2");
    req.body.images = [];
    console.log("3");
    await Promise.all(
      
      req.files.images.map(async (img, index) => {
        
        const imageName = `vehicle-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
         
        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 95 })
          .toFile(`uploads/vehicles/${imageName}`);
          
        // Save image into our db
        req.body.images.push(imageName);
      })
    );
  }
  next();
});

// @desc    Get list of vehicles
// @route   GET /api/v1/vehicles
// @access  Public
exports.getVehicles = factory.getAll(Vehicle, 'Vehicles');

// @desc    Get specific vehicle by id
// @route   GET /api/v1/vehicles/:id
// @access  Public
exports.getVehicle = factory.getOne(Vehicle, 'reviews');
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
;