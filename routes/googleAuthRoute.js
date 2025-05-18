const express = require('express');
const passport = require('passport');
const createToken = require('../utils/createToken');

const router = express.Router();

// Redirect to Google
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback route after Google login
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = createToken(req.user._id);
    res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
  }
);

module.exports = router;
