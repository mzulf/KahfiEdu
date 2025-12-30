const { Op } = require('sequelize')
const { Attendance, Lesson, User, Class, Child, ClassEnrollment } = require('../models')
const { getPagination } = require('../utils/paginationUtil')
const { createSearchWhereClause } = require('../helpers/searchQueryHelper')
const { handleError, AppError } = require('../helpers/helperFunction')

const createAttendance = async (req, res) => {
    const { code, execuseLetter, description, status } = req.body
    const userId = req.userId
    const userRole = req.userRole

    if (!code || !status) {
        throw new AppError("code dan status dibutuhkan", 400)
    }


    if (!['izin', 'sakit', 'hadir'].includes(status)) {
        throw new AppError("status harus (izin, sakit, hadir)", 400);
    }

    // Validasi tambahan jika status bukan 'hadir'
    if (status !== 'hadir') {
        if (!execuseLetter || !description) {
            throw new AppError("execuseLetter dan description wajib diisi jika status bukan 'hadir'", 400);
        }
    }

    try {
        const attendanceData = {}
        const lesson = await Lesson.findOne({
            where: { code },
        });

        if (!lesson) {
            throw new AppError(`Lesson dengan code (${code}) tidak ada`, 404)
        }

        const existingUser = await User.findByPk(userId);

        if (!existingUser) {
            throw new AppError("Data pengguna tidak ditemukan", 404)
        }

        // Handle student or parent
        if (userRole === 'student') {
            // Check if student is enrolled in the class
            const isEnrolled = await ClassEnrollment.findOne({
                where: {
                    studentId: userId,
                    classId: lesson.classId
                }
            });

            if (!isEnrolled) {
                throw new AppError("Siswa tidak terdaftar di kelas ini", 403)
            }

            attendanceData.studentId = userId;
        } else if (userRole === 'parent') {
            // Get child data for parent
            const existingChild = await Child.findOne({
                where: {
                    parentId: userId
                }
            });

            if (!existingChild) {
                throw new AppError("Data anak tidak ditemukan", 404)
            }

            // Check if child is enrolled in the class
            const isEnrolled = await ClassEnrollment.findOne({
                where: {
                    childId: existingChild.id,
                    classId: lesson.classId
                }
            });

            if (!isEnrolled) {
                throw new AppError("Anak tidak terdaftar di kelas ini", 403)
            }

            attendanceData.childId = existingChild.id;
        } else if (userRole === 'teacher') {
            const isTeacherClass = Class.findOne({
                where: {
                    id: lesson.classId,
                    teacherId: userId
                }
            })

            if (!isTeacherClass) {
                throw new AppError("Anda bukan guru di kelas ini", 403)
            }

            attendanceData.teacherId = userId
        } else {
            throw new AppError("Hanya siswa, guru atau orang tua yang dapat membuat absensi", 403)
        }

        // Add other attendance data
        attendanceData.execuseLetter = execuseLetter || null;
        attendanceData.description = description || null;
        attendanceData.status = status;
        attendanceData.code = code;
        attendanceData.classId = lesson.classId;
        attendanceData.lessonId = lesson.id;
        attendanceData.scanTime = new Date();

        const newAttendance = await Attendance.create(attendanceData, {
            userId: userId
        });

        // Update progress kelas hanya jika userRole adalah teacher
        if (req.userRole === 'teacher') {
            const kelas = await Class.findByPk(newAttendance.classId);
            if (kelas) {
                await kelas.update({ progress: (kelas.progress || 0) + 1 });
            }
        }



        return res.status(201).json({
            success: true,
            message: "Berhasil membuat absensi",
            attendance: newAttendance
        });

    } catch (error) {
        return handleError(error, res);
    }
}

const updateAttendance = async (req, res) => {
    const { id } = req.params
    const { isVerified } = req.body
    const userRole = req.userRole
    const userId = req.userId

    if (!isVerified) {
        throw new AppError("isVerified is required", 400)
    }
    if (typeof isVerified !== 'boolean' && isVerified !== 'true' && isVerified !== 'false') {
        throw new AppError("isVerified must be a boolean value", 400)
    }

    if (userRole !== 'admin' && userRole !== 'teacher') {
        throw new AppError("Hanya admin atau teacher yang dapat akses", 403)
    }
    try {

        const existingAttendance = await Attendance.findByPk(id)

        if (!existingAttendance) {
            throw new AppError("Attendance tidak ditemukan", 404)
        }

        if (userRole === 'teacher') {
            const isTeacher = Class.findOne({
                where: {
                    id: existingAttendance.classId,
                    teacherId: userId
                }
            })

            if (!isTeacher) {
                throw new AppError("Anda bukan guru dikelas sini", 403)
            }
        }

        if (existingAttendance.teacherId === userId) {
            throw new AppError("Anda tidak dapat menyetujui absensi ini", 403)
        }

        existingAttendance.isVerified = isVerified
        await existingAttendance.save({
            userId: userId
        })
        return res.status(200).json({
            success: true,
            message: "Update berhasil",
            attendance: existingAttendance
        })

    } catch (error) {
        return handleError(error, res);
    }
}

const getAttendances = async (req, res) => {
    const {
        search = "",
        classId,
        childId,
        teacherId,
        studentId
    } = req.query;

    const searchFields = ['code'];
    const exactMatchFields = { classId, childId, teacherId, studentId };

    try {
        const {
            limit,
            offset,
            statusCondition,
            paranoid,
            meta
        } = getPagination(req.query);

        let whereClause = {};

        // 🔁 Role-based filtering
        switch (req.userRole) {
            case 'student':
                whereClause.studentId = req.userId;
                if (childId) {
                    throw new AppError("Child id tidak dibutuhkan untuk siswa", 400);
                }
                break;

            case 'parent':
                if (!childId) {
                    throw new AppError("Wajib pilih anak untuk role parent", 400);
                }
                whereClause.childId = childId;
                break;

            case 'teacher':
            case 'admin':
                // Tidak ada filter tambahan, bisa lihat semua
                break;

            default:
                throw new AppError("Role tidak dikenali", 403);
        }

        // Tambahkan exact match fields
        for (const [key, value] of Object.entries(exactMatchFields)) {
            if (value) {
                whereClause[key] = { [Op.eq]: value };
            }
        }

        // Tambahkan search
        const searchClause = createSearchWhereClause(search, searchFields);
        whereClause = { ...whereClause, ...searchClause };

        // Tambahkan status jika ada
        if (statusCondition) {
            whereClause = { ...whereClause, ...statusCondition };
        }

        // Hitung total data
        const totalCount = await Attendance.count({ where: whereClause });
        meta.total = totalCount;
        meta.totalPages = Math.ceil(totalCount / limit);

        // Query utama dengan relasi
        const attendances = await Attendance.findAll({
            where: whereClause,
            limit,
            offset,
            order: [['updatedAt', 'DESC']],
            include: [
                {
                    model: Class,
                    as: 'class',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: User,
                            as: 'teacher',
                            attributes: ['id', 'name', 'phone']
                        }
                    ]
                },
                {
                    model: Lesson,
                    as: 'lesson',
                    attributes: ['id', 'title']
                },
                {
                    model: User,
                    as: 'teacher',
                    attributes: ['id', 'name', 'phone']
                }
            ],
            paranoid,
            distinct: true
        });

        if (attendances.length === 0) {
            throw new AppError("Data absensi tidak ditemukan", 404);
        }

        // Group data by classId and lessonId
        const groupedAttendances = attendances.reduce((acc, attendance) => {
            const classData = attendance.class;
            const lessonData = attendance.lesson;

            const classId = classData.id;
            const className = classData.name;
            const teacher = classData.teacher || attendance.teacher;

            if (!acc[classId]) {
                acc[classId] = {
                    classId,
                    className,
                    teacherId: teacher?.id || null,
                    teacherName: teacher?.name || null,
                    lessons: {}
                };
            }

            const lessonId = lessonData.id;
            const lessonTitle = lessonData.title;

            if (!acc[classId].lessons[lessonId]) {
                acc[classId].lessons[lessonId] = {
                    lessonId,
                    lessonTitle,
                    attendances: []
                };
            }

            const { class: _, lesson: __, ...attendanceData } = attendance.toJSON();
            acc[classId].lessons[lessonId].attendances.push(attendanceData);

            return acc;
        }, {});

        // Ubah jadi array dan susun struktur response
        const formattedClasses = Object.values(groupedAttendances).map(classGroup => ({
            ...classGroup,
            lessons: Object.values(classGroup.lessons)
        }));

        return res.status(200).json({
            success: true,
            message: "Berhasil mendapatkan data attendances",
            classes: formattedClasses,
            meta
        });

    } catch (error) {
        return handleError(error, res);
    }
};



const getAttendanceById = async (req, res) => {
    const { id } = req.params;

    try {
        const attendance = await Attendance.findOne({
            where: { id },
            include: [
                {
                    model: Class,
                    as: 'class',
                    attributes: ["id", "name"],
                    include: [{
                        model: User,
                        as: 'teacher',
                        attributes: ["id", "name", "phone"]
                    }]
                },
                {
                    model: Lesson,
                    as: 'lesson',
                    attributes: ["id", "title"]
                },
                {
                    model: User,
                    as: 'student',
                    attributes: ["id", "name"],
                    required: false
                },
                {
                    model: Child,
                    as: 'child',
                    attributes: ["id", "name"],
                    required: false
                }
            ]
        });

        if (!attendance) {
            throw new AppError("Data absensi tidak ditemukan", 404)
        }

        return res.status(200).json({
            success: true,
            message: "Berhasil mendapatkan data attendance",
            attendance
        });

    } catch (error) {
        return handleError(error, res);
    }
};

// Don't forget to add it to module.exports
module.exports = {
    createAttendance,
    updateAttendance,
    getAttendances,
    getAttendanceById
};