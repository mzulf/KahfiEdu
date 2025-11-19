const { createSearchWhereClause } = require('../helpers/searchQueryHelper');
const { ClassEnrollment, User, Child, Class } = require('../models');
const { getPagination } = require('../utils/paginationUtil');
const { validateClassEnrollmentData } = require('../utils/validateClassEnrollmentData');
const { AppError, handleError } = require('../helpers/helperFunction');
const { Op } = require('sequelize');
const { isAdmin } = require('../helpers/validationRole');

const createClassEnrollment = async (req, res) => {
    try {
        const validationResult = await validateClassEnrollmentData(req.body, 'create');
        if (!validationResult.isValid) {
            throw new AppError(validationResult.error.message, validationResult.error.status);
        }

        const validation = isAdmin(req.userRole, req.userId);
        if (!validation.isValid) {
            throw new AppError(validation.error.message, validation.error.status);
        }

        const newEnrollment = await ClassEnrollment.create(validationResult.data, {
            userId: req.userId
        });

        const result = await ClassEnrollment.findByPk(newEnrollment.id, {
            include: [{
                model: Class,
                as: "class",
                attributes: ["id", "name"]
            }]
        });

        return res.status(201).json({
            success: true,
            message: 'Pendaftaran kelas berhasil dibuat',
            class_enrollment: result
        });
    } catch (error) {
        return handleError(error, res);
    }
};

const getClassEnrollments = async (req, res) => {
    try {
        const { search = "", classId, studentId, childId } = req.query;
        const searchFields = ['status'];
        const exactMatchFields = { classId, studentId, childId };

        const validation = isAdmin(req.userRole, req.userId);
        if (!validation.isValid) {
            throw new AppError(validation.error.message, validation.error.status);
        }

        const {
            limit,
            offset,
            statusCondition,
            paranoid,
            meta
        } = getPagination(req.query);

        // Build filters
        const additionalFilters = {};
        for (const [key, value] of Object.entries(exactMatchFields)) {
            if (value) {
                additionalFilters[key] = { [Op.eq]: value };
            }
        }

        let whereClause = createSearchWhereClause(search, searchFields, additionalFilters);
        if (statusCondition) {
            whereClause = { ...whereClause, ...statusCondition };
        }

        const totalCount = await ClassEnrollment.count({
            where: whereClause,
            include: [
                { model: Class, as: 'class' },
                { model: User, as: 'student' },
                { model: Child, as: 'child' }
            ]
        });

        meta.total = totalCount;
        meta.totalPages = Math.ceil(totalCount / limit);

        const enrollments = await ClassEnrollment.findAll({
            where: whereClause,
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            include: [
                { model: Class, as: 'class' },
                {
                    model: User,
                    as: 'student',
                    attributes: { exclude: ['password'] }
                },
                { model: Child, as: 'child' }
            ],
            paranoid,
            distinct: true
        });

        if (enrollments.length === 0) {
            meta.total = 0;
            meta.totalPages = 0;
            throw new AppError("Tidak ada data pendaftaran yang ditemukan", 404);
        }

        return res.status(200).json({
            success: true,
            message: "Berhasil mendapatkan data pendaftaran kelas",
            class_enrollments: enrollments,
            meta
        });

    } catch (error) {
        return handleError(error, res);
    }
};

const getClassEnrollmentById = async (req, res) => {
    try {
        const { id } = req.params;

        const validation = isAdmin(req.userRole, req.userId);
        if (!validation.isValid) {
            throw new AppError(validation.error.message, validation.error.status);
        }

        const enrollment = await ClassEnrollment.findByPk(id, {
            include: [
                { model: Class, as: 'class' },
                {
                    model: User,
                    as: 'student',
                    attributes: { exclude: ['password'] }
                },
                { model: Child, as: 'child' }
            ],
            paranoid: false
        });

        if (!enrollment) {
            throw new AppError('Pendaftaran tidak ditemukan', 404);
        }

        return res.status(200).json({
            success: true,
            message: "Data Pendaftaran di dapatkan",
            class_enrollment: enrollment
        });
    } catch (error) {
        return handleError(error, res);
    }
};

const updateClassEnrollment = async (req, res) => {
    try {
        const { id } = req.params;

        const validation = isAdmin(req.userRole, req.userId);
        if (!validation.isValid) {
            throw new AppError(validation.error.message, validation.error.status);
        }
        const validationResult = await validateClassEnrollmentData(req.body, 'update');
        if (!validationResult.isValid) {
            throw new AppError(validationResult.error.message, validationResult.error.status);
        }

        const enrollment = await ClassEnrollment.findByPk(id);
        if (!enrollment) {
            throw new AppError('Pendaftaran tidak ditemukan', 404);
        }

        await enrollment.update(validationResult.data, {
            userId: req.userId
        });

        return res.status(200).json({
            success: true,
            message: 'Pendaftaran berhasil diperbarui',
            class_enrollment: enrollment
        });

    } catch (error) {
        return handleError(error, res);
    }
};

const deleteClassEnrollment = async (req, res) => {
    try {
        const { id } = req.params;

        const enrollment = await ClassEnrollment.findByPk(id, {
            paranoid: false
        });

        if (!enrollment) {
            throw new AppError('Pendaftaran tidak ditemukan', 404);
        }

        if (enrollment.deletedAt) {
            await enrollment.destroy({
                force: true,
                userId: req.userId
            });

            return res.status(200).json({
                success: true,
                message: "Pendaftaran berhasil di hapus permanent"
            });
        }

        await enrollment.destroy({
            userId: req.userId
        });

        return res.status(200).json({
            success: true,
            message: 'Pendaftaran berhasil dihapus'
        });
    } catch (error) {
        return handleError(error, res);
    }
};

const restoreClassEnrollment = async (req, res) => {
    try {
        const { id } = req.params;

        const enrollment = await ClassEnrollment.findOne({
            where: { id },
            paranoid: false
        });

        if (!enrollment) {
            throw new AppError('Pendaftaran tidak ditemukan', 404);
        }

        if (!enrollment.deletedAt) {
            throw new AppError('Pendaftaran belum dihapus', 400);
        }

        await enrollment.restore({
            userId: req.userId
        });

        return res.status(200).json({
            success: true,
            message: 'Pendaftaran berhasil dipulihkan kembali',
            class_enrollment: enrollment
        });
    } catch (error) {
        return handleError(error, res);
    }
};

module.exports = {
    createClassEnrollment,
    getClassEnrollments,
    getClassEnrollmentById,
    updateClassEnrollment,
    deleteClassEnrollment,
    restoreClassEnrollment
};