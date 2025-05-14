const express = require('express');
const {
  createBookingValidator,
  isVehicleAlreadyBooked,
} = require('../utils/validators/bookingValidator');
const authService = require('../services/authService');
const {
  createBooking,
  getUserBookings,
  updateUserBooking,
  updateBookingStatus,
  cancelBooking,
  getAllBookings,
  getBookingById,
} = require('../services/bookingService');

const router = express.Router();

router
.get('/',authService.protect,authService.allowedTo('admin'),getAllBookings)
.get('/:id',authService.protect,getBookingById)
.get('/user/:userId',authService.protect, getUserBookings)
.post('/',authService.protect,createBookingValidator,isVehicleAlreadyBooked,createBooking)
.patch('/:id/status',authService.protect, updateBookingStatus)
.put('/:id',authService.protect,isVehicleAlreadyBooked,updateUserBooking)
.delete('/:id',authService.protect, cancelBooking);

module.exports = router;
