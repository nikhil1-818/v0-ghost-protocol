const express = require('express');
const router = express.Router();

const { getHomeData, getPublicHomeData } = require('../controllers/home.controller');
const { protect } = require('../middleware/authMiddleware');

// Public landing page data
router.get('/public', getPublicHomeData);

// Authenticated homepage data
router.get('/', protect, getHomeData);

module.exports = router;
