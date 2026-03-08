const express = require('express');
const router = express.Router();
const { getNearbyPartners } = require('../controllers/partnerController');
const { authenticate } = require('../middleware/auth');

// Find verified NGO partners within a radius
router.get('/nearby', authenticate, getNearbyPartners);

module.exports = router;
