const { Op } = require('sequelize');
const { Materi } = require('../models');
const { AppError, handleError } = require('../helpers/helperFunction');

/**
 * ======================
 * GET ALL (PUBLIC)
 * ======================
 */
const getMateri = async (req, res) => {
    const { search = '', status = 'all', page = 1, limit = 10 } = req.query;
    const whereClause = {};

    if (status === 'active') whereClause.deletedAt = null;
    if (status === 'deleted') whereClause.deletedAt = { [Op.not]: null };

    if (search) {
        whereClause[Op.or] = [
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } },
        ];
    }

    try {
        const { count, rows } = await Materi.findAndCountAll({
            where: whereClause,
            paranoid: false,
            limit: +limit,
            offset: (+page - 1) * +limit,
            order: [['createdAt', 'DESC']],
        });

        res.json({
            success: true,
            data: rows,
            pagination: { total: count, page: +page, limit: +limit },
        });
    } catch (err) {
        handleError(err, res);
    }
};

/**
 * ======================
 * GET BY ID (PUBLIC)
 * ======================
 */
const getMateriById = async (req, res) => {
    try {
        const materi = await Materi.findByPk(req.params.id, { paranoid: false });
        if (!materi) throw new AppError('Materi tidak ditemukan', 404);

        res.json({ success: true, data: materi });
    } catch (err) {
        handleError(err, res);
    }
};

/**
 * ======================
 * CREATE
 * ======================
 */
const createMateri = async (req, res) => {
    try {
        const materi = await Materi.create({
            title: req.body.title,
            description: req.body.desc,
            detail: req.body.detail,
            imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
        });

        res.status(201).json({ success: true, data: materi });
    } catch (err) {
        handleError(err, res);
    }
};

/**
 * ======================
 * UPDATE
 * ======================
 */
const updateMateri = async (req, res) => {
    try {
        const materi = await Materi.findByPk(req.params.id, { paranoid: false });
        if (!materi) throw new AppError('Materi tidak ditemukan', 404);

        materi.title = req.body.title ?? materi.title;
        materi.description = req.body.desc ?? materi.description;
        materi.detail = req.body.detail ?? materi.detail;
        materi.imageUrl = req.file
            ? `/uploads/${req.file.filename}`
            : materi.imageUrl;

        await materi.save();
        res.json({ success: true, data: materi });
    } catch (err) {
        handleError(err, res);
    }
};

/**
 * ======================
 * SOFT DELETE
 * ======================
 */
const deleteMateri = async (req, res) => {
    try {
        const materi = await Materi.findByPk(req.params.id);
        if (!materi) throw new AppError('Materi tidak ditemukan', 404);

        await materi.destroy();
        res.json({ success: true, message: 'Materi dihapus (soft delete)' });
    } catch (err) {
        handleError(err, res);
    }
};

/**
 * ======================
 * RESTORE
 * ======================
 */
const restoreMateri = async (req, res) => {
    try {
        const materi = await Materi.findByPk(req.params.id, { paranoid: false });
        if (!materi || !materi.deletedAt)
            throw new AppError('Tidak bisa restore', 400);

        await materi.restore();
        res.json({ success: true, data: materi });
    } catch (err) {
        handleError(err, res);
    }
};

/**
 * ======================
 * HARD DELETE (PERMANENT)
 * ======================
 */
const deleteMateriPermanent = async (req, res) => {
    try {
        const materi = await Materi.findByPk(req.params.id, { paranoid: false });
        if (!materi) throw new AppError('Materi tidak ditemukan', 404);

        await materi.destroy({ force: true });
        res.json({ success: true, message: 'Materi dihapus permanen' });
    } catch (err) {
        handleError(err, res);
    }
};

module.exports = {
    getMateri,
    getMateriById,
    createMateri,
    updateMateri,
    deleteMateri,
    restoreMateri,
    deleteMateriPermanent,
};
