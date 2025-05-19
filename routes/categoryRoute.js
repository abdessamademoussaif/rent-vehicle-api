const express = require("express");

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  uploadCategoryImageToCloudinary,
  countCategories,
} = require("../services/categoryService");

const authService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .get(getCategories)
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadCategoryImage,
    uploadCategoryImageToCloudinary,
    createCategoryValidator,
    createCategory
  );
  router
    .route("/count")
    .get(authService.protect, authService.allowedTo("admin"), countCategories);
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadCategoryImage,
    uploadCategoryImageToCloudinary,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
