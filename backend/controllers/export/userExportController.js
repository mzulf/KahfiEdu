const ExcelJS = require('exceljs');
const { User, Role } = require('../../models');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');
const { isAdmin } = require('../../helpers/validationRole');
const { AppError, handleError, createSuccessResponse } = require('../../helpers/helperFunction');

/**
 * Export users to Excel or CSV
 * @route GET /export/users?format=xlsx|csv
 */
const exportUsers = async (req, res) => {
    try {
        const validation = isAdmin(req.userRole, req.userId);
        if (!validation.isValid) {
            throw new AppError(validation.error.message, validation.error.status);
        }
        const format = req.query.format || 'xlsx'; // Default to xlsx
        const validFormats = ['xlsx', 'csv'];
        if (!validFormats.includes(format)) {
            throw new AppError('Invalid format. Use xlsx or csv', 400)
        }

        // Get all users including roles
        const users = await User.findAll({
            include: [{ model: Role, as: "role", attributes: ['name'] }],
            order: [['createdAt', 'DESC']]
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Users');

        // Define headers
        const headers = [
            { header: 'Name', key: 'name' },
            { header: 'Alamat', key: 'alamat' },
            { header: 'Province', key: 'province' },
            { header: 'Regency', key: 'regency' },
            { header: 'District', key: 'district' },
            { header: 'Village', key: 'village' },
            { header: 'Email', key: 'email' },
            { header: 'Email Verified', key: 'emailVerified' },
            { header: 'Role', key: 'role' },
            { header: 'Gender', key: 'gender' },
            { header: 'Phone', key: 'phone' },
            { header: 'Avatar', key: 'avatar' }
        ];

        worksheet.columns = headers;

        // Populate data
        users.forEach(user => {
            worksheet.addRow({
                name: user.name,
                alamat: user.alamat,
                province: user.province,
                regency: user.regency,
                district: user.district,
                village: user.village,
                email: user.email,
                emailVerified: user.emailVerified ? user.emailVerified.toISOString() : '',
                role: user.role?.name || '',
                gender: user.gender,
                phone: user.phone,
                avatar: user.avatar
            });
        });

        // Set filename and content type
        const filename = `user_export_${Date.now()}.${format}`;
        const filePath = path.join(__dirname, '../../uploads/export', filename);

        // Ensure export folder exists
        if (!fs.existsSync(path.dirname(filePath))) {
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
        }

        // Write to file
        if (format === 'csv') {
            await workbook.csv.writeFile(filePath);
            res.download(filePath, filename, () => fs.unlinkSync(filePath)); // Cleanup after download
        } else {
            await workbook.xlsx.writeFile(filePath);
            res.download(filePath, filename, () => fs.unlinkSync(filePath));
        }
    } catch (error) {
        return handleError(error, res);
    }
};

module.exports = {
    exportUsers
};
