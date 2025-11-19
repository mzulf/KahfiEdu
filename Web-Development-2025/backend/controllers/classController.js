const { isAdmin } = require('../helpers/validationRole');
const { Class, Course, User, Category, Role, Assignment, ClassEnrollment, Child, Lesson } = require('../models')
const validateClassData = require('../utils/validateClassData')
const { getPagination } = require('../utils/paginationUtil');
const { createSearchWhereClause } = require('../helpers/searchQueryHelper');
const { AppError, handleError, createSuccessResponse } = require('../helpers/helperFunction');
const { where } = require('sequelize');


const createClass = async (req, res) => {
    try {
        const validationResult = await validateClassData(req.body, 'create');

        if (!validationResult.isValid) {
            const { status, message } = validationResult.error;
            throw new AppError(message, status)
        }

        const validation = isAdmin(req.userRole, req.userId);
        if (!validation.isValid) {
            throw new AppError(validation.error.message, validation.error.status);
        }

        const classData = {
            ...validationResult.data
        }


        const newClass = await Class.create(classData, {
            userId: validation.userId
        })

        const resultClass = await Class.findByPk(newClass.id, {
            include: [
                {
                    model: Course,
                    as: "course",
                    attributes: ["id", "title"]
                },
                {
                    model: User,
                    as: "teacher",
                    attributes: ["id", "name"]
                }
            ]
        })

        return res.status(201).json({
            success: true,
            message: "Class berhasil dibuat",
            class: resultClass
        });


    } catch (error) {
        return handleError(error, res)
    }
}

const getClasses = async (req, res) => {
    const { search = "", teacherId, courseId } = req.query;
    const searchFields = ['name']; // Sesuaikan dengan field class

    try {
        const {
            limit,
            offset,
            statusCondition,
            paranoid,
            meta
        } = getPagination(req.query);

        let whereClause = createSearchWhereClause(search, searchFields);

        // Tambahkan filter statusCondition jika ada
        if (statusCondition) {
            whereClause = { ...whereClause, ...statusCondition };
        }

        // Jika role adalah teacher, hanya ambil kelas yang sesuai dengan teacherId
        if (req.userRole === 'teacher') {
            whereClause.teacherId = req.userId;
        }

        if (teacherId) {
            whereClause.teacherId = teacherId;
        }

        if (courseId) {
            whereClause.courseId = courseId;
        }

        const totalCount = await Class.count({ where: whereClause });
        meta.total = totalCount;
        meta.totalPages = Math.ceil(totalCount / limit);

        const classes = await Class.findAll({
            where: whereClause,
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            include: [
                { model: Course, as: 'course', attributes: ['id', 'title'] },
                { model: User, as: 'teacher', attributes: ['id', 'name'] }
            ],
            paranoid
        });

        return res.status(200).json({
            success: true,
            message: classes.lenght === 0 ? "Data kelas tidak ditemukan" : "Berhasil mendapatkan data kelas",
            classes,
            meta
        });

    } catch (error) {
        return handleError(error, res);
    }
};

const getClassById = async (req, res) => {
    const { id } = req.params;
    try {
        const cls = await Class.findByPk(id, {
            include: [
                {
                    model: Course,
                    as: 'course',
                    attributes: ['id', 'title', 'level'],
                    include: [
                        {
                            model: Category,
                            as: 'category',
                            attributes: ['id', 'name']
                        }
                    ]
                },
                {
                    model: User,
                    as: 'teacher',
                    attributes: ['id', 'name', 'email', 'phone', 'avatar'],
                    include: [
                        {
                            model: Role,
                            as: 'role',
                            attributes: ['id', 'name']
                        }
                    ]
                },
                {
                    model: ClassEnrollment,
                    as: 'class_enrollments',
                    attributes: ['id', 'studentId', 'status', 'progress'],
                    include: [
                        {
                            model: User,
                            as: 'student',
                            attributes: ['id', 'name', 'email', 'phone', 'avatar', 'gender'],
                        },
                        {
                            model: Child,
                            as: 'child',
                            attributes: ['id', 'name', 'gender', 'relationship'],
                            include: [
                                {
                                    model: User,
                                    as: 'parent',
                                    attributes: ['id', 'name', 'email', 'phone', 'avatar']
                                }
                            ]
                        },
                    ]
                },
                {
                    model: Assignment,
                    as: 'assignments',
                    paranoid: false,
                    include: [
                        {
                            model: Class,
                            as: 'class',
                            attributes: ['id', 'name']
                        }
                    ],
                },
                {
                    model: Lesson,
                    as: 'lessons',
                    paranoid: false,
                    include: [
                        {
                            model: Class,
                            as: 'class',
                            attributes: ['id', 'name']
                        }
                    ],
                },

            ],
            paranoid: false
        });

        if (!cls) {
            throw new AppError("Data class tidak ditemukan", 404);
        }

        return res.status(200).json({
            success: true,
            message: "Berhasil mendapatkan data class",
            class: cls
        });
    } catch (error) {
        return handleError(error, res);
    }
};


const updateClass = async (req, res) => {
    const { id } = req.params;
    const validationResult = await validateClassData(req.body, 'update');
    if (!validationResult.isValid) {
        const { status, message } = validationResult.error;
        throw new AppError(message, status)
    }

    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) {
        return res.status(validation.error.status).json({ message: validation.error.message });
    }

    try {
        const cls = await Class.findByPk(id);
        if (!cls) {
            throw new AppError("Data class tidak ditemukan", 404)
        }

        await cls.update(validationResult.data, { userId: validation.userId });

        const updatedClass = await Class.findByPk(id, {
            include: [
                { model: Course, as: 'course', attributes: ['id', 'title'] },
                { model: User, as: 'teacher', attributes: ['id', 'name'] }
            ]
        });

        return res.status(200).json({
            success: true,
            message: "Class berhasil diperbarui",
            class: updatedClass
        });
    } catch (error) {
        return handleError(error, res)
    }
};

const deleteClass = async (req, res) => {
    const { id } = req.params;

    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status)
    }

    try {
        const cls = await Class.findByPk(id, { paranoid: false });

        if (!cls) {
            throw new AppError("Data class tidak ditemukan", 404)
        }

        if (cls.deletedAt) {
            await cls.destroy({ force: true, userId: validation.userId });
            return res.status(200).json(createSuccessResponse(
                "Class berhasil dihapus permanen"
            ));
        }

        await cls.destroy({ userId: validation.userId });
        return res.status(200).json(createSuccessResponse(
            "Class berhasil dihapus"
        ));
    } catch (error) {
        return handleError(error, res)
    }
};

const restoreClass = async (req, res) => {
    const { id } = req.params;

    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status)
    }

    try {
        const cls = await Class.findByPk(id, { paranoid: false });

        if (!cls && !cls.deletedAt) {
            throw new AppError("Class tidak ditemukan atau masih aktif", 404)
        }

        await cls.restore({ userId: validation.userId });

        const restoredClass = await Class.findByPk(id, {
            include: [
                { model: Course, as: 'course', attributes: ['id', 'title'] },
                { model: User, as: 'teacher', attributes: ['id', 'name'] }
            ]
        });

        return res.status(200).json({
            success: true,
            message: "Class berhasil dipulihkan",
            class: restoredClass
        });
    } catch (error) {
        return handleError(error, res)
    }
};

module.exports = {
    createClass,
    getClasses,
    getClassById,
    updateClass,
    deleteClass,
    restoreClass
};