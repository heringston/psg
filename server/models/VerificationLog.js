const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VerificationLog = sequelize.define('VerificationLog', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
    },
    verification_type: {
        type: DataTypes.ENUM('fssai', 'ngo_darpan'),
        allowNull: false,
    },
    submitted_id: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'The FSSAI or Darpan ID submitted for verification',
    },
    status: {
        type: DataTypes.ENUM('pending', 'verified', 'rejected'),
        defaultValue: 'pending',
    },
    verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Reason for rejection or verification notes',
    },
}, {
    tableName: 'verification_logs',
    indexes: [
        { fields: ['user_id'] },
        { fields: ['status'] },
        { fields: ['verification_type'] },
    ],
});

module.exports = VerificationLog;
