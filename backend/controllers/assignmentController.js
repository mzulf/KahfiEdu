const { Assignment, Class } = require('../models');
const { createSuccessResponse, handleError, AppError } = require('../helpers/helperFunction');
const { createSearchWhereClause } = require('../helpers/searchQueryHelper');
const { getPagination } = require('../utils/paginationUtil');
const validateAssignmentData = require('../utils/validateAssignmentData');
const { isAdminOrTeacher } = require('../helpers/validationRole');

const createAssignment = async (req, res) => {
    const validationResult = await validateAssignmentData(req.body, 'create');
    if (!validationResult.isValid) {
        throw new AppError(validationResult.error.message, validationResult.error.status);
    }

    const validation = isAdminOrTeacher(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status);
    }

    try {
        const newAssignment = await Assignment.create(validationResult.data, {
            userId: validation.userId
        });

        const resultAssignment = await Assignment.findByPk(newAssignment.id);
        if (!resultAssignment) {
            throw new AppError("Data tugas tidak ditemukan", 404);
        }

        return res.status(201).json(createSuccessResponse(
            "Tugas berhasil dibuat",
            { assignment: resultAssignment }
        ));

    } catch (error) {
        return handleError(error, res);
    }
};

const getAssignments = async (req, res) => {
    const { search = "", classId } = req.query;
    const searchFields = ['title', 'description'];
    const isAdmin = req.userRole === 'admin';

    try {
        const {
            limit,
            offset,
            statusCondition,
            paranoid,
            meta
        } = getPagination(req.query);

        let whereClause = createSearchWhereClause(search, searchFields);

        if (statusCondition) {
            whereClause = { ...whereClause, ...statusCondition };
        }

        if (classId) {
            whereClause.classId = classId;
        }

        const totalCount = await Assignment.count({
            where: whereClause,
            paranoid: !isAdmin && paranoid
        });

        meta.total = totalCount;
        meta.totalPages = Math.ceil(totalCount / limit);

        const { rows: assignments } = await Assignment.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            include: [{ model: Class, as: "class", attributes: ["id", "name"] }],
            order: [['dueDate', 'ASC']],
            paranoid: !isAdmin && paranoid,
            distinct: true
        });

        if (assignments.length === 0) {
            throw new AppError("Tidak ada tugas yang ditemukan", 404);
        }

        return res.status(200).json({
            success: true,
            message: "Berhasil mendapatkan data tugas",
            assignments,
            meta
        });

    } catch (error) {
        return handleError(error, res);
    }
};

const getAssignmentById = async (req, res) => {
    const { id } = req.params;
    const isAdmin = req.userRole === 'admin';

    try {
        const assignment = await Assignment.findByPk(id, {
            paranoid: !isAdmin,
            include: [{ model: Class, as: "class", attributes: ["id", "name"] }],
        });

        if (!assignment) {
            throw new AppError("Tidak ada tugas yang ditemukan", 404);
        }

        return res.status(200).json(createSuccessResponse(
            "Data tugas ditemukan",
            { assignment }
        ));

    } catch (error) {
        return handleError(error, res);
    }
};

const updateAssignment = async (req, res) => {
    const { id } = req.params;
    const validationResult = await validateAssignmentData(req.body, 'update');
    if (!validationResult.isValid) {
        throw new AppError(validationResult.error.message, validationResult.error.status);
    }

    const validation = isAdminOrTeacher(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status);
    }

    try {
        const assignment = await Assignment.findByPk(id);
        if (!assignment) {
            throw new AppError("Data tugas tidak ditemukan", 404)
        }

        await assignment.update(validationResult.data, {
            userId: validation.userId
        });

        const updatedAssignment = await Assignment.findByPk(id);

        return res.status(200).json(createSuccessResponse(
            "Tugas berhasil diperbarui",
            { assignment: updatedAssignment }
        ));

    } catch (error) {
        return handleError(error, res);
    }
};

const deleteAssignment = async (req, res) => {
    const { id } = req.params;

    const validation = isAdminOrTeacher(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status);
    }

    try {
        const assignment = await Assignment.findByPk(id, {
            paranoid: false
        });
        if (!assignment) {
            throw new AppError("Data tugas tidak ditemukan", 404)
        }

        if (assignment.deletedAt) {
            await assignment.destroy({
                force: true,
                userId: validation.userId
            })
            return res.status(200).json(createSuccessResponse(
                "Tugas berhasil dihapus permanen"
            ));
        }
        await assignment.destroy({
            userId: validation.userId
        });

        return res.status(200).json(createSuccessResponse(
            "Tugas berhasil dihapus"
        ));

    } catch (error) {
        return handleError(error, res);
    }
};

const restoreAssignment = async (req, res) => {
    const { id } = req.params;

    const validation = isAdminOrTeacher(req.userRole, req.userId);
    if (!validation.isValid) {
        return res.status(validation.error.status)
            .json({ message: validation.error.message });
    }

    try {
        const restored = await Assignment.restore({
            where: { id },
            userId: validation.userId
        });

        if (!restored) {
            throw new AppError("Data tugas tidak ditemukan", 404)
        }

        const assignment = await Assignment.findByPk(id);

        return res.status(200).json(createSuccessResponse(
            "Tugas berhasil dipulihkan",
            { assignment }
        ));

    } catch (error) {
        return handleError(error, res);
    }
};

module.exports = {
    createAssignment,
    getAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment,
    restoreAssignment
};