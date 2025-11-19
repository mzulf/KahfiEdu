const { User } = require("../models");
const { AppError, handleError } = require("./helperFunction");

/**
 * Validates if required user data is complete
 * Checks if non-essential fields are filled
 * @throws {AppError} When validation fails
 */
const validateDataUser = async (req, res) => {
    try {
        const { userId, userRole } = req;

        // Skip validation for admin
        if (userRole === "admin") {
            return res.status(200).json({
                success: true,
                message: "Admin user - data validation skipped"
            });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            throw new AppError("User tidak ditemukan", 404);
        }

        // Check email verification first
        if (!user.emailVerified) {
            throw new AppError("Email belum diverifikasi", 403);
        }

        // List of fields to check (excluding required fields)
        const fieldsToCheck = [
            'alamat',
            'province',
            'regency',
            'district',
            'village',
            'gender',
            'phone',
        ];

        // Check for null values
        const incompleteFields = fieldsToCheck.filter(field =>
            user[field] === null || user[field] === undefined || user[field] === ''
        );

        if (incompleteFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Data anda belum lengkap",
                incompleteFields: incompleteFields.map(field => ({
                    field,
                    message: `${field} belum diisi`
                }))
            });
        }

        // Return success response when all data is complete
        return res.status(200).json({
            success: true,
            message: "Data profil lengkap"
        });

    } catch (error) {
        return handleError(error, res);
    }
};

module.exports = validateDataUser;