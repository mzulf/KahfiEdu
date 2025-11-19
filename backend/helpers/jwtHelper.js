const jwt = require('jsonwebtoken');
const { AppError } = require('./helperFunction');

/**
 * Generate JWT token with flexible payload structure
 * @param {Object} payload - Data to encode in token
 * @param {string} payload.userId - User's UUID
 * @param {string} [payload.email] - User's email (optional for password reset)
 * @param {string} [payload.role] - User's role name (optional for password reset)
 * @param {boolean} [isPasswordReset=false] - Whether this is a password reset token
 * @returns {string} JWT token
 */
const generateToken = (payload, isPasswordReset = false) => {
    // Validate minimum required field
    if (!payload.userId) {
        throw new AppError('Missing required payload field: userId', 400);
    }

    // Validate regular token requirements
    if (!isPasswordReset && (!payload.email || !payload.role)) {
        throw new AppError('Missing required payload fields for regular token: email, role', 400);
    }

    // Set different expiration times based on token type
    const expiresIn = isPasswordReset ? '1h' : (process.env.JWT_EXPIRES_IN || '24h');

    // Generate token with appropriate payload
    const tokenPayload = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        isPasswordReset,
        iat: Math.floor(Date.now() / 1000)
    };

    try {
        return jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET,
            { expiresIn }
        );
    } catch (error) {
        throw new AppError('Error generating token', 500);
    }
};

/**
 * Verify and decode JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new AppError('Invalid token', 401);
    }
};

module.exports = { generateToken, verifyToken };