const { createSearchWhereClause } = require('../helpers/searchQueryHelper');
const { isAdmin } = require('../helpers/validationRole');
const { Course, Category, Class, User } = require('../models');
const getFileUrl = require('../utils/getFileUrl');
const { getPagination } = require('../utils/paginationUtil');
const validateCourseData = require('../utils/validateCourseData');
const { AppError, handleError } = require('../helpers/helperFunction');

const createCourse = async (req, res) => {
    try {
        const validationResult = await validateCourseData(req.body, 'create');
        if (!validationResult.isValid) {
            throw new AppError(validationResult.error.message, validationResult.error.status);
        }

        const validation = isAdmin(req.userRole, req.userId);
        if (!validation.isValid) {
            throw new AppError(validation.error.message, validation.error.status);
        }

        const thumbnailPath = req.file ? getFileUrl(req, `course/${req.file.filename}`) : null;

        const courseData = {
            ...validationResult.data,
            thumbnail: thumbnailPath
        };

        const newCourse = await Course.create(courseData, {
            userId: validation.userId,
        });

        const resultCourse = await Course.findByPk(newCourse.id, {
            include: [{
                model: Category,
                as: "category",
                attributes: ["id", "name"]
            }]
        });

        return res.status(201).json({
            success: true,
            message: "Course berhasil dibuat",
            course: resultCourse
        });

    } catch (error) {
        return handleError(error, res);
    }
};

const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate user role first
        const roleValidation = isAdmin(req.userRole, req.userId);
        if (!roleValidation.isValid) {
            throw new AppError(roleValidation.error.message, roleValidation.error.status);
        }

        // Check if course exists
        const existingCourse = await Course.findByPk(id);
        if (!existingCourse) {
            throw new AppError("Course tidak ditemukan", 404);
        }

        // Validate course data
        const validationResult = await validateCourseData(req.body, 'update');
        if (!validationResult.isValid) {
            throw new AppError(validationResult.error.message, validationResult.error.status);
        }

        // Prepare update data
        const courseData = {
            ...validationResult.data
        };

        // Handle publish/featured status
        if (courseData.isPublish === false) {
            courseData.isFeatured = false;
        }

        // Handle thumbnail upload
        if (req.file) {
            const path = `course/${req.file.filename}`;
            courseData.thumbnail = getFileUrl(req, path);
        }

        // Update course with revision tracking
        await existingCourse.update(courseData, {
            userId: roleValidation.userId
        });

        // Fetch updated course with category
        const updatedCourse = await Course.findByPk(id, {
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name'],
            }],
        });

        return res.status(200).json({
            success: true,
            message: "Course berhasil diperbarui",
            course: updatedCourse
        });

    } catch (error) {
        return handleError(error, res);
    }
};

const getCourses = async (req, res) => {
    try {
        const { search = "", categoryId, isPublish, isFeatured } = req.query;
        const searchFields = ['title'];

        const {
            limit,
            offset,
            statusCondition,
            paranoid,
            meta
        } = getPagination(req.query);

        let whereClause = createSearchWhereClause(search, searchFields);

        if (categoryId) {
            whereClause.categoryId = categoryId;
        }

        if (typeof isPublish !== 'undefined') {
            const isPublishBoolean = isPublish === 'true' || isPublish === true;
            whereClause.isPublish = isPublishBoolean;
        }

        if (typeof isFeatured !== 'undefined') {
            const isFeaturedBoolean = isFeatured === 'true' || isFeatured === true;
            whereClause.isFeatured = isFeaturedBoolean;
        }

        if (statusCondition) {
            whereClause = { ...whereClause, ...statusCondition };
        }

        // Jika bukan admin, hanya tampilkan course yang sudah dipublish


        const totalCount = await Course.count({
            where: whereClause,
            include: [{
                model: Category,
                as: "category",
                attributes: ["id", "name"]
            }]
        });

        meta.total = totalCount;
        meta.totalPages = Math.ceil(totalCount / limit);

        const { rows: courses } = await Course.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            order: [
                ['isPublish', 'DESC'],  // Prioritaskan isPublish = true
                ['createdAt', 'DESC'],  // Lalu urutkan berdasarkan tanggal terbaru
            ],
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name'],
            }],
            paranoid,
        });

        return res.status(200).json({
            success: true,
            message: courses.length === 0 ? "Data course tidak ditemukan" : "Berhasil mendapatkan data course",
            courses,
            meta,
        });

    } catch (error) {
        return handleError(error, res);
    }
};

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.findAll({
            attributes: ["id", "title"],
        });

        if (courses.length === 0) {
            throw new AppError("Tidak ada course yang ditemukan", 404);
        }

        return res.status(200).json({
            success: true,
            message: "Berhasil mendapatkan semua data course",
            courses
        });

    } catch (error) {
        return handleError(error, res);
    }
}



const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;

        const course = await Course.findByPk(id, {
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name'],
                },
                {
                    model: Class,
                    as: 'classes',
                    include: [
                        {
                            model: User,
                            as: "teacher",
                            attributes: { exclude: ['password', 'roleId', 'emailVerified', 'googleId'] }
                        }
                    ]
                },
            ],
            paranoid: false
        });

        if (!course) {
            throw new AppError("Course tidak ditemukan", 404);
        }

        return res.status(200).json({
            success: true,
            message: "Berhasil mendapatkan data course",
            course
        });

    } catch (error) {
        return handleError(error, res);
    }
};

const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const validation = isAdmin(req.userRole, req.userId);
        if (!validation.isValid) {
            throw new AppError(validation.error.message, validation.error.status);
        }

        const course = await Course.findByPk(id, {
            paranoid: false
        });

        if (!course) {
            throw new AppError("Course tidak ditemukan", 404);
        }

        // Update isPublish dan isFeatured jadi false sebelum delete
        await course.update({
            isPublish: false,
            isFeatured: false
        });

        if (course.deletedAt) {
            // Hard delete
            await course.destroy({
                force: true,
                userId: validation.userId
            });
            return res.status(200).json({
                success: true,
                message: "Course berhasil dihapus permanent",
            });
        }

        // Soft delete
        await course.destroy({
            userId: validation.userId
        });

        return res.status(200).json({
            success: true,
            message: "Course berhasil dihapus",
        });

    } catch (error) {
        return handleError(error, res);
    }
};


const restoreCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const validation = isAdmin(req.userRole, req.userId);
        if (!validation.isValid) {
            throw new AppError(validation.error.message, validation.error.status);
        }

        const course = await Course.findByPk(id, { paranoid: false });

        if (!course) {
            throw new AppError("Course tidak ditemukan", 404);
        }

        if (!course.deletedAt) {
            throw new AppError("Course belum dihapus", 400);
        }

        await course.restore({
            userId: validation.userId
        });

        const restoredCourse = await Course.findByPk(id, {
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name'],
            }]
        });

        return res.status(200).json({
            success: true,
            message: "Course berhasil dipulihkan",
            course: restoredCourse
        });

    } catch (error) {
        return handleError(error, res);
    }
};

module.exports = {
    createCourse,
    updateCourse,
    getCourses,
    getCourseById,
    deleteCourse,
    restoreCourse,
    getAllCourses
};