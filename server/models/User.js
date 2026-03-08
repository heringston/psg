const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: { notEmpty: true },
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('restaurant', 'ngo'),
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true,
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true,
    },
    fssai_id: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'FSSAI License ID for restaurants',
    },
    ngo_darpan_id: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'NGO Darpan Unique ID for NGOs',
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    verification_status: {
        type: DataTypes.ENUM('pending', 'verified', 'rejected'),
        defaultValue: 'pending',
    },
    profile_image_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
}, {
    tableName: 'users',
    indexes: [
        { unique: true, fields: ['email'] },
        { fields: ['role'] },
        { fields: ['is_verified'] },
        { fields: ['latitude', 'longitude'] },
    ],
});

module.exports = User;
