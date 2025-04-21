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

    // Set token in HTTP-only cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // secure in prod
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Redirect to frontend with message only (no token in URL)
    res.redirect(`${process.env.CLIENT_URL}/dashboard?messages=success[0]=signin-success`);
  }
);

module.exports = router;
