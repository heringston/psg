const { Op } = require('sequelize');
const { FoodListing, Donation, User } = require('../models');

/**
 * @desc    Create a new food listing
 * @route   POST /api/donations/food-listings
 * @access  Restaurant only
 */
const createFoodListing = async (req, res, next) => {
    try {
        const { food_type, description, quantity, unit, expiration_time, pickup_window_start, pickup_window_end, special_instructions } = req.body;

        const listing = await FoodListing.create({
            restaurant_id: req.user.id,
            food_type,
            description,
            quantity,
            unit,
            expiration_time,
            pickup_window_start,
            pickup_window_end,
            special_instructions,
            image_url: req.file ? `/uploads/${req.file.filename}` : null,
        });

        res.status(201).json({
            success: true,
            message: 'Food listing created successfully.',
            data: { listing },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all available food listings
 * @route   GET /api/donations/food-listings
 * @access  Authenticated
 */
const getFoodListings = async (req, res, next) => {
    try {
        const { status = 'available', page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const { count, rows: listings } = await FoodListing.findAndCountAll({
            where: {
                status,
                expiration_time: { [Op.gt]: new Date() },
            },
            include: [{
                model: User,
                as: 'restaurant',
                attributes: ['id', 'name', 'address', 'latitude', 'longitude', 'is_verified'],
            }],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        res.json({
            success: true,
            data: {
                listings,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    pages: Math.ceil(count / limit),
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Claim a food listing (NGO)
 * @route   PATCH /api/donations/food-listings/:id/claim
 * @access  NGO only
 */
const claimFoodListing = async (req, res, next) => {
    try {
        const { id } = req.params;

        const listing = await FoodListing.findByPk(id);
        if (!listing) {
            return res.status(404).json({ success: false, message: 'Food listing not found.' });
        }
        if (listing.status !== 'available') {
            return res.status(400).json({ success: false, message: 'This listing is no longer available.' });
        }

        // Update listing status
        await listing.update({ status: 'claimed' });

        // Create donation record
        const donation = await Donation.create({
            food_listing_id: listing.id,
            ngo_id: req.user.id,
            restaurant_id: listing.restaurant_id,
            status: 'accepted',
        });

        res.json({
            success: true,
            message: 'Food listing claimed successfully.',
            data: { donation },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Complete a donation (upload proof photo)
 * @route   PATCH /api/donations/:id/complete
 * @access  NGO only
 */
const completeDonation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { meals_saved, notes } = req.body;

        const donation = await Donation.findByPk(id);
        if (!donation) {
            return res.status(404).json({ success: false, message: 'Donation not found.' });
        }
        if (donation.ngo_id !== req.user.id) {
            return res.status(403).json({ success: false, message: 'You can only complete your own donations.' });
        }

        // Update donation
        await donation.update({
            status: 'completed',
            pickup_time: new Date(),
            completion_photo_url: req.file ? `/uploads/${req.file.filename}` : null,
            meals_saved: meals_saved || 0,
            notes,
        });

        // Update food listing status
        await FoodListing.update({ status: 'completed' }, { where: { id: donation.food_listing_id } });

        res.json({
            success: true,
            message: 'Donation completed successfully. Thank you!',
            data: { donation },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get restaurant impact dashboard
 * @route   GET /api/donations/dashboard
 * @access  Restaurant only
 */
const getDashboard = async (req, res, next) => {
    try {
        const restaurantId = req.user.id;

        // Total listings
        const totalListings = await FoodListing.count({
            where: { restaurant_id: restaurantId },
        });

        // Completed donations
        const completedDonations = await Donation.count({
            where: { restaurant_id: restaurantId, status: 'completed' },
        });

        // Total meals saved
        const mealsResult = await Donation.sum('meals_saved', {
            where: { restaurant_id: restaurantId, status: 'completed' },
        });
        const totalMealsSaved = mealsResult || 0;

        // Active listings
        const activeListings = await FoodListing.count({
            where: { restaurant_id: restaurantId, status: 'available' },
        });

        // Recent donations
        const recentDonations = await Donation.findAll({
            where: { restaurant_id: restaurantId },
            include: [
                { model: FoodListing, as: 'foodListing', attributes: ['food_type', 'quantity', 'unit'] },
                { model: User, as: 'ngo', attributes: ['name'] },
            ],
            order: [['created_at', 'DESC']],
            limit: 5,
        });

        // Verified badge
        const hasVerifiedBadge = completedDonations >= 10;

        res.json({
            success: true,
            data: {
                stats: {
                    totalListings,
                    completedDonations,
                    totalMealsSaved,
                    activeListings,
                    hasVerifiedBadge,
                },
                recentDonations,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all donations for the current NGO
 * @route   GET /api/donations/my-donations
 * @access  NGO only
 */
const getMyDonations = async (req, res, next) => {
    try {
        const donations = await Donation.findAll({
            where: { ngo_id: req.user.id },
            include: [
                {
                    model: FoodListing,
                    as: 'foodListing',
                    attributes: ['id', 'food_type', 'description', 'quantity', 'unit', 'expiration_time', 'pickup_window_start', 'pickup_window_end', 'image_url', 'status', 'special_instructions'],
                },
                {
                    model: User,
                    as: 'donorRestaurant',
                    attributes: ['id', 'name', 'address', 'phone', 'latitude', 'longitude'],
                },
            ],
            order: [['created_at', 'DESC']],
        });

        const stats = {
            total: donations.length,
            pending: donations.filter((d) => d.status === 'accepted').length,
            completed: donations.filter((d) => d.status === 'completed').length,
            totalMealsSaved: donations.reduce((sum, d) => sum + (d.meals_saved || 0), 0),
        };

        res.json({
            success: true,
            data: { donations, stats },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createFoodListing,
    getFoodListings,
    claimFoodListing,
    completeDonation,
    getDashboard,
    getMyDonations,
};
