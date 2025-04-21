const express = require('express');
const {
  getMarkValidator,
  createMarkValidator,
  updateMarkValidator,
  deleteMarkValidator,
} = require('../utils/validators/MarkValidator');

const authService = require('../services/authService');

const {
  getMarks,
  getMark,
  createMark,
  updateMark,
  deleteMark,
  uploadMarkImage,
  resizeImage,
} = require('../services/markService');

const router = express.Router();

router
  .route('/')
  .get(getMarks)
  .post(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadMarkImage,
    resizeImage,
    createMarkValidator,
    createMark
  );
router
  .route('/:id')
  .get(getMarkValidator, getMark)
  .put(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadMarkImage,
    resizeImage,
    updateMarkValidator,
    updateMark
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deleteMarkValidator,
    deleteMark
  );

module.exports = router;
