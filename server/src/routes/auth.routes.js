const express = require('express');
const passport = require('passport');
const router = express.Router();

const {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  oauthCallback,
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/authMiddleware');

// ─── Local JWT Auth ───────────────────────────────────────────────────────────
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

// ─── Google OAuth ─────────────────────────────────────────────────────────────
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login?error=google_failed' }),
  oauthCallback
);

// ─── GitHub OAuth ─────────────────────────────────────────────────────────────
router.get(
  '/github',
  passport.authenticate('github', {
    scope: ['user:email'],
    session: false,
  })
);

router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/login?error=github_failed' }),
  oauthCallback
);

module.exports = router;
