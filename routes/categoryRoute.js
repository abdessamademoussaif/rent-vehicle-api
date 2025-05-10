const express = require('express');

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require('../utils/validators/categoryValidator');

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  uploadCategoryImageToCloudinary,
} = require('../services/categoryService');

const authService = require('../services/authService');


const router = express.Router();


router
  .route('/')
  .get(getCategories)
  .post(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadCategoryImage,
    uploadCategoryImageToCloudinary,
    createCategoryValidator,
    createCategory
  );
router
  .route('/:id')
  .get(getCategoryValidator, getCategory)
  .put(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadCategoryImage,
    uploadCategoryImageToCloudinary,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
