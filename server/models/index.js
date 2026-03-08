const User = require('./User');
const FoodListing = require('./FoodListing');
const Donation = require('./Donation');
const VerificationLog = require('./VerificationLog');

// ─── Associations ────────────────────────────────────────

// User (Restaurant) → FoodListings
User.hasMany(FoodListing, { foreignKey: 'restaurant_id', as: 'foodListings' });
FoodListing.belongsTo(User, { foreignKey: 'restaurant_id', as: 'restaurant' });

// FoodListing → Donations
FoodListing.hasMany(Donation, { foreignKey: 'food_listing_id', as: 'donations' });
Donation.belongsTo(FoodListing, { foreignKey: 'food_listing_id', as: 'foodListing' });

// User (NGO) → Donations (as claimant)
User.hasMany(Donation, { foreignKey: 'ngo_id', as: 'claimedDonations' });
Donation.belongsTo(User, { foreignKey: 'ngo_id', as: 'ngo' });

// User (Restaurant) → Donations (as donor)
User.hasMany(Donation, { foreignKey: 'restaurant_id', as: 'givenDonations' });
Donation.belongsTo(User, { foreignKey: 'restaurant_id', as: 'donorRestaurant' });

// User → VerificationLogs
User.hasMany(VerificationLog, { foreignKey: 'user_id', as: 'verificationLogs' });
VerificationLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
    User,
    FoodListing,
    Donation,
    VerificationLog,
};
