const asyncHandler = require("express-async-handler");
const Booking = require("../models/bookingModel");
const Vehicle = require("../models/vehicleModel");
const ApiError = require("../utils/apiError");
const Notification = require("../models/notificationModel");
const mongoose = require("mongoose");
const generatePdfBuffer = require("../utils/generatePdf");
const sendEmail = require("../utils/sendEmail");

// @desc    Create a new booking
// @route   POST /api/v1/bookings
// @access  Private
exports.createBooking = asyncHandler(async (req, res, next) => {
  const { vehicle, userPhone, userAddress, startDate, endDate, name } =
    req.body;
  const user = req.user.id;
  const userEmail = req.user.email;

  // Calculate total booking days
  const totalDays = Math.ceil(
    (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
  );

  // Fetch vehicle and owner details
  const vehicleDetails = await Vehicle.findById(vehicle).populate(
    "owner",
    "email name"
  );
  if (!vehicleDetails) {
    return next(new ApiError("Vehicle not found", 404));
  }

  const ownerEmail = vehicleDetails.owner.email;
  const ownerName = vehicleDetails.owner.name;
  const totalPrice = vehicleDetails.pricePerDay * totalDays;

  // Create booking
  const booking = await Booking.create({
    vehicle,
    user,
    userPhone,
    userAddress,
    startDate,
    endDate,
    totalPrice,
  });

  
  const populatedBooking = await Booking.findById(booking._id)
    .populate("user", "name email phone")
    .populate("vehicle", "model title location pricePerDay");

    // Create notification
  await Notification.create({
    recipient: vehicleDetails.owner._id,
    type: "reservation",
    content: `New reservation request from ${populatedBooking.user.name} for your vehicle.`,
    metadata: {
      vehicleId: vehicleDetails._id,
      reservationId: booking._id,
    },
  });

  const message = `
    <table style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 40px 30px; font-family: Arial, sans-serif; border: 1px solid #eee; border-radius: 8px;" width="100%" cellspacing="0" cellpadding="0">
      <tbody>
        <tr>
          <td align="left">
            <img src="https://res.cloudinary.com/dsk3xnvyc/image/upload/v1745161490/easytrans_2_lrvfrb.png" alt="EASYTRANS Logo" width="100" />
          </td>
          <td align="right">
            <a href="https://facebook.com"><img src="https://img.icons8.com/ios-glyphs/30/facebook.png" alt="Facebook" width="20" /></a>
            <a href="https://twitter.com"><img src="https://img.icons8.com/ios-glyphs/30/twitter.png" alt="Twitter" width="20" /></a>
            <a href="#"><img src="https://img.icons8.com/ios-glyphs/30/mac-os.png" alt="Apple" width="20" /></a>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding-top: 30px;">
            <h2 style="font-size: 20px; color: #2c3e50; margin-bottom: 10px;">Hi ${ownerName},</h2>
            <p style="font-size: 16px; color: #555;">You have a new reservation. Please find the details below.</p>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding-top: 20px;">
            <table width="100%" cellpadding="8" cellspacing="0" style="background-color: #f9f9f9; border-collapse: collapse; border-radius: 6px;">
              <tbody>
                <tr><td style="font-weight: bold; color: #2c3e50;">Name:</td><td>${populatedBooking.user.name}</td></tr>
                <tr><td style="font-weight: bold; color: #2c3e50;">Phone:</td><td>${userPhone}</td></tr>
                <tr><td style="font-weight: bold; color: #2c3e50;">Email:</td><td>${userEmail}</td></tr>
                <tr><td style="font-weight: bold; color: #2c3e50;">Start Date:</td><td>${startDate}</td></tr>
                <tr><td style="font-weight: bold; color: #2c3e50;">End Date:</td><td>${endDate}</td></tr>
                <tr><td style="font-weight: bold; color: #2c3e50;">Address:</td><td>${userAddress}</td></tr>
                <tr><td style="font-weight: bold; color: #2c3e50;">Total:</td><td>${totalPrice} DH</td></tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding-top: 30px; text-align: center; font-size: 14px; color: #888;">
            By EASYTRANS Company
          </td>
        </tr>
        <tr>
          <td colspan="2" align="center" style="padding-top: 20px;">
            <img src="https://res.cloudinary.com/dsk3xnvyc/image/upload/v1745161232/vite_zc7ank.png" alt="EASYTRANS Footer Logo" width="60" />
          </td>
        </tr>
      </tbody>
    </table>
  `;

  try {
    const pdfBuffer = await generatePdfBuffer({
      data: populatedBooking,
      userAddress,
    });

    await sendEmail({
      email: ownerEmail,
      subject: "New Reservation",
      message,
      pdfBuffer,
    });
  } catch (error) {
    console.error("Email or PDF error:", error.message);
  }

  res.status(201).json({ data: populatedBooking });
});

// @desc    Get all bookings
// @desc    Get /api/v1/bookings
// @desc    Private/admin
exports.getAllBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find().populate(
    "vehicle",
    "title model imageCover pricePerDay location"
  );
  res.status(200).json({ data: bookings });
});
// @desc    Get specific booking
// @desc    Get /api/v1/bookings/:id
// @desc    Private
exports.getBookingById = asyncHandler(async (req, res, next) => {
  const bookingId = req.params.id;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return res.status(400).json({ message: "Invalid booking ID." });
  }

  const booking = await Booking.findById(bookingId)
    .populate({
      path: "vehicle",
      select: "_id title model imageCover pricePerDay location owner",
      populate: { path: "owner", select: "_id name email" },
    })
    .populate({
      path: "user",
      select: "_id name email phone address",
    });

  if (!booking) {
    return res.status(404).json({ message: "Booking not found." });
  }

  if (
    booking.vehicle.owner._id.toString() !== userId.toString() &&
    booking.user._id.toString() !== userId.toString()
  ) {
    return res
      .status(403)
      .json({ message: "You are not authorized to view this booking." });
  }

  res.status(200).json(booking);
});
// @desc    Get all bookings for a user
// @route   GET /api/v1/bookings/user/:userId
// @access  Private
exports.getUserBookings = asyncHandler(async (req, res, next) => {
  const user = req.user._id;
  const userId = req.params.userId;
  if (user.toString() !== userId.toString()) {
    return next(
      new ApiError("You are not authorized to view this booking", 403)
    );
  }
  if (!userId) {
    userId = req.user._id;
  }
  const bookings = await Booking.find({
    user: userId,
    status: { $ne: "cancelled" },
  })
    .populate("vehicle", "title imageCover pricePerDay location")
    .populate("user", "name email phone ");
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
    return next(new ApiError("Booking not found", 404));
  }

  // Only the user who made the booking can update it
  if (booking.user.toString() !== req.user._id.toString()) {
    return next(new ApiError("Not authorized to update this booking", 403));
  }

  booking.startDate = startDate;
  booking.endDate = endDate;

  await booking.save();

  res.status(200).json({ data: booking });
});

// @desc    Update booking status
// @route   PUT /api/v1/bookings/:id
// @access  Private
exports.updateBookingStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const userId = req.user.id;
  const bookingId = req.params.id;

  const booking = await Booking.findById(bookingId).populate(
    "vehicle",
    "owner"
  );

  if (!booking) {
    return next(new ApiError("Booking not found", 404));
  }
  if (userId.toString() !== booking.vehicle.owner._id.toString()) {
    return next(
      new ApiError("You are not authorized to update this booking ", 403)
    );
  }

  booking.status = status;
  await booking.save();

  res.status(200).json({ data: booking });
});

// @desc    Cancel a booking
// @route   DELETE /api/v1/bookings/:id
// @access  Private (User or Admin/Manager)
exports.cancelBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ApiError("Booking not found", 404));
  }

  // Only the booking owner or admin/manager can delete
  if (booking.user.toString() !== req.user._id.toString()) {
    return next(
      new ApiError("You are not authorized to cancel this booking", 403)
    );
  }
  booking.status = "cancelled";
  await booking.save();

  res.status(204).send();
});
