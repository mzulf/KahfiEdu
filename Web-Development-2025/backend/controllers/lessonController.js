const { Op } = require('sequelize');
const { createSearchWhereClause } = require('../helpers/searchQueryHelper');
const { Lesson, Class, Course } = require('../models');
const { getPagination } = require('../utils/paginationUtil');
const { validateLessonData } = require('../utils/validateLessonData');
const { AppError, handleError } = require('../helpers/helperFunction');
const { isAdminOrTeacher } = require('../helpers/validationRole');

const createLesson = async (req, res) => {
    const validationResult = await validateLessonData(req.body, 'create');
    if (!validationResult.isValid) {
        throw new AppError(validationResult.error.message, validationResult.error.status)
    }

    const validation = isAdminOrTeacher(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status)
    }

    try {
        const newLesson = await Lesson.create(validationResult.data, {
            userId: req.userId
        });

        const result = await Lesson.findByPk(newLesson.id, {
            include: [
                {
                    model: Class,
                    as: "class",
                    attributes: ["id", "name"]
                },
            ]
        })

        return res.status(201).json({
            success: true,
            message: "Data lesson berhasil dibuat",
            lesson: result
        })
    } catch (error) {
        return handleError(error, res)
    }
}

const getLessons = async (req, res) => {
    try {
        const {
            search = "",
            classId
        } = req.query;

        const searchFields = ['title'];
        const exactMatchFields = { classId };

        const validation = isAdminOrTeacher(req.userRole, req.userId);
        if (!validation.isValid) {
            throw new AppError(validation.error.message, validation.error.status)
        }

        // Get pagination settings only for admin
        const {
            limit,
            offset,
            statusCondition,
            paranoid,
            meta
        } = validation.isValid ? getPagination(req.query) : {
            limit: null,
            offset: 0,
            statusCondition: null,
            paranoid: true,
            meta: {}
        };

        // Build filters
        const additionalFilters = {};
        for (const [key, value] of Object.entries(exactMatchFields)) {
            if (value) {
                additionalFilters[key] = { [Op.eq]: value };
            }
        }

        let whereClause = createSearchWhereClause(search, searchFields, additionalFilters);

        if (statusCondition && validation.userRole) {
            whereClause = { ...whereClause, ...statusCondition };
        }

        // Get total count for admin pagination
        if (validation.isValid) {
            const totalCount = await Lesson.count({
                where: whereClause,
                include: [
                    { model: Class, as: 'class', attributes: ["id", "name"] },
                ],
                paranoid
            });

            meta.total = totalCount;
            meta.totalPages = Math.ceil(totalCount / limit);
        }

        // Get lessons with or without pagination
        const lessons = await Lesson.findAll({
            where: whereClause,
            ...(validation.userRole && { limit, offset }),
            order: [['order', 'ASC']],
            include: [
                { model: Class, as: 'class', attributes: ["id", "name"] },
            ],
            paranoid: validation.isValid ? paranoid : true,
            distinct: true
        });

        if (lessons.length === 0) {
            throw new AppError("Data lesson tidak ditemukan", 404);
        }

        return res.status(200).json({
            success: true,
            message: "Berhasil mendapatkan data lesson",
            lessons,
            ...(validation.isValid && { meta })
        });

    } catch (error) {
        return handleError(error, res);
    }
};

const getLessonById = async (req, res) => {
    const { id } = req.params;

    try {
        const lesson = await Lesson.findByPk(id, {
            include: [
                {
                    model: Class,
                    as: 'class',
                    attributes: ["id", "name"],
                    include: [{
                        model: Course,
                        as: 'course',
                        attributes: ["id", "title"]
                    }]
                }
            ],
            paranoid: false
        });

        if (!lesson) {
            throw new AppError("Data lesson tidak ditemukan", 404);
        }

        return res.status(200).json({
            success: true,
            message: "Data lesson ditemukan", // Fixed message
            lesson
        });
    } catch (error) {
        return handleError(error, res);
    }
};

const updateLesson = async (req, res) => {
    const { id } = req.params;

    const validationResult = await validateLessonData(req.body, 'update');
    if (!validationResult.isValid) {
        throw new AppError(validationResult.error.message, validationResult.error.status)
    }

    try {
        const lesson = await Lesson.findByPk(id);
        if (!lesson) {
            throw new AppError("Data lesson tidak ditemukan", 404)
        }

        await lesson.update(validationResult.data, {
            userId: req.userId
        });

        return res.status(200).json({
            success: true,
            message: 'Pendaftaran berhasil diperbarui',
            lesson: lesson
        });

    } catch (error) {
        return handleError(error, res)
    }
}

const deleteLesson = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId
    try {
        const lesson = await Lesson.findByPk(id, {
            paranoid: false
        });

        if (!lesson) {
            throw new AppError("Data lesson tidak ditemukan", 404)
        }

        if (lesson.deletedAt) {
            await lesson.destroy({
                force: true,
                userId: userId
            })

            return res.status(200).json({
                success: true,
                message: "Lesson berhasil di hapus permanent"
            })
        }

        await lesson.destroy({
            userId: userId
        })

        return res.status(200).json({
            success: true,
            message: 'Lesson berhasil dihapus (soft delete)'
        });
    } catch (error) {
        return handleError(error, res)
    }
}

const restoreLesson = async (req, res) => {
    const { id } = req.params
    const userId = req.userId

    try {
        const lesson = await Lesson.findByPk(id, {
            paranoid: false
        });

        if (!lesson) {
            throw new AppError("Data lesson tidak ditemukan", 404)
        }

        if (!lesson.deletedAt) {
            throw new AppError("Lesson belum dihapus", 400)
        }

        await lesson.restore({
            userId: userId
        });

        const result = await Lesson.findByPk(lesson.id, {
            include: [
                {
                    model: Class,
                    as: 'class',
                    include: [{
                        model: Course,
                        as: 'course',
                        attributes: ["id", "title"]
                    }]
                }
            ],
            paranoid: false
        })

        return res.status(200).json({
            success: true,
            message: 'Lesson berhasil dipulihkan kembali',
            lesson: result
        });
    } catch (error) {
        return handleError(error, res)
    }
}

module.exports = {
    createLesson,
    getLessons,
    getLessonById,
    updateLesson,
    deleteLesson,
    restoreLesson
}