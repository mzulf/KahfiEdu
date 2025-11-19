const { Submission, Assignment, User, Child } = require('../models');
const { createSuccessResponse, handleError, AppError } = require('../helpers/helperFunction');
const { getPagination } = require('../utils/paginationUtil');
const { isAdminOrTeacher } = require('../helpers/validationRole');
const getFileUrl = require('../utils/getFileUrl');
const { Op } = require('sequelize');

/**
 * Create a new submission
 */
const createSubmission = async (req, res) => {
    try {
        const { assignmentId, childId } = req.body;
        const studentId = req.userId;

        switch (req.userRole) {
            case 'parent':
                if (!childId) {
                    throw new AppError("ChildId diperlukan untuk parent", 400);
                }
                break;

            case 'student':
                if (childId) {
                    throw new AppError("Student tidak dapat mengirim tugas untuk child", 400);
                }
                break;

            case 'admin':
            case 'teacher':
                throw new AppError("Admin/Teacher tidak dapat membuat submission", 403);

            default:
                throw new AppError("Role tidak valid untuk membuat submission", 403);
        }

        if (!assignmentId) {
            throw new AppError("AssignmentId diperlukan", 400);
        }

        const assignment = await Assignment.findOne({
            where: {
                id: assignmentId,
                dueDate: { [Op.gt]: new Date() }
            }
        });

        if (!assignment) {
            throw new AppError("Assignment tidak ditemukan atau sudah melewati batas waktu", 404);
        }

        const existingSubmission = await Submission.findOne({
            where: {
                assignmentId,
                [Op.or]: [
                    { studentId: studentId || null },
                    { childId: childId || null }
                ]
            }
        });

        if (existingSubmission) {
            throw new AppError("Submission untuk assignment ini sudah ada", 400);
        }

        if (!req.file) {
            throw new AppError("File submission diperlukan", 400);
        }

        const fileUrl = getFileUrl(req, `submissions/${req.file.filename}`);
        const submissionData = {
            assignmentId,
            studentId: req.userRole === 'student' ? studentId : null,
            childId: req.userRole === 'parent' ? childId : null,
            fileUrl,
            submittedAt: new Date()
        };

        const submission = await Submission.create(submissionData, {
            userId: req.userId
        });

        return res.status(201).json({
            success: true,
            message: "Submission berhasil dibuat",
            submission
        });

    } catch (error) {
        return handleError(error, res);
    }
};

/**
 * Get all submissions with pagination and filtering
 */
const getSubmissions = async (req, res) => {
    const { assignmentId, childId, studentId } = req.query;
    const isTeacherOrAdmin = ['admin', 'teacher'].includes(req.userRole);

    try {
        const {
            limit,
            offset,
            statusCondition,
            paranoid,
            meta
        } = getPagination(req.query);

        let whereClause = {};

        // Add status condition if provided
        if (statusCondition) {
            whereClause = { ...whereClause, ...statusCondition };
        }

        // Filter by assignment if provided
        if (assignmentId) {
            whereClause.assignmentId = assignmentId;
        }

        // Handle role-based filtering
        switch (req.userRole) {
            case 'parent':
                if (!childId) {
                    throw new AppError("ChildId diperlukan untuk melihat submission anak", 400);
                }
                whereClause.childId = childId;
                break;

            case 'student':
                whereClause.studentId = req.userId;
                break;

            case 'admin':
            case 'teacher':
                if (!isTeacherOrAdmin) {
                    throw new AppError("role tidak valid", 400);
                }
                if (childId) whereClause.childId = childId;
                if (studentId) whereClause.studentId = studentId;
                break;

            default:
                throw new AppError("Role tidak valid untuk mengakses submission", 403);
        }

        // Get submissions with related data
        const { rows: submissions, count } = await Submission.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Assignment,
                    as: 'assignment',
                    attributes: ['title', 'description', 'dueDate']
                },
                {
                    model: User,
                    as: "student",
                    attributes: ['name', 'email']
                },
                {
                    model: Child,
                    as: "child",
                    attributes: ['name']
                }
            ],
            limit,
            offset,
            order: [['submittedAt', 'DESC']],
            paranoid: !isTeacherOrAdmin && paranoid,
            distinct: true
        });

        // Update meta information
        meta.total = count;
        meta.totalPages = Math.ceil(count / limit);

        // Handle no results
        if (submissions.length === 0) {
            meta.total = 0;
            meta.totalPages = 0;
            throw new AppError("Tidak ada submission yang ditemukan", 404);
        }

        // Return successful response
        return res.status(200).json({
            success: true,
            message: "Berhasil mendapatkan data submissions",
            submissions,
            meta
        });

    } catch (error) {
        return handleError(error, res);
    }
};

/**
 * Get submission by ID
 */
const getSubmissionById = async (req, res) => {
    const { id } = req.params;
    const { childId } = req.query; // Changed from req.body to req.query
    const isTeacherOrAdmin = ['admin', 'teacher'].includes(req.userRole);

    try {
        const submission = await Submission.findOne({
            where: { id },
            include: [
                {
                    model: Assignment,
                    as: 'assignment',
                    attributes: ['title', 'description', 'dueDate']
                },
                {
                    model: User,
                    as: "student",
                    attributes: ['name', 'email']
                },
                {
                    model: Child,
                    as: "child",
                    attributes: ['name']
                }
            ],
            paranoid: !isTeacherOrAdmin
        });

        if (!submission) {
            throw new AppError("Data submission tidak ditemukan", 404)
        }

        // Role-based access control
        switch (req.userRole) {
            case 'parent':
                if (!childId) {
                    throw new AppError("ChildId diperlukan untuk melihat submission anak", 400);
                }
                if (submission.childId !== childId) {
                    throw new AppError("Anda tidak memiliki akses ke submission ini", 403);
                }
                break;

            case 'student':
                if (submission.studentId !== req.userId) {
                    throw new AppError("Anda tidak memiliki akses ke submission ini", 403);
                }
                break;

            case 'admin':
            case 'teacher':
                // Admin and teachers can access all submissions
                break;

            default:
                throw new AppError("Role tidak valid untuk mengakses submission", 403);
        }

        return res.status(200).json(createSuccessResponse(
            "Submission ditemukan",
            { submission }
        ));

    } catch (error) {
        return handleError(error, res)
    }
};

/**
 * Grade a submission (teacher/admin only)
 */
const gradeSubmission = async (req, res) => {
    const { id } = req.params;
    const { grade, feedback } = req.body;

    const validation = isAdminOrTeacher(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status)
    }

    try {
        const submission = await Submission.findByPk(id);
        if (!submission) {
            throw new AppError("Data submisson tidak ditemukan", 404)
        }

        // Validate grade
        if (!grade) {
            if (typeof grade === 'number' && Number.isFinite(grade) && grade < 0 || grade > 100) {
                throw new AppError("Grade harus berupa angka antara 0 dan 100", 400)
            }
        }

        if (!feedback) {
            throw new AppError("Feedback harus diisi", 404)
        }

        await submission.update({
            grade,
            feedback: feedback
        }, {
            userId: req.userId
        });

        return res.status(200).json(createSuccessResponse(
            "Submission berhasil dinilai",
            { submission }
        ));

    } catch (error) {
        return handleError(error, res)
    }
};

/**
 * Delete a submission (soft delete)
 */
const deleteSubmission = async (req, res) => {
    const { id } = req.params;

    const validation = isAdminOrTeacher(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status)
    }

    try {
        const submission = await Submission.findByPk(id, {
            paranoid: false
        });
        if (!submission) {
            throw new AppError("Data submission tidak ditemukan", 404)
        }

        if (submission.deletedAt) {
            await submission.destroy({
                force: true,
                userId: req.userId
            });

            return res.status(200).json(createSuccessResponse(
                "Submission berhasil dihapus permanen"
            ));
        }

        await submission.destroy({
            userId: req.userId
        });

        return res.status(200).json(createSuccessResponse(
            "Submission berhasil dihapus"
        ));

    } catch (error) {
        return handleError(error, res)
    }
};

const restoreSubmission = async (req, res) => {
    const { id } = req.params;

    // Validate admin/teacher role
    const validation = isAdminOrTeacher(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status)
    }

    try {
        // Attempt to restore
        const restored = await Submission.restore({
            where: { id },
            userId: req.userId
        });

        if (!restored) {
            throw new AppError("Data submission tidak ditemukan atau sudah tidak aktif", 404)
        }

        // Get restored submission with relations
        const submission = await Submission.findOne({
            where: { id },
            include: [
                {
                    model: Assignment,
                    as: 'assignment',
                    attributes: ['title', 'description', 'dueDate']
                },
                {
                    model: User,
                    as: "student",
                    attributes: ['name', 'email']
                },
                {
                    model: Child,
                    as: "child",
                    attributes: ['name']
                }
            ]
        });

        return res.status(200).json(createSuccessResponse(
            "Submission berhasil dipulihkan",
            { submission }
        ));

    } catch (error) {
        return handleError(error, res)
    }
};

module.exports = {
    createSubmission,
    getSubmissions,
    getSubmissionById,
    gradeSubmission,
    deleteSubmission,
    restoreSubmission
};