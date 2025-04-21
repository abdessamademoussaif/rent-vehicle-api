const slugify = require('slugify');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.getMarkValidator = [
  check('id').isMongoId().withMessage('Invalid Mark id format'),
  validatorMiddleware,
];

exports.createMarkValidator = [
  check('name')
    .notEmpty()
    .withMessage('Mark required')
    .isLength({ min: 3 })
    .withMessage('Too short Mark name')
    .isLength({ max: 32 })
    .withMessage('Too long Mark name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.updateMarkValidator = [
  check('id').isMongoId().withMessage('Invalid Mark id format'),
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteMarkValidator = [
  check('id').isMongoId().withMessage('Invalid Mark id format'),
  validatorMiddleware,
];
