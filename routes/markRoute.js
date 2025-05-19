const express = require("express");
const {
  getMarkValidator,
  createMarkValidator,
  updateMarkValidator,
  deleteMarkValidator,
} = require("../utils/validators/markValidator");

const authService = require("../services/authService");

const {
  getMarks,
  getMark,
  createMark,
  updateMark,
  deleteMark,
  uploadMarkImage,
  uploadMarkImageToCloudinary,
  countMarks,
} = require("../services/markService");

const router = express.Router();

router
  .route("/")
  .get(getMarks)
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadMarkImage,
    uploadMarkImageToCloudinary,
    createMarkValidator,
    createMark
  );
router
  .route("/count")
  .get(authService.protect, authService.allowedTo("admin"), countMarks);
router
  .route("/:id")
  .get(getMarkValidator, getMark)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadMarkImage,
    uploadMarkImageToCloudinary,
    updateMarkValidator,
    updateMark
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteMarkValidator,
    deleteMark
  );

module.exports = router;
