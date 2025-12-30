const { User, Course, Role } = require('../models');

/**
 * Validates class data for create and update operations
 * @param {Object} data Class data to validate
 * @param {string} data.courseId Class's courseId
 * @param {string} data.teacherId Class's teacherId
 * @param {string} data.name Class's name
 * @param {string} data.schedule Class's schedule
 * @param {Date} data.startDate Class's start date
 * @param {Date} data.endDate Class's end date
 * @param {string} mode Operation mode ('create' or 'update')
 * @returns {Object} Validation result
 */
const validateClassData = async (data, mode = 'create') => {
    const { name, teacherId, courseId, schedule, startDate, endDate, status, progress } = data;
    const validatedData = {};

    if (mode === 'create') {
        if (!name || !teacherId || !courseId || !schedule || !startDate || !endDate) {
            return {
                isValid: false,
                error: {
                    status: 400,
                    message: "Semua field wajib diisi"
                }
            };
        }

        // Validasi nama kelas
        if (typeof name !== 'string' || name.trim().length === 0) {
            return {
                isValid: false,
                error: {
                    status: 400,
                    message: "Nama kelas harus berupa teks"
                }
            };
        }
        validatedData.name = name.trim();

        // Validasi jadwal
        if (typeof schedule !== 'string' || schedule.trim().length === 0) {
            return {
                isValid: false,
                error: {
                    status: 400,
                    message: "Jadwal harus berupa teks"
                }
            };
        }
        validatedData.schedule = schedule.trim();

        // Validasi teacherId
        const teacher = await User.findOne({
            where: { id: teacherId },
            include: [{
                model: Role,
                as: 'role'
            }]
        });

        if (!teacher || teacher.role?.name !== 'teacher') {
            return {
                isValid: false,
                error: {
                    status: 400,
                    message: "teacherId tidak valid atau bukan user dengan role 'teacher'"
                }
            };
        }
        validatedData.teacherId = teacherId;

        // Validasi courseId
        const course = await Course.findByPk(courseId);
        if (!course) {
            return {
                isValid: false,
                error: {
                    status: 404,
                    message: "Course tidak ditemukan"
                }
            };
        }
        validatedData.courseId = courseId;

        // Validasi tanggal
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime())) {
            return {
                isValid: false,
                error: {
                    status: 400,
                    message: "Tanggal mulai tidak valid"
                }
            };
        }

        if (isNaN(end.getTime())) {
            return {
                isValid: false,
                error: {
                    status: 400,
                    message: "Tanggal selesai tidak valid"
                }
            };
        }

        if (start >= end) {
            return {
                isValid: false,
                error: {
                    status: 400,
                    message: "Tanggal selesai harus setelah tanggal mulai"
                }
            };
        }

        validatedData.startDate = start;
        validatedData.endDate = end;

        // Optional: Validasi status jika ada
        if (status && !["akan datang", "berjalan", "selesai"].includes(status)) {
            return {
                isValid: false,
                error: {
                    status: 400,
                    message: "Status tidak valid"
                }
            };
        }
        if (status) validatedData.status = status;

        // Optional: Validasi progress jika ada
        if (progress !== undefined) {
            const parsedProgress = parseInt(progress);
            if (isNaN(parsedProgress) || parsedProgress < 0 || parsedProgress > 100) {
                return {
                    isValid: false,
                    error: {
                        status: 400,
                        message: "Progress harus berupa angka antara 0 sampai 100"
                    }
                };
            }
            validatedData.progress = parsedProgress;
        }
    }

    if (mode === 'update') {
        const updates = {};

        if (name !== undefined) {
            if (typeof name !== 'string' || name.trim().length === 0) {
                return {
                    isValid: false,
                    error: {
                        status: 400,
                        message: "Nama kelas harus berupa teks"
                    }
                };
            }
            updates.name = name.trim();
        }

        if (schedule !== undefined) {
            if (typeof schedule !== 'string' || schedule.trim().length === 0) {
                return {
                    isValid: false,
                    error: {
                        status: 400,
                        message: "Jadwal harus berupa teks"
                    }
                };
            }
            updates.schedule = schedule.trim();
        }

        if (teacherId !== undefined) {
            const teacher = await User.findOne({
                where: { id: teacherId },
                include: [{ model: Role, as: 'role' }]
            });
            if (!teacher || teacher.role?.name !== 'teacher') {
                return {
                    isValid: false,
                    error: {
                        status: 400,
                        message: "teacherId tidak valid atau bukan teacher"
                    }
                };
            }
            updates.teacherId = teacherId;
        }

        if (courseId !== undefined) {
            const course = await Course.findByPk(courseId);
            if (!course) {
                return {
                    isValid: false,
                    error: {
                        status: 404,
                        message: "Course tidak ditemukan"
                    }
                };
            }
            updates.courseId = courseId;
        }

        if (startDate !== undefined || endDate !== undefined) {
            const start = startDate ? new Date(startDate) : undefined;
            const end = endDate ? new Date(endDate) : undefined;

            if (start && isNaN(start.getTime())) {
                return {
                    isValid: false,
                    error: {
                        status: 400,
                        message: "Tanggal mulai tidak valid"
                    }
                };
            }

            if (end && isNaN(end.getTime())) {
                return {
                    isValid: false,
                    error: {
                        status: 400,
                        message: "Tanggal selesai tidak valid"
                    }
                };
            }

            if (start && end && start >= end) {
                return {
                    isValid: false,
                    error: {
                        status: 400,
                        message: "Tanggal selesai harus setelah tanggal mulai"
                    }
                };
            }

            if (start) updates.startDate = start;
            if (end) updates.endDate = end;
        }

        if (status !== undefined) {
            if (!["akan datang", "berjalan", "selesai"].includes(status)) {
                return {
                    isValid: false,
                    error: {
                        status: 400,
                        message: "Status tidak valid"
                    }
                };
            }
            updates.status = status;
        }

        if (progress !== undefined) {
            const parsedProgress = parseInt(progress);
            if (isNaN(parsedProgress) || parsedProgress < 0 || parsedProgress > 100) {
                return {
                    isValid: false,
                    error: {
                        status: 400,
                        message: "Progress harus antara 0 dan 100"
                    }
                };
            }
            updates.progress = parsedProgress;
        }

        return {
            isValid: true,
            data: updates
        };
    }

    return {
        isValid: true,
        data: validatedData
    };
};


module.exports = validateClassData;