const { Op } = require("sequelize");
const { isAdmin } = require("../helpers/validationRole");
const { Job } = require("../models");
const { createSearchWhereClause } = require("../helpers/searchQueryHelper");
const { AppError, handleError } = require("../helpers/helperFunction");

const createJob = async (req, res) => {
    const { title, description, position, location, employmentType, urlLink } = req.body;

    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status);
    }

    if (!title || !description || !position || !location || !employmentType) {
        throw new AppError("Semua field harus diisi", 400);
    }

    try {
        const existingJob = await Job.findOne({
            where: { title: title.toLowerCase() },
            paranoid: false
        });

        if (existingJob) {
            throw new AppError("Judul pekerjaan sudah tersedia", 400);
        }

        const job = await Job.create({
            title: title.toLowerCase(),
            description,
            position,
            location,
            employmentType,
            urlLink
        });

        return res.status(201).json({
            success: true,
            message: "Job berhasil dibuat",
            job
        });
    } catch (error) {
        return handleError(error, res);
    }
};

const getJobs = async (req, res) => {
    const {
        page = 1,
        limit = 10,
        search = "",
        status = 'active'
    } = req.query;

    if (!['all', 'active', 'deleted'].includes(status)) {
        throw new AppError("Status tidak valid. Gunakan: all, active, atau deleted", 400);
    }

    const offset = (page - 1) * limit;
    const searchFields = ['title', 'description', 'position', 'location'];

    const whereClause = createSearchWhereClause(search, searchFields);

    try {
        const queryOptions = {
            where: whereClause,
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset),
            paranoid: status === 'active'
        };

        if (status === 'deleted') {
            queryOptions.where.deletedAt = { [Op.ne]: null };
        }

        const { count, rows: jobs } = await Job.findAndCountAll(queryOptions);

        return res.status(200).json({
            success: true,
            message: "Data job berhasil diambil",
            jobs,
            meta: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        return handleError(error, res);
    }
};

const getJobById = async (req, res) => {
    const { id } = req.params;
    try {
        const job = await Job.findByPk(id, {
            paranoid: true
        });

        if (!job) {
            throw new AppError("Data job tidak ditemukan", 404);
        }
        return res.status(200).json({
            success: true,
            message: "Data job ditemukan",
            job
        });
    } catch (error) {
        return handleError(error, res);
    }
}

const updateJob = async (req, res) => {
    const { id } = req.params;
    const { title, description, position, location, employmentType, urlLink } = req.body;

    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status);
    }

    try {
        const job = await Job.findByPk(id);
        if (!job) {
            throw new AppError("Data job tidak ditemukan", 404);
        }

        const updateData = {};

        if (title) {
            const titleLower = title.toLowerCase();
            const existingJob = await Job.findOne({
                where: {
                    title: titleLower,
                    id: { [Op.ne]: id }
                },
                paranoid: false
            });

            if (existingJob) {
                throw new AppError("Judul pekerjaan telah tersedia", 400);
            }

            updateData.title = titleLower;
        }

        if (description) updateData.description = description;
        if (position) updateData.position = position;
        if (location) updateData.location = location;
        if (employmentType) updateData.employmentType = employmentType;
        if (urlLink) updateData.urlLink = urlLink;

        await job.update(updateData);

        return res.status(200).json({
            success: true,
            message: "Job berhasil diperbarui",
            job
        });
    } catch (error) {
        return handleError(error, res);
    }
};

const deleteJob = async (req, res) => {
    const { id } = req.params;

    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status);
    }

    try {
        const job = await Job.findOne({
            where: { id },
            paranoid: false
        });

        if (!job) {
            throw new AppError("Data job tidak ditemukan", 404);
        }

        if (job.deletedAt) {
            await job.destroy({ force: true });
            return res.status(200).json({
                success: true,
                message: "Job dihapus permanen"
            });
        }

        await job.destroy();
        return res.status(200).json({
            success: true,
            message: "Job berhasil dihapus"
        });
    } catch (error) {
        return handleError(error, res);
    }
};

const restoreJob = async (req, res) => {
    const { id } = req.params;

    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status);
    }

    try {
        const job = await Job.findByPk(id, { paranoid: false });

        if (!job) {
            throw new AppError("Data job tidak ditemukan", 404);
        }

        await job.restore();

        return res.status(200).json({
            success: true,
            message: "Job berhasil dipulihkan",
            job
        });
    } catch (error) {
        return handleError(error, res);
    }
};

module.exports = {
    createJob,
    getJobs,
    updateJob,
    deleteJob,
    restoreJob,
    getJobById
};
