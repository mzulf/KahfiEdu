const { verifyToken } = require('../helpers/jwtHelper');
const { User, Role } = require("../models");

const validateToken = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (token.startsWith("Bearer ")) {
            token = token.slice(7);
        }

        const decoded = verifyToken(token);

        const user = await User.findByPk(decoded.userId, {
            include: {
                model: Role,
                as: 'role',
                attributes: ['name']
            }
        });

        if (!user || !user.role) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = user;
        req.userId = user.id;
        req.userRole = user.role.name; // 🔥 PENTING

        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

module.exports = { validateToken };
