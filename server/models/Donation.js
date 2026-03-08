const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Donation = sequelize.define('Donation', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    food_listing_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'food_listings', key: 'id' },
    },
    ngo_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
    },
    restaurant_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
    },
    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'picked_up', 'completed', 'cancelled'),
        defaultValue: 'pending',
    },
    pickup_time: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Actual time when NGO picked up the food',
    },
    completion_photo_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Photo uploaded by NGO as proof of delivery',
    },
    meals_saved: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'Number of meals served from this donation',
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'donations',
    indexes: [
        { fields: ['food_listing_id'] },
        { fields: ['ngo_id'] },
        { fields: ['restaurant_id'] },
        { fields: ['status'] },
    ],
});

module.exports = Donation;
