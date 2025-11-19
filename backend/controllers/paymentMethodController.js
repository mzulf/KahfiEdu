const { Op } = require("sequelize");
const { isAdmin } = require("../helpers/validationRole");
const { PaymentMethod, Bank } = require("../models");
const { AppError, handleError } = require("../helpers/helperFunction");

const createPaymentMethod = async (req, res) => {
    const { name, description } = req.body;

    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status)
    }

    if (!name || !description) {
        throw new AppError("Name dan description metode pembayaran harus diisi", 400)
    }

    const toLowerCaseName = name.toLowerCase();

    try {
        // Use await here to properly check for existing payment method
        const existingPayment = await PaymentMethod.findOne({
            where: { name: toLowerCaseName },
            paranoid: false
        });

        if (existingPayment) {
            throw new AppError("Nama payment method telah tersedia")
        }

        // Create payment method with transaction and context
        const paymentMethod = await PaymentMethod.create({
            name: toLowerCaseName,
            description
        }, {
            userId: validation.userId
        });

        // Return sanitized payment method data
        const safePaymentMethod = {
            id: paymentMethod.id,
            name: paymentMethod.name,
            description: paymentMethod.description,
            createdAt: paymentMethod.createdAt,
            updatedAt: paymentMethod.updatedAt
        };

        return res.status(201).json({
            success: true,
            message: "Metode pembayaran berhasil dibuat",
            paymentMethod: safePaymentMethod
        });

    } catch (error) {
        return handleError(error, res)
    }
};

const getPaymentMethods = async (req, res) => {
    const { status = 'active' } = req.query;  // Changed from req.body to req.query

    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status);
    }

    if (!['all', 'active', 'deleted'].includes(status)) {
        throw new AppError("Status tidak valid. Gunakan: all, active, atau deleted", 400);
    }

    try {
        // Set query options
        const queryOptions = {
            include: [
                {
                    model: Bank,
                    as: 'banks',
                    paranoid: false
                }
            ],
            order: [['createdAt', 'DESC']],
            paranoid: status === 'active'
        };

        // Add deletedAt filter for deleted records
        if (status === 'deleted') {
            queryOptions.where = {
                deletedAt: { [Op.ne]: null }
            };
        }

        const paymentMethods = await PaymentMethod.findAll(queryOptions);

        if (paymentMethods.length === 0) {
            return res.status(200).json({
                success: true,
                message: "Tidak ada data metode pembayaran",
                paymentMethods: []
            });
        }

        return res.status(200).json({
            success: true,
            message: "Data metode pembayaran berhasil diambil",
            paymentMethods
        });
    } catch (error) {
        return handleError(error, res);
    }
};

const updatePaymentMethod = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status)
    }

    if (!name || !description) {
        throw new AppError("Name dan description metode pembayaran harus diisi", 400)
    }

    const toLowerCaseName = name.toLowerCase();

    try {
        const paymentMethod = await PaymentMethod.findByPk(id);

        if (!paymentMethod) {
            throw new AppError("Data payment method tidak ditemukan", 404)
        }

        const existingPayment = await PaymentMethod.findOne({
            where: {
                name: toLowerCaseName,
                id: { [Op.ne]: id } // Exclude the current payment method
            },
            paranoid: false
        });

        if (existingPayment) {
            throw new AppError("Nama payment method telah tesedia", 400)
        }

        await paymentMethod.update({
            name: toLowerCaseName,
            description
        }, {
            userId: validation.userId
        });

        return res.status(200).json({
            success: true,
            message: "Metode pembayaran berhasil diperbarui",
            paymentMethod
        });
    } catch (error) {
        return handleError(error, res)
    }
}

const deletePaymentMethod = async (req, res) => {
    const { id } = req.params;

    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status);
    }

    try {
        const paymentMethod = await PaymentMethod.findByPk(id, {
            include: [{
                model: Bank,
                as: 'banks',
                attributes: ['id']
            }],
            paranoid: false
        });

        if (!paymentMethod) {
            throw new AppError("Data payment method tidak ditemukan", 404);
        }

        // Check if payment method has associated banks
        if (paymentMethod.banks && paymentMethod.banks.length > 0) {
            throw new AppError(
                "Metode pembayaran tidak dapat dihapus karena masih memiliki bank yang terkait",
                400
            );
        }

        if (paymentMethod.deletedAt) {
            await paymentMethod.destroy({
                force: true,
                userId: validation.userId
            });
            return res.status(200).json({
                success: true,
                message: "Metode pembayaran dihapus permanen"
            });
        }

        await paymentMethod.destroy({
            userId: validation.userId
        });

        return res.status(200).json({
            success: true,
            message: "Metode pembayaran berhasil dihapus"
        });
    } catch (error) {
        return handleError(error, res);
    }
};

const restorePaymentMethod = async (req, res) => {
    const { id } = req.params;

    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status)
    }

    try {
        const paymentMethod = await PaymentMethod.findByPk(id, {
            paranoid: false
        });

        if (!paymentMethod) {
            throw new AppError("Data payment method tidak ditemukan", 404)
        }

        // Restore the payment method
        await paymentMethod.restore({
            userId: validation.userId // <-- tambahkan di sini
        });

        return res.status(200).json({
            success: true,
            message: "Metode pembayaran berhasil dipulihkan",
            paymentMethod
        });
    } catch (error) {
        return handleError(error, res)
    }
}

module.exports = {
    createPaymentMethod,
    getPaymentMethods,
    updatePaymentMethod,
    deletePaymentMethod,
    restorePaymentMethod
}