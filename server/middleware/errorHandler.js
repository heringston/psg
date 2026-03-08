/**
 * Centralized error handling middleware.
 * Catches unhandled errors from route handlers and returns
 * a consistent JSON error response.
 */
const errorHandler = (err, req, res, _next) => {
    console.error('─── Error ───');
    console.error(err.stack || err.message || err);

    // Sequelize validation errors
    if (err.name === 'SequelizeValidationError') {
        const messages = err.errors.map((e) => e.message);
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: messages,
        });
    }

    // Sequelize unique constraint errors
    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
            success: false,
            message: 'A record with this value already exists.',
        });
    }

    // Multer file size errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            message: 'File too large. Maximum size is 5MB.',
        });
    }

    // Default to 500
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = errorHandler;
