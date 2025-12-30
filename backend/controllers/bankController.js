const { Op } = require("sequelize");
const { isAdmin } = require("../helpers/validationRole");
const { PaymentMethod, Bank } = require("../models");
const { createSearchWhereClause } = require("../helpers/searchQueryHelper");
const { AppError, handleError } = require("../helpers/helperFunction");

const createBank = async (req, res) => {
    const { name, noRek, an, isActive, paymentMethodId } = req.body;

    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status);
    }

    if (!name || !noRek || !an || isActive === undefined || !paymentMethodId) {
        throw new AppError("Name, noRek, an, isActive dan paymentMethodId harus diisi", 400)
    }

    const toLowerCaseName = name.toLowerCase();

    try {
        const existingBank = await Bank.findOne({
            where: { name: toLowerCaseName },
            paranoid: false
        });

        if (existingBank) {
            throw new AppError("Nama bank telah tersedia")
        }

        const existingPaymentMethod = await PaymentMethod.findOne({
            where: { id: paymentMethodId },
            paranoid: false
        });

        if (!existingPaymentMethod) {
            throw new AppError("Payment method tidak ditemukan", 404)
        }

        if (existingPaymentMethod.deletedAt) {
            throw new AppError("Payment method telah dihapus", 404)
        }

        const bank = await Bank.create({
            name: toLowerCaseName,
            noRek,
            an,
            isActive,
            paymentMethodId
        }, {
            userId: validation.userId
        });

        return res.status(201).json({
            success: true,
            message: "Bank berhasil dibuat",
            bank
        });
    } catch (error) {
        return handleError(error, res)
    }
};

const getBanks = async (req, res) => {
    const {
        page = 1,
        limit = 10,
        search = "",
        isActive,
        status = 'active' // Default to active records
    } = req.query;

    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status);
    }

    // Validate status parameter
    if (!['all', 'active', 'deleted'].includes(status)) {
        throw new AppError("Status tidak valid. Gunakan: all, active, atau deleted", 400);
    }

    const offset = (page - 1) * limit;
    const searchFields = ['name', 'noRek', 'an'];

    // Create additional filters
    const additionalFilters = {};
    if (isActive !== undefined) {
        additionalFilters.isActive = isActive === "true";
    }

    // Create where clause using helper
    const whereClause = createSearchWhereClause(search, searchFields, additionalFilters);

    try {
        // Set paranoid based on status
        const queryOptions = {
            where: whereClause,
            order: [['createdAt', 'DESC']],
            limit,
            offset,
            paranoid: status === 'active'  // true for active, false for all/deleted
        };

        // Add deletedAt filter for deleted records
        if (status === 'deleted') {
            queryOptions.where = {
                ...queryOptions.where,
                deletedAt: { [Op.ne]: null }
            };
        }

        const { count, rows: banks } = await Bank.findAndCountAll(queryOptions);

        const totalPages = Math.ceil(count / limit);
        const meta = {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages,
        };

        if (banks.length === 0) {
            throw new AppError("Data bank tidak ditemukan", 404)
        }

        return res.status(200).json({
            success: true,
            message: "Data bank berhasil diambil",
            banks,
            meta
        });
    } catch (error) {
        return handleError(error, res);
    }
};

const updateBank = async (req, res) => {
    const { id } = req.params;
    const { name, noRek, an, isActive, paymentMethodId } = req.body;

    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status)
    }

    try {
        const bank = await Bank.findByPk(id);
        if (!bank) {
            throw new AppError("Data bank tidak ditemukan", 404)
        }

        // Build update data
        const updateData = {};
        if (name) {
            const toLowerCaseName = name.toLowerCase();
            const existingBank = await Bank.findOne({
                where: {
                    name: toLowerCaseName,
                    id: { [Op.ne]: id }
                },
                paranoid: false
            });

            if (existingBank) {
                throw new AppError("Nama bank telah tersedia", 400)
            }
            updateData.name = toLowerCaseName;
        }

        if (paymentMethodId) {
            const existingPaymentMethod = await PaymentMethod.findByPk(paymentMethodId);
            if (!existingPaymentMethod) {
                throw new AppError("Payment method tidak ditemukan", 404)
            }
            updateData.paymentMethodId = paymentMethodId;
        }

        if (noRek) updateData.noRek = noRek;
        if (an) updateData.an = an;
        if (isActive !== undefined) updateData.isActive = isActive;

        await bank.update(updateData, {
            userId: validation.userId
        });

        const updatedBank = await Bank.findByPk(id);

        return res.status(200).json({
            success: true,
            message: "Bank berhasil diperbarui",
            bank: updatedBank
        });
    } catch (error) {
        return handleError(error, res)
    }
};

const deleteBank = async (req, res) => {
    const { id } = req.params;

    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status)
    }

    try {
        const bank = await Bank.findOne({
            where: { id },
            paranoid: false
        });

        if (!bank) {
            throw new AppError("Data bank tidak ditemukan", 404)
        }

        if (bank.isActive) {
            throw new AppError("Bank tidak dapat dihapus karena masih aktif", 400)
        }

        if (bank.deletedAt) {
            await bank.destroy({
                force: true,
                userId: validation.userId
            });
            return res.status(200).json({
                success: true,
                message: "Bank dihapus permanen"
            });
        }

        await bank.destroy({
            userId: validation.userId
        });

        return res.status(200).json({
            success: true,
            message: "Bank berhasil dihapus"
        });
    } catch (error) {
        return handleError(error, res)
    }
};

const restoreBank = async (req, res) => {
    const { id } = req.params;

    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status)
    }

    try {
        const bank = await Bank.findByPk(id, {
            paranoid: false
        });

        if (!bank) {
            throw new AppError("Data bank tidak ditemukan", 404)
        }

        await bank.restore({
            userId: validation.userId
        });

        const restoredBank = await Bank.findByPk(id);

        return res.status(200).json({
            success: true,
            message: "Bank berhasil dipulihkan",
            bank: restoredBank
        });
    } catch (error) {
        return handleError(error, res)
    }
};

module.exports = {
    createBank,
    updateBank,
    deleteBank,
    restoreBank,
    getBanks
};