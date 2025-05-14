const express = require('express');
const authService = require('../services/authService');
const {getAllNotification,markAsRead} = require('../services/notificationService')
const router = express.Router();


router.get("/", authService.protect, getAllNotification);
router.patch("/:id/read", authService.protect, markAsRead);

module.exports = router;
