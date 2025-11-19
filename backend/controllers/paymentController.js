const { Payment, User, Class, Child, ClassEnrollment, Course, EnrollmentPayment } = require('../models');
const { isAdmin } = require('../helpers/validationRole');
const { AppError, handleError } = require('../helpers/helperFunction');
const validatePaymentData = require('../utils/validatePaymentData');
const getFileUrl = require('../utils/getFileUrl');
const { getPagination } = require('../utils/paginationUtil');
const { createSearchWhereClause } = require('../helpers/searchQueryHelper');
const { where, Sequelize } = require('sequelize');

const createPayment = async (req, res) => {
    try {
        const userRole = req.userRole;
        const userId = req.userId;

        // Validasi awal body
        const validationResult = await validatePaymentData(req.body, 'create');
        if (!validationResult.isValid) {
            throw new AppError(validationResult.error.message, validationResult.error.status);
        }

        const { data } = validationResult;

        // Validasi childId jika user adalah parent
        let childId = null;
        if (userRole === 'parent') {
            if (!req.body.childId) {
                throw new AppError("Parent wajib mengirim childId", 400);
            }
            childId = req.body.childId;
        }

        const classData = await Class.findByPk(data.classId);
        if (!classData) {
            throw new AppError("Data Kelas tidak tersedia", 404);
        }

        // Cek existing enrollment
        const existingEnrollment = await ClassEnrollment.findOne({
            where: {
                classId: data.classId,
                ...(userRole === 'parent' ? { childId } : { studentId: userId })
            }
        });

        let enrollmentClass;

        if (!existingEnrollment) {
            // Buat enrollment baru jika belum ada
            enrollmentClass = await ClassEnrollment.create({
                classId: data.classId,
                studentId: userRole === 'parent' ? null : userId,
                childId: childId,
                enrolledAt: new Date(),
                status: 'pending'
            }, {
                userId: userId
            });
        } else if (existingEnrollment.status === 'active') {
            // Jika status masih aktif, kembalikan error
            return res.status(400).json({
                success: false,
                message: "Sudah terdaftar di kelas ini dan masih berstatus aktif."
            });
        } else {
            // Jika status selain aktif, update ke pending
            await existingEnrollment.update({
                status: 'pending',
                progress: 0,
                enrolledAt: new Date()
            });
            enrollmentClass = existingEnrollment;
        }

        // Buat payment
        const paymentProofPath = req.file ? getFileUrl(req, `proof/${req.file.filename}`) : null;
        const datePart = new Date().toISOString().slice(2, 10).split('-').reverse().join('');
        const classNameSlug = classData.name.toLowerCase().replace(/\s+/g, '_');
        const noRef = `${datePart}_${classNameSlug}`;
        const paymentDate = new Date();

        const paymentData = {
            ...data,
            userId: req.userId,
            childId,
            payment_proof: paymentProofPath,
            noRef,
            paymentDate,
        };

        const newPayment = await Payment.create(paymentData, {
            userId: userId
        });

        const result = await Payment.findByPk(newPayment.id, {
            include: [
                {
                    model: User,
                    as: 'fromUser',
                    attributes: { exclude: ['password'] }
                },
                {
                    model: Child,
                    as: 'child',
                    attributes: { exclude: ['password'] }
                },
                {
                    model: Class,
                    as: 'forClass'
                }
            ]
        });

        await EnrollmentPayment.create({
            paymentId: newPayment.id,
            enrollmentId: enrollmentClass.id,
        });

        return res.status(201).json({
            success: true,
            message: "Payment berhasil dibuat",
            payment: result
        });

    } catch (error) {
        return handleError(error, res);
    }
};

const getPayments = async (req, res) => {
    try {
        const {
            status,
            userId,
            classId,
            search,
        } = req.query;

        const searchFields = ["amount"]

        const {
            limit,
            offset,
            statusCondition,
            paranoid,
            meta
        } = getPagination(req.query);

        let whereClause = createSearchWhereClause(search, searchFields);

        if (userId) {
            whereClause.userId = userId;
        }

        if (classId) {
            whereClause.classId = classId;
        }

        if (statusCondition) {
            whereClause = { ...whereClause, ...statusCondition };
        }

        const totalCount = await Payment.count({ where: whereClause });
        meta.total = totalCount;
        meta.totalPages = Math.ceil(totalCount / limit);

        const [pending, completed, failed, userListRaw] = await Promise.all([
            Payment.count({ where: { ...whereClause, status: "pending" } }),
            Payment.count({ where: { ...whereClause, status: "completed" } }),
            Payment.count({ where: { ...whereClause, status: "failed" } }),
            Payment.findAll({
                where: whereClause,
                include: [
                    {
                        model: User,
                        as: 'fromUser',
                        attributes: ['id', 'name']
                    }
                ],
                attributes: [], // ambil hanya dari include
                raw: true,
                nest: true
            })
        ]);

        const availableUsersMap = new Map();
        for (const row of userListRaw) {
            const user = row.fromUser;
            if (user && !availableUsersMap.has(user.id)) {
                availableUsersMap.set(user.id, { id: user.id, name: user.name });
            }
        }
        const availableUsers = Array.from(availableUsersMap.values());

        const { rows: payments } = await Payment.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            include: [
                { model: User, as: 'fromUser', attributes: ["id", "name"] },
                { model: Class, as: 'forClass', attributes: ["id", "name"] },
                {
                    model: Child,
                    as: 'child',
                    attributes: ["id", "name"]
                },
                { model: User, as: 'confirmedBy', attributes: ["id", "name"] }
            ],
            paranoid,
        });

        return res.status(200).json({
            success: true,
            message: payments.length === 0 ? "Data pembayaran tidak ditemukan" : "Berhasil mendapatkan data pembayaran",
            payments,
            countData: {
                pending,
                completed,
                failed
            },
            availableUsers,
            meta
        });

    } catch (error) {
        return handleError(error, res);
    }
};



const getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findByPk(id, {
            include: [
                { model: User, as: 'fromUser', attributes: { exclude: ['password'] } },
                {
                    model: Class,
                    as: 'forClass',
                    include: [
                        {
                            model: Course,
                            as: "course"
                        }
                    ]
                },
                { model: User, as: 'confirmedBy', attributes: { exclude: ['password'] } }
            ]
        });
        if (!payment) {
            throw new AppError("Payment tidak ditemukan", 404);
        }
        return res.status(200).json({
            success: true,
            message: "Payment ditemukan",
            payment
        });
    } catch (error) {
        return handleError(error, res);
    }
};

const updatePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            throw new AppError("Status harus diisi", 400);
        }

        const existing = await Payment.findByPk(id);
        if (!existing) {
            throw new AppError("Payment tidak ditemukan", 404);
        }

        const updateData = { status };

        if (req.file) {
            updateData.payment_proof = getFileUrl(req, `payment/${req.file.filename}`);
        }

        if (req.userRole === 'admin') {
            updateData.confirmation_by = req.userId;
            if (status === 'completed') {
                updateData.confirmation_date = new Date();
            }
        }

        // Ambil data EnrollmentPayment berdasarkan paymentId
        const enrollmentPayments = await EnrollmentPayment.findAll({
            where: { paymentId: existing.id }
        });

        if (!enrollmentPayments) {
            throw new AppError("Enrollemnt Payment tidak ditemukan", 404)
        }

        // Update status pada semua ClassEnrollment yang terkait
        for (const ep of enrollmentPayments) {
            const enrollmentStatus = status === 'completed' ? 'active' : 'pending';

            await ClassEnrollment.update(
                { status: enrollmentStatus },
                { where: { id: ep.enrollmentId } }
            );
        }

        await existing.update(updateData, {
            userId: existing.userId
        });

        const updatedPayment = await Payment.findByPk(id, {
            include: [
                { model: User, as: 'fromUser', attributes: { exclude: ['password'] } },
                { model: Class, as: 'forClass' },
                { model: User, as: 'confirmedBy', attributes: { exclude: ['password'] } }
            ]
        });

        return res.status(200).json({
            success: true,
            message: "Payment berhasil diperbarui",
            payment: updatedPayment
        });

    } catch (error) {
        return handleError(error, res);
    }
};

const deletePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const validation = isAdmin(req.userRole, req.userId);
        if (!validation.isValid) {
            throw new AppError(validation.error.message, validation.error.status);
        }

        const payment = await Payment.findByPk(id, { paranoid: false });
        if (!payment) {
            throw new AppError("Payment tidak ditemukan", 404);
        }

        if (payment.deletedAt) {
            await payment.destroy({ force: true });
            return res.status(200).json({ success: true, message: "Payment dihapus permanen" });
        }

        await payment.destroy();
        return res.status(200).json({ success: true, message: "Payment berhasil dihapus" });

    } catch (error) {
        return handleError(error, res);
    }
};

const restorePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const validation = isAdmin(req.userRole, req.userId);
        if (!validation.isValid) {
            throw new AppError(validation.error.message, validation.error.status);
        }

        const payment = await Payment.findByPk(id, { paranoid: false });
        if (!payment) {
            throw new AppError("Payment tidak ditemukan", 404);
        }

        if (!payment.deletedAt) {
            throw new AppError("Payment belum dihapus", 400);
        }

        await payment.restore();

        const restored = await Payment.findByPk(id, {
            include: [
                { model: User, as: 'fromUser', attributes: { exclude: ['password'] } },
                { model: Class, as: 'forClass' },
                { model: User, as: 'confirmedBy', attributes: { exclude: ['password'] } }
            ]
        });

        return res.status(200).json({
            success: true,
            message: "Payment berhasil dipulihkan",
            payment: restored
        });

    } catch (error) {
        return handleError(error, res);
    }
};

module.exports = {
    createPayment,
    getPayments,
    getPaymentById,
    updatePayment,
    deletePayment,
    restorePayment
};
