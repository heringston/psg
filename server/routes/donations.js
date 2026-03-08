const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const {
    createFoodListing,
    getFoodListings,
    claimFoodListing,
    completeDonation,
    getDashboard,
    getMyDonations,
} = require('../controllers/donationController');
const { authenticate, authorize } = require('../middleware/auth');

// ─── Multer config for file uploads ──────────────────────
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', '..', process.env.UPLOAD_DIR || 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if (ext && mime) {
            cb(null, true);
        } else {
            cb(new Error('Only image files (JPEG, PNG, WebP) are allowed.'));
        }
    },
});

// ─── Routes ──────────────────────────────────────────────

// Food Listings
router.post('/food-listings', authenticate, authorize('restaurant'), upload.single('image'), createFoodListing);
router.get('/food-listings', authenticate, getFoodListings);

// Claim a listing (NGO)
router.patch('/food-listings/:id/claim', authenticate, authorize('ngo'), claimFoodListing);

// Complete a donation with proof photo (NGO)
router.patch('/:id/complete', authenticate, authorize('ngo'), upload.single('completion_photo'), completeDonation);

// Restaurant dashboard
router.get('/dashboard', authenticate, authorize('restaurant'), getDashboard);

// NGO: my donations
router.get('/my-donations', authenticate, authorize('ngo'), getMyDonations);

module.exports = router;
