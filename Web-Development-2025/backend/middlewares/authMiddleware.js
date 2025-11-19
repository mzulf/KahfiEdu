const { verifyToken } = require('../helpers/jwtHelper');
const { User } = require("../models");
const { AppError } = require('../helpers/helperFunction');

const validateToken = async (req, res, next) => {
    try {
        let token = req.headers["authorization"];

        if (!token) {
            throw new AppError("No token provided", 403);
        }

        // Remove Bearer prefix if present
        if (token.startsWith("Bearer ")) {
            token = token.slice(7);
        }

        // Verify token using helper
        const decoded = verifyToken(token);

        const user = await User.findOne({
            where: {
                id: decoded.userId
            },
            attributes: ['id', 'email', 'roleId'] // Only fetch needed fields
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Token tidak valid"
            });
        }

        // Set request properties
        req.user = decoded;
        req.userId = decoded.userId;
        req.userRole = decoded.role;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

module.exports = { validateToken };