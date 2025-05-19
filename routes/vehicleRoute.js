const express = require('express');
const {
  getVehicleValidator,
  createVehicleValidator,
  updateVehicleValidator,
  deleteVehicleValidator,
} = require('../utils/validators/vehicleValidator');

const {
  getVehicles,
  getVehicle,
  getVehiclesByUserId,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  uploadVehicleImages,
  setVehicleImagesUrls,
  countVehicles,
  isAuthorized,
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
    authService.allowedTo('admin', 'manager','user'),
    uploadVehicleImages,
    setVehicleImagesUrls,
    createVehicleValidator,
    createVehicle
  );

  router.route('/count').get(
    authService.protect,
    authService.allowedTo('admin'),
    countVehicles
  );

router
  .route('/:id')
  .get(getVehicleValidator, getVehicle)
  .put(
    authService.protect,
    authService.allowedTo('admin', 'manager','user'),
    uploadVehicleImages,
    setVehicleImagesUrls,
    updateVehicleValidator,
    updateVehicle
  )
  .delete(
    authService.protect,
    deleteVehicleValidator,
    isAuthorized,
    deleteVehicle
  );
  router.route('/user/:userId').get(
    authService.protect,
    authService.allowedTo('admin', 'manager','user'),
    getVehiclesByUserId
  );

  


module.exports = router;
