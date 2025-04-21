const asyncHandler = require('express-async-handler');
const Booking = require('../models/bookingModel');
const Vehicle = require('../models/vehicleModel');
const ApiError = require('../utils/apiError');

// @desc    Create a new booking
// @route   POST /api/v1/bookings  
// @access  Private
exports.createBooking = asyncHandler(async (req, res, next) => {
  const { vehicle, startDate, endDate} = req.body;
  const user = req.user._id;
  let totalPrice;
  const totalDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
  const vehicleDetails = await Vehicle.findById(vehicle);
  if (vehicleDetails) {
    totalPrice = vehicleDetails.pricePerDay * totalDays;
  } else {
    return next(new ApiError('Vehicle not found', 404));
  }


  const booking = await Booking.create({
    vehicle,
    user,
    startDate,
    endDate,
    totalPrice
  });
  res.status(201).json({ data: booking });
});

// @desc    Get all bookings for a user
// @route   GET /api/v1/bookings/user/:userId
// @access  Private
exports.getUserBookings = asyncHandler(async (req, res, next) => {
  const user = req.user._id;
  const userId = req.params.userId;
  if (user.toString() !== userId) {
    return next(new ApiError('You are not authorized to view this booking', 403));
  }
  if (!userId) {
    userId = req.user._id;
  }
  const bookings = await Booking.find({ user: userId })
    .populate('vehicle', 'title imageCover pricePerDay location');

  if (!bookings.length) {
    return next(new ApiError('No bookings found for this user', 404));
  }

  res.status(200).json({ data: bookings });
});

// @desc     a booking by Updatethe user
// @route   PUT /api/v1/bookings/:id
// @access  Private (Only booking owner)
exports.updateUserBooking = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.body;

  // Find the booking
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ApiError('Booking not found', 404));
  }

  // Only the user who made the booking can update it
  if (booking.user.toString() !== req.user._id.toString()) {
    return next(new ApiError('Not authorized to update this booking', 403));
  }

  booking.startDate = startDate;
  booking.endDate = endDate;

  await booking.save();

  res.status(200).json({ data: booking });
});

// @desc    Update booking status
// @route   PUT /api/v1/bookings/:id
// @access  Private/Admin-Manager
exports.updateBookingStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    {
       status 
    },
    { new: true }
  );

  if (!booking) {
    return next(new ApiError('Booking not found', 404));
  }

  res.status(200).json({ data: booking });
});

// @desc    Cancel a booking
// @route   DELETE /api/v1/bookings/:id
// @access  Private (User or Admin/Manager)
exports.cancelBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ApiError('Booking not found', 404));
  }

  // Only the booking owner or admin/manager can delete
  if ( booking.user.toString() !== req.user._id.toString() ) {
    return next(new ApiError('You are not authorized to cancel this booking', 403));
  }

  await booking.deleteOne();

  res.status(204).send();
});
