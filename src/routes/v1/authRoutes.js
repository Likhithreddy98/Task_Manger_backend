const express = require('express');
const passport = require('passport');
const router = express.Router();
const { register, login, googleCallback, getMe } = require('../../controllers/authController');
const auth = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { registerSchema, loginSchema } = require('../../validations/authValidation');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and authorization endpoints
 */


router.post('/register', validate(registerSchema), register);


router.post('/login', validate(loginSchema), login);


router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);


router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=google_auth_failed`,
  }),
  googleCallback
);


router.get('/me', auth, getMe);

module.exports = router;
