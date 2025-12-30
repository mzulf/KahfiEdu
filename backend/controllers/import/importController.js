// controllers/importController.js
const path = require('path');
const fs = require('fs');
const userImportQueue = require('../../queues/jobs/userImportQueue');
const { AppError, handleError } = require('../../helpers/helperFunction');
const { isAdmin } = require('../../helpers/validationRole');

/**
 * Handle Excel file import for users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const importUsers = async (req, res) => {
    try {
        const validation = isAdmin(req.userRole, req.userId);
        if (!validation.isValid) {
            throw new AppError(validation.error.message, validation.error.status);
        }

        if (!req.file) {
            throw new AppError("tidak ada file yang diupload", 400);
        }

        const { token } = req.body;

        if (!token) {
            throw new AppError("JWT token is required for real-time updates", 400);
        }

        console.log(`📤 Adding import job to queue for token`);

        const job = await userImportQueue.add({
            filePath: req.file.path,
            token, // ✅ Kirim token ke processor
        }, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000
            },
            removeOnComplete: true,
            removeOnFail: false
        });

        return res.status(200).json({
            message: 'Import job added to queue',
            jobId: job.id
        });
    } catch (error) {
        return handleError(error, res);
    }
};

module.exports = {
    importUsers
};