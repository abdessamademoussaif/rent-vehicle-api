const mongoose = require('mongoose');
const slugify = require('slugify');
const vehicleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, 'Too short product title'],
      maxlength: [100, 'Too long product title'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      minlength: [20, 'Too short product description'],
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    slug: {
      type: String, 
      lowercase: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Vehicle capacity is required'],
      min: [1, 'Vehicle capacity must be above 0'],
    },
    model: {
      type: String
    },
    fuelType: {
      type: String,
      required: [true, 'Vehicle fuel type is required'],
      enum: {
        values: ['petrol', 'diesel', 'electric','hybrid'],
        message: 'Fuel type is either: petrol, diesel, electric, hybrid',
      },
    },
    transmission: {
      type: String,
      required: [true, 'Vehicle transmission is required'],
      enum: {
        values: ['manual', 'automatic'],
        message: 'Transmission is either: manual, automatic',
      },
    },
    location: {
      type: String,
      required: [true, 'Vehicle location is required'],
      trim: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    condition: {
      type: String,
      required: [true, 'Vehicle condition is required'],
      enum: {
        values: ['new', 'used'],
        message: 'Condition is either: new, used',
      },
    },
    mileage: {
      type: Number,
      required: [true, 'Vehicle mileage is required'],
      min: [0, 'Vehicle mileage must be above 0'],
    },
    year: {
      type: Number, 
      required: [true, 'Vehicle year is required'],
      min: [1886, 'Vehicle year must be above 1886'],
    },
    driveType: {
      type: String,
      required: [true, 'Vehicle drive type is required'],
      enum: {
        values: ['FWD', 'RWD', 'AWD','4WD'],
        message: 'Drive type is either: FWD, RWD, AWD, 4WD',
      },
    },
    doorCount: {
      type: Number,
      required: [true, 'Vehicle door count is required'],
      min: [1, 'Vehicle door count must be above 0'],
    },
    engineSize: {
      type: String,
      trim: true,
    },
    cylinders: {
      type: Number,
      min: [1, 'Vehicle cylinders must be above 0'],
    },
    offerType: {
      type: String,
      required: [true, 'Vehicle offer type is required'],
      enum: {
        values: ['rent', 'sale'],
        message: 'Offer type is either: rent, sale',
      },
    },
    features: {
      type: [String],
    },
    sold: {
      type: Number,
      default: 0,
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Vehicle price is required'],
      trim: true,
      max: [200000, 'Too long Vehicle price'],
    },
    priceAfterDiscount: {
      type: Number,
    },
    color: [String],
    imageCover: {
      type: String,
      required: [true, 'Vehicle Image cover is required'],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'Vehicle must be belong to category'],
    },
    mark: {
      type: mongoose.Schema.ObjectId,
      ref: 'Mark',
      required: [true, 'Vehicle must be belong to mark'],
    },

    ratingsAverage: {
      type: Number,
      min: [1, 'Rating must be above or equal 1.0'],
      max: [5, 'Rating must be below or equal 5.0'],
      // set: (val) => Math.round(val * 10) / 10, // 3.3333 * 10 => 33.333 => 33 => 3.3
    },
  },
  {
    timestamps: true,
    // to enable virtual populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
vehicleSchema.index({ pricePerDay: 1 });
vehicleSchema.index({ fuelType: 1 });
vehicleSchema.index({ category: 1 });
vehicleSchema.index({ location: 'text' });
vehicleSchema.index({ pricePerDay: 1, ratingsAverage: -1 });
vehicleSchema.index({ fuelType: 1, category: 1, pricePerDay: 1 });

vehicleSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'vehicle',
  localField: '_id',
});

// Mongoose query middleware
vehicleSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'category',
    select: 'name ',
  }).populate({
    path: 'mark',
    select: 'name ',
  }).populate({
    path: 'owner',
    select: 'title name email phone profileImg',
  }).sort({ ratingsAverage: -1 });
  next();
});
vehicleSchema.pre('save', function (next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
