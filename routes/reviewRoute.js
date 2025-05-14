const express = require('express');

const {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteReviewValidator,
} = require('../utils/validators/reviewValidator');

const {
  getReview,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  createFilterObj,
  setVehicleIdAndUserIdToBody,
} = require('../services/reviewService');

const authService = require('../services/authService');
const setReviewParam = require('../middlewares/setReviewParam');
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(setReviewParam ,createFilterObj , getReviews)
  .post(
    authService.protect,
    setVehicleIdAndUserIdToBody,
    createReviewValidator,
    createReview
  )
router 
  .route('/:id')
  .get(getReviewValidator, getReview)
  .put(
    authService.protect,
    authService.allowedTo('user'),
    updateReviewValidator,
    updateReview
  )
  .delete(
    authService.protect,
    authService.allowedTo('user', 'manager', 'admin'),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
