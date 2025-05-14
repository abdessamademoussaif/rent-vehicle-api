const mongoose = require('mongoose');
const Vehicle= require('./vehicleModel');

const reviewSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    ratings: {
      type: Number,
      min: [1, 'Min ratings value is 1.0'],
      max: [5, 'Max ratings value is 5.0'],
      required: [true, 'review ratings required'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to user'],
    },
    // parent reference (one to many)
    vehicle: {
      type: mongoose.Schema.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Review must belong to vehicle'],
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name' });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (vehicleId){
  const result = await this.aggregate([
    // Stage 1 : get all reviews in specific vehicle
    {
      $match: { vehicle: vehicleId },
    },
    // Stage 2: Grouping reviews based on vehicleID and calc avgRatings
    {
      $group: {
        _id: '$vehicle',
        avgRatings: { $avg: '$ratings' },
      },
    },
  ]);

  // console.log(result);
  if (result.length > 0) {
    await Vehicle.findByIdAndUpdate(vehicleId, {
      ratingsAverage:  parseFloat(result[0].avgRatings.toFixed(1)),
    });
  } else {
    await Vehicle.findByIdAndUpdate(vehicleId, {
      ratingsAverage: 0,
    });
  }
};

reviewSchema.index({ vehicle: 1, user: 1 }, { unique: true });

reviewSchema.post('save', async function () {
  await this.constructor.calcAverageRatings(this.vehicle);
});

reviewSchema.post('remove', async function () {
  await this.constructor.calcAverageRatings(this.vehicle);
});

module.exports = mongoose.model('Review', reviewSchema);
