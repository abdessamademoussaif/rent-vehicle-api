const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const Booking = require('../../models/bookingModel');
const ApiError = require('../../utils/apiError');

exports.createBookingValidator = [ 
  check('vehicle')
    .isMongoId()
    .withMessage('Invalid vehicle ID format')
    .notEmpty()
    .withMessage('Vehicle is required'),
  check('startDate')
    .isISO8601()
    .withMessage('Invalid start date format')
    .notEmpty()
    .withMessage('Start date is required'),
  check('endDate')
    .isISO8601()
    .withMessage('Invalid end date format')
    .notEmpty()
    .withMessage('End date is required'),
];



exports.isVehicleAlreadyBooked = async (req, res, next) => {
  try {
    const { vehicle, startDate, endDate } = req.body;

    const query = {
      vehicle,
      status: { $in: ["pending", "confirmed"] },
      $or: [
        { startDate: { $lte: endDate, $gte: startDate } },
        { endDate: { $gte: startDate, $lte: endDate } },
        { startDate: { $lte: startDate }, endDate: { $gte: endDate } }
      ]
    };

    const isBooking = await Booking.findOne(query);

    if (isBooking) {
      return next(
        new ApiError(
          `This vehicle is already booked until ${new Date(isBooking.endDate).toLocaleDateString()}`,
          400
        )
      );
    }

    next();
  } catch (err) {
    next(err);
  }
};
