const { Op } = require('sequelize');
const { Materi } = require('../models');
const { AppError, handleError } = require('../helpers/helperFunction');
const { isAdmin } = require('../helpers/validationRole');

/**
 * GET LIST (Admin & User)
 * Query params: search, status (all|active|deleted), page, limit
 */
const getMateri = async (req, res) => {
    const { search = '', status = 'all', page = 1, limit = 10 } = req.query;

    const whereClause = {};

    // FILTER STATUS
    if (status === 'active') {
        whereClause.deletedAt = null;
    } else if (status === 'deleted') {
        whereClause.deletedAt = { [Op.not]: null };
    }

    // SEARCH
    if (search) {
        whereClause[Op.or] = [
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } },
        ];
    }

    try {
        const offset = (page - 1) * limit;

        const { count, rows } = await Materi.findAndCountAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10),
            paranoid: false, // agar include deleted
        });

        res.status(200).json({
            success: true,
            message: 'Materi berhasil diambil',
            data: rows,
            pagination: {
                total: count,
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
            },
        });
    } catch (error) {
        return handleError(error, res);
    }
};

/**
 * GET DETAIL (USER)
 */
const getMateriById = async (req, res) => {
    const { id } = req.params;
    try {
        const materi = await Materi.findByPk(id, { paranoid: false });

        if (!materi) throw new AppError('Materi tidak ditemukan', 404);

        res.status(200).json({
            success: true,
            message: 'Detail materi berhasil diambil',
            data: materi,
        });
    } catch (error) {
        return handleError(error, res);
    }
};

/**
 * CREATE (Admin)
 */
const createMateri = async (req, res) => {
    const { title, desc, detail } = req.body;
    const file = req.file;

    // VALIDASI ADMIN
    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) throw new AppError(validation.error.message, validation.error.status);

    if (!title || !desc || !detail) throw new AppError('Semua field wajib diisi');

    try {
        const materi = await Materi.create({
            title,
            description: desc,
            detail,
            imageUrl: file ? `/uploads/${file.filename}` : null,
        }, { userId: req.userId });

        res.status(201).json({
            success: true,
            message: 'Materi berhasil dibuat',
            data: materi,
        });
    } catch (error) {
        return handleError(error, res);
    }
};

/**
 * UPDATE (Admin)
 */
const updateMateri = async (req, res) => {
    const { id } = req.params;
    const { title, desc, detail } = req.body;
    const file = req.file;

    // VALIDASI ADMIN
    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) throw new AppError(validation.error.message, validation.error.status);

    try {
        const materi = await Materi.findByPk(id, { paranoid: false });
        if (!materi) throw new AppError('Materi tidak ditemukan', 404);

        // UPDATE FIELD
        if (title) materi.title = title;
        if (desc) materi.description = desc;
        if (detail) materi.detail = detail;
        if (file) materi.imageUrl = `/uploads/${file.filename}`;

        await materi.save({ userId: req.userId });

        res.status(200).json({
            success: true,
            message: 'Materi berhasil diperbarui',
            data: materi,
        });
    } catch (error) {
        return handleError(error, res);
    }
};

/**
 * DELETE (Soft Delete)
 */
const deleteMateri = async (req, res) => {
    const { id } = req.params;

    // VALIDASI ADMIN
    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) throw new AppError(validation.error.message, validation.error.status);

    try {
        const materi = await Materi.findByPk(id, { paranoid: false });
        if (!materi) throw new AppError('Materi tidak ditemukan', 404);

        if (materi.deletedAt) {
            // Hapus permanen jika sudah soft delete sebelumnya
            await materi.destroy({ force: true, userId: req.userId });
            return res.status(200).json({ success: true, message: 'Materi berhasil dihapus permanen' });
        }

        await materi.destroy({ userId: req.userId }); // soft delete
        res.status(200).json({ success: true, message: 'Materi berhasil dihapus' });
    } catch (error) {
        return handleError(error, res);
    }
};

/**
 * RESTORE
 */
const restoreMateri = async (req, res) => {
    const { id } = req.params;

    // VALIDASI ADMIN
    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) throw new AppError(validation.error.message, validation.error.status);

    try {
        const materi = await Materi.findByPk(id, { paranoid: false });
        if (!materi) throw new AppError('Materi tidak ditemukan', 404);

        if (!materi.deletedAt) throw new AppError('Materi belum dihapus', 400);

        await materi.restore({ userId: req.userId });

        res.status(200).json({ success: true, message: 'Materi berhasil direstore', data: materi });
    } catch (error) {
        return handleError(error, res);
    }
};

module.exports = {
    getMateri,
    getMateriById,
    createMateri,
    updateMateri,
    deleteMateri,
    restoreMateri,
};
