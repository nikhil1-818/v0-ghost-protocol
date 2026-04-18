const User = require('../models/user.model');
const { sendTokens, generateAccessToken } = require('../utils/jwt.utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ─── @desc    Register new user
// ─── @route   POST /api/auth/register
// ─── @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    const user = await User.create({ name, email, password });

    const { accessToken, refreshToken } = sendTokens(res, user);

    // Store hashed refresh token
    const salt = await bcrypt.genSalt(10);
    user.refreshToken = await bcrypt.hash(refreshToken, salt);
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      accessToken,
      user: user.toPublicJSON(),
    });
  } catch (err) {
    next(err);
  }
};

// ─── @desc    Login user
// ─── @route   POST /api/auth/login
// ─── @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const { accessToken, refreshToken } = sendTokens(res, user);

    const salt = await bcrypt.genSalt(10);
    user.refreshToken = await bcrypt.hash(refreshToken, salt);
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: 'Logged in successfully.',
      accessToken,
      user: user.toPublicJSON(),
    });
  } catch (err) {
    next(err);
  }
};

// ─── @desc    Refresh access token
// ─── @route   POST /api/auth/refresh
// ─── @access  Public (requires refreshToken cookie)
const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ success: false, message: 'No refresh token provided.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token.' });
    }

    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || !user.refreshToken) {
      return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
    }

    const accessToken = generateAccessToken(user._id);

    res.json({ success: true, accessToken });
  } catch (err) {
    next(err);
  }
};

// ─── @desc    Logout
// ─── @route   POST /api/auth/logout
// ─── @access  Private
const logout = async (req, res, next) => {
  try {
    // Clear refresh token in DB
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    next(err);
  }
};

// ─── @desc    Get current user
// ─── @route   GET /api/auth/me
// ─── @access  Private
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user.toPublicJSON() });
};

// ─── @desc    OAuth callback handler (Google & GitHub)
// ─── Triggered by passport strategies after successful OAuth
const oauthCallback = async (req, res, next) => {
  try {
    const user = req.user;

    const { accessToken, refreshToken } = sendTokens(res, user);

    // Store hashed refresh token
    const salt = await bcrypt.genSalt(10);
    user.refreshToken = await bcrypt.hash(refreshToken, salt);
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Redirect to frontend with access token as query param
    // Frontend should immediately store it and remove from URL
    const clientURL = process.env.CLIENT_URL || 'http://localhost:3000';
    res.redirect(`${clientURL}/auth/callback?token=${accessToken}`);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, refreshToken, logout, getMe, oauthCallback };
