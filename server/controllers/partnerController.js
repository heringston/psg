const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');

/**
 * @desc    Find verified NGO partners within a radius
 * @route   GET /api/partners/nearby?lat=&lng=&radius=
 * @access  Authenticated
 * 
 * Uses the Haversine formula in raw SQL for proximity search.
 */
const getNearbyPartners = async (req, res, next) => {
    try {
        const { lat, lng, radius = 10 } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({
                success: false,
                message: 'Latitude (lat) and longitude (lng) are required.',
            });
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        const radiusKm = parseFloat(radius);

        if (isNaN(latitude) || isNaN(longitude) || isNaN(radiusKm)) {
            return res.status(400).json({
                success: false,
                message: 'lat, lng, and radius must be valid numbers.',
            });
        }

        // Haversine formula for calculating distance between two coordinates
        const partners = await sequelize.query(
            `
      SELECT 
        id, name, email, phone, address, latitude, longitude,
        ngo_darpan_id, is_verified, verification_status, profile_image_url,
        (
          6371 * acos(
            cos(radians(:latitude)) * cos(radians(latitude)) *
            cos(radians(longitude) - radians(:longitude)) +
            sin(radians(:latitude)) * sin(radians(latitude))
          )
        ) AS distance_km
      FROM users
      WHERE role = 'ngo'
        AND is_verified = true
        AND latitude IS NOT NULL
        AND longitude IS NOT NULL
      HAVING distance_km <= :radius
      ORDER BY distance_km ASC
      LIMIT 50
      `,
            {
                replacements: { latitude, longitude, radius: radiusKm },
                type: QueryTypes.SELECT,
            }
        );

        res.json({
            success: true,
            message: `Found ${partners.length} verified NGO partner(s) within ${radiusKm}km.`,
            data: {
                partners,
                search: { latitude, longitude, radius_km: radiusKm },
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getNearbyPartners };
