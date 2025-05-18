const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Booking must be for a vehicle'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Booking must be made by a user'],
    },
    userPhone:{
      type: String,
    },
    userAddress:{
      type: String,
    },
    startDate: {
      type: Date,
      required: [true, 'Booking start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'Booking end date is required'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

bookingSchema.pre(/^find/, function (next) {
  this.sort({ createdAt: -1 });
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
