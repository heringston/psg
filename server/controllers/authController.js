const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, VerificationLog } = require('../models');
const { verifyFSSAI, verifyNGODarpan } = require('../utils/verificationStub');

/**
 * @desc    Register a new user (Restaurant or NGO)
 * @route   POST /api/auth/register
 */
const register = async (req, res, next) => {
    try {
        const { name, email, password, role, phone, address, latitude, longitude, fssai_id, ngo_darpan_id } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Email already registered.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            phone,
            address,
            latitude,
            longitude,
            fssai_id: role === 'restaurant' ? fssai_id : null,
            ngo_darpan_id: role === 'ngo' ? ngo_darpan_id : null,
        });

        // Run verification stub based on role
        let verificationResult = { valid: false, message: 'No ID provided for verification.' };

        if (role === 'restaurant' && fssai_id) {
            verificationResult = await verifyFSSAI(fssai_id);
        } else if (role === 'ngo' && ngo_darpan_id) {
            verificationResult = await verifyNGODarpan(ngo_darpan_id);
        }

        // Log verification attempt
        const submittedId = role === 'restaurant' ? fssai_id : ngo_darpan_id;
        if (submittedId) {
            await VerificationLog.create({
                user_id: user.id,
                verification_type: role === 'restaurant' ? 'fssai' : 'ngo_darpan',
                submitted_id: submittedId,
                status: verificationResult.valid ? 'verified' : 'pending',
                verified_at: verificationResult.valid ? new Date() : null,
                notes: verificationResult.message,
            });

            // Update user verification status
            if (verificationResult.valid) {
                await user.update({ is_verified: true, verification_status: 'verified' });
            }
        }

        // Generate JWT
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        });

        // Return user data (without password)
        const userData = user.toJSON();
        delete userData.password;

        res.status(201).json({
            success: true,
            message: 'Registration successful.',
            data: {
                user: userData,
                token,
                verification: verificationResult,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }

        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        // Generate token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        });

        const userData = user.toJSON();
        delete userData.password;

        res.json({
            success: true,
            message: 'Login successful.',
            data: { user: userData, token },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 */
const getProfile = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] },
            include: [{ model: VerificationLog, as: 'verificationLogs' }],
        });

        res.json({
            success: true,
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, getProfile };
