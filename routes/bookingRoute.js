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
} = require('../services/bookingService');

const router = express.Router();

// Create a new booking
router.post('/',
   authService.protect,
   createBookingValidator,
   isVehicleAlreadyBooked, 
   createBooking
  );

// Get all bookings of a user
router.get('/user/:userId', authService.protect, getUserBookings);

// Update booking status (only for admin or manager)
router.put('/:id', authService.protect, authService.allowedTo('admin', 'manager'), updateBookingStatus);

router.put(
  '/:id',
  authService.protect,
  authService.allowedTo('user'),
  isVehicleAlreadyBooked,
  updateUserBooking
);

// Cancel a booking
router.delete('/:id', authService.protect, authService.allowedTo('admin', 'manager'), cancelBooking);

module.exports = router;
