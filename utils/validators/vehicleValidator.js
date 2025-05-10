const slugify = require('slugify');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const Category = require('../../models/categoryModel');
const User = require('../../models/userModel');


exports.createVehicleValidator = [
  check('title')
    .isLength({ min: 3 })
    .withMessage('must be at least 3 chars')
    .notEmpty()
    .withMessage('Vehicle required')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('description')
    .notEmpty()
    .withMessage('Vehicle description is required')
    .isLength({ max: 2000 })
    .withMessage('Too long description'),
  check('sold')
    .optional()
    .isNumeric()
    .withMessage('Vehicle sold must be a number'),
  check('pricePerDay')
    .notEmpty()
    .withMessage('Vehicle pricePerDay is required')
    .isNumeric()
    .withMessage('Vehicle pricePerDay must be a number')
    .isLength({ max: 32 })
    .withMessage('To long price'),
  check('priceAfterDiscount')
    .optional()
    .isNumeric()
    .withMessage('Vehicle priceAfterDiscount must be a number')
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error('priceAfterDiscount must be lower than price');
      }
      return true;
    }),

  check('color')
    .optional(),
  check('imageCover')
  .notEmpty()
  .withMessage('Vehicle imageCover is required'),
  check('images')
    .optional()
    .isArray()
    .withMessage('images should be array of string'),
  check('category')
    .notEmpty()
    .withMessage('Vehicle must be belong to a category')
    .isMongoId()
    .withMessage('Invalid ID formate')
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category for this id: ${categoryId}`)
          );
        }
      })
    ),

    check('owner')
    .notEmpty()
    .withMessage('Vehicle must be belong to an owner')
    .isMongoId()
    .withMessage('Invalid ID formate')
    .custom((ownerId) =>
      User.findById(ownerId).then((user) => {
        if (!user) {
          return Promise.reject(
            new Error(`No user for this id: ${ownerId}`)
          );
        }
      })
    ),
  check('mark').optional().isMongoId().withMessage('Invalid ID formate'),
  check('ratingsAverage')
    .optional()
    .isNumeric()
    .withMessage('ratingsAverage must be a number')
    .isLength({ min: 1 })
    .withMessage('Rating must be above or equal 1.0')
    .isLength({ max: 5 })
    .withMessage('Rating must be below or equal 5.0'),
  check('ratingsQuantity')
    .optional()
    .isNumeric()
    .withMessage('ratingsQuantity must be a number'),
  validatorMiddleware,
  check('capacity')
  .notEmpty()
  .withMessage('Vehicle capacity is required')
  .isNumeric()
  .withMessage('Vehicle capacity must be a number')
  .isLength({ max: 32 })
  .withMessage('To long capacity'),
  check('fuelType')
    .notEmpty()
    .withMessage('Vehicle fueltype is required')
    .isString()
    .withMessage('Vehicle fueltype must be a string')
    .isLength({ max: 32 })
    .withMessage('To long fueltype'),
    check('transmission')
    .notEmpty()
    .withMessage('Vehicle transmission is required')
    .isString()
    .withMessage('Vehicle transmission must be a string')
    .isLength({ max: 32 })
    .withMessage('To long transmission'),
    check('location')
    .notEmpty()
    .withMessage('Vehicle location is required')
    .isString()
    .withMessage('Vehicle location must be a string')
    .isLength({ max: 32 })
    .withMessage('To long location'),
    check('condition')
    .notEmpty()
    .withMessage('Vehicle condition is required')
    .isString()
    .withMessage('Vehicle condition must be a string')
    .isLength({ max: 32 })
    .withMessage('To long condition'),
  check('mileage')
    .notEmpty() 
    .withMessage('Vehicle mileage is required')
    .isNumeric() 
    .withMessage('Vehicle mileage must be a number')
    .isLength({ max: 32 })
    .withMessage('To long mileage'),
  check('year')
    .notEmpty()
    .withMessage('Vehicle year is required')
    .isNumeric()
    .withMessage('Vehicle year must be a number')
    .isLength({ max: 32 })
    .withMessage('To long year'),
  check('driveType')
    .notEmpty()
    .withMessage('Vehicle driveType is required')
    .isString()
    .withMessage('Vehicle driveType must be a string')
    .isLength({ max: 32 })
    .withMessage('To long driveType'),
  check('doorCount')
    .notEmpty()
    .withMessage('Vehicle doorCount is required')
    .isNumeric()
    .withMessage('Vehicle doorCount must be a number')
    .isLength({ max: 32 })
    .withMessage('To long doorCount'),
  check('engineSize')
    .optional()
    .isString()
    .withMessage('Vehicle engineSize must be a string')
    .isLength({ max: 32 })
    .withMessage('To long engineSize'),
  check('cylinders')
    .optional()
    .isNumeric()
    .withMessage('Vehicle cylinders must be a number')
    .isLength({ max: 32 })
    .withMessage('To long cylinders'),
  check('offerType')
    .notEmpty()
    .withMessage('Vehicle offertype is required')
    .isString()
    .withMessage('Vehicle offertype must be a string')
    .isLength({ max: 32 })
    .withMessage('To long offertype'),
  check('features')
    .optional()
    .isArray()
    .withMessage('Vehicle features must be an array of strings'),
    validatorMiddleware,
];

exports.getVehicleValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleware,
];

exports.updateVehicleValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  body('title')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteVehicleValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleware,
];
