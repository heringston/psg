/**
 * FoodBridge — Seed Script
 * Run: node server/seed.js
 * Creates test restaurants, NGOs, and food listings for demo purposes.
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('./config/database');
const { User, FoodListing, Donation, VerificationLog } = require('./models');

const seed = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to database');

        // Sync models
        await sequelize.sync({ force: true });
        console.log('🗑️  Tables reset');

        const hash = await bcrypt.hash('password123', 12);

        // ─── Create Restaurants ────────────────────────────
        const restaurants = await User.bulkCreate([
            {
                name: 'Taj Palace Kitchen',
                email: 'taj@demo.com',
                password: hash,
                role: 'restaurant',
                phone: '+91 98765 11111',
                address: '1, Mansingh Road, New Delhi',
                latitude: 28.6100,
                longitude: 77.2295,
                fssai_id: '11234567890123',
                is_verified: true,
                verification_status: 'verified',
            },
            {
                name: 'Spice Garden Restaurant',
                email: 'spice@demo.com',
                password: hash,
                role: 'restaurant',
                phone: '+91 98765 22222',
                address: '45, MG Road, Bangalore',
                latitude: 12.9716,
                longitude: 77.5946,
                fssai_id: '12345678901234',
                is_verified: true,
                verification_status: 'verified',
            },
            {
                name: 'Mumbai Tiffins',
                email: 'mumbai@demo.com',
                password: hash,
                role: 'restaurant',
                phone: '+91 98765 33333',
                address: '12, Linking Road, Mumbai',
                latitude: 19.0760,
                longitude: 72.8777,
                fssai_id: '13456789012345',
                is_verified: true,
                verification_status: 'verified',
            },
        ]);
        console.log(`🏪 Created ${restaurants.length} restaurants`);

        // ─── Create NGOs ───────────────────────────────────
        const ngos = await User.bulkCreate([
            {
                name: 'Feeding India Foundation',
                email: 'feeding@demo.com',
                password: hash,
                role: 'ngo',
                phone: '+91 98765 44444',
                address: '22, Nehru Place, New Delhi',
                latitude: 28.5494,
                longitude: 77.2530,
                ngo_darpan_id: 'DL/2024/001234',
                is_verified: true,
                verification_status: 'verified',
            },
            {
                name: 'Robin Hood Army Delhi',
                email: 'robinhood@demo.com',
                password: hash,
                role: 'ngo',
                phone: '+91 98765 55555',
                address: '5, Connaught Place, New Delhi',
                latitude: 28.6315,
                longitude: 77.2167,
                ngo_darpan_id: 'DL/2024/005678',
                is_verified: true,
                verification_status: 'verified',
            },
            {
                name: 'Akshaya Patra Mumbai',
                email: 'akshaya@demo.com',
                password: hash,
                role: 'ngo',
                phone: '+91 98765 66666',
                address: '78, Andheri West, Mumbai',
                latitude: 19.1196,
                longitude: 72.8464,
                ngo_darpan_id: 'MH/2024/009012',
                is_verified: true,
                verification_status: 'verified',
            },
        ]);
        console.log(`🤝 Created ${ngos.length} NGOs`);

        // ─── Create Food Listings ──────────────────────────
        const now = new Date();
        const later = (hrs) => new Date(now.getTime() + hrs * 3600000);

        const listings = await FoodListing.bulkCreate([
            {
                restaurant_id: restaurants[0].id,
                food_type: 'Cooked Meals',
                description: 'Leftover butter chicken and naan from tonight\'s buffet. Fresh and well-stored.',
                quantity: 50,
                unit: 'servings',
                expiration_time: later(6),
                pickup_window_start: later(1),
                pickup_window_end: later(4),
                status: 'available',
            },
            {
                restaurant_id: restaurants[0].id,
                food_type: 'Bakery Items',
                description: 'Assorted pastries and bread rolls — day-end surplus.',
                quantity: 30,
                unit: 'packets',
                expiration_time: later(12),
                pickup_window_start: later(0.5),
                pickup_window_end: later(3),
                status: 'available',
            },
            {
                restaurant_id: restaurants[1].id,
                food_type: 'Raw Vegetables',
                description: 'Fresh vegetables from today\'s prep — onions, tomatoes, peppers.',
                quantity: 15,
                unit: 'kg',
                expiration_time: later(24),
                pickup_window_start: later(2),
                pickup_window_end: later(6),
                status: 'available',
            },
            {
                restaurant_id: restaurants[2].id,
                food_type: 'Cooked Meals',
                description: 'Dal, rice, and sabzi — packed in containers, ready for distribution.',
                quantity: 80,
                unit: 'plates',
                expiration_time: later(4),
                pickup_window_start: later(0.5),
                pickup_window_end: later(2),
                status: 'available',
            },
        ]);
        console.log(`📦 Created ${listings.length} food listings`);

        // ─── Create a sample completed donation ────────────
        // Claim listing[1] by ngo[0]
        await listings[1].update({ status: 'claimed' });

        await Donation.create({
            food_listing_id: listings[1].id,
            ngo_id: ngos[0].id,
            restaurant_id: restaurants[0].id,
            status: 'completed',
            pickup_time: now,
            meals_saved: 30,
            notes: 'Successfully picked up and distributed to shelter.',
        });

        // ─── Verification Logs ─────────────────────────────
        await VerificationLog.bulkCreate([
            { user_id: restaurants[0].id, verification_type: 'fssai', submitted_id: '11234567890123', status: 'verified', verified_at: now },
            { user_id: ngos[0].id, verification_type: 'ngo_darpan', submitted_id: 'DL/2024/001234', status: 'verified', verified_at: now },
        ]);

        console.log('\n✅ Seed complete! Here are the test login credentials:');
        console.log('─────────────────────────────────────────');
        console.log('🏪 Restaurant: taj@demo.com / password123');
        console.log('🏪 Restaurant: spice@demo.com / password123');
        console.log('🤝 NGO:        feeding@demo.com / password123');
        console.log('🤝 NGO:        robinhood@demo.com / password123');
        console.log('─────────────────────────────────────────');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
};

seed();
