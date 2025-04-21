const express = require('express');
const {
  getVehicleValidator,
  createVehicleValidator,
  updateVehicleValidator,
  deleteVehicleValidator,
} = require('../utils/validators/VehicleValidator');

const {
  getVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  uploadVehicleImages,
  resizeVehicleImages,
} = require('../services/vehicleService');
const authService = require('../services/authService');
const reviewsRoute = require('./reviewRoute');

const router = express.Router();

// POST   /vehicles/jkshjhsdjh2332n/reviews
// GET    /vehicles/jkshjhsdjh2332n/reviews
// GET    /vehicles/jkshjhsdjh2332n/reviews/87487sfww3
router.use('/:vehicleId/reviews', reviewsRoute); 
router
  .route('/')
  .get(getVehicles)
  .post(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadVehicleImages,
    resizeVehicleImages,
    createVehicleValidator,
    createVehicle
  );
router
  .route('/:id')
  .get(getVehicleValidator, getVehicle)
  .put(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadVehicleImages,
    resizeVehicleImages,
    updateVehicleValidator,
    updateVehicle
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deleteVehicleValidator,
    deleteVehicle
  );

module.exports = router;
