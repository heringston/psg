const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FoodListing = sequelize.define('FoodListing', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    restaurant_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
    },
    food_type: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'e.g., Cooked Meals, Raw Vegetables, Packaged Food, Bakery Items',
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1 },
    },
    unit: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: 'servings',
        comment: 'e.g., servings, kg, plates, packets',
    },
    expiration_time: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'When the food will no longer be safe to consume',
    },
    pickup_window_start: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    pickup_window_end: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    image_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('available', 'claimed', 'completed', 'expired'),
        defaultValue: 'available',
    },
    special_instructions: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Allergens, storage requirements, etc.',
    },
}, {
    tableName: 'food_listings',
    indexes: [
        { fields: ['restaurant_id'] },
        { fields: ['status'] },
        { fields: ['expiration_time'] },
        { fields: ['status', 'expiration_time'] },
    ],
});

module.exports = FoodListing;
