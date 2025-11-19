const { Class, User, Child } = require('../models');

/**
 * Validates data for class enrollment creation or update
 * @param {Object} data Enrollment data
 * @param {string} data.classId
 * @param {string} [data.studentId]
 * @param {string} [data.childId]
 * @param {string} data.enrolledAt
 * @param {string} [data.status]
 * @param {string} mode 'create' | 'update'
 * @returns {Promise<{ isValid: boolean, data?: object, error?: object }>}
 */
const validateClassEnrollmentData = async (data, mode = 'create') => {
    const { classId, studentId, childId, enrolledAt, status } = data;
    const validatedData = {};

    // Cek keharusan field pada mode create
    if (mode === 'create') {
        if (!classId || (!studentId && !childId)) {
            return {
                isValid: false,
                error: {
                    status: 400,
                    message: "classId, enrolled_at, dan minimal salah satu dari studentId atau childId wajib diisi"
                }
            };
        }
    }

    // Validasi classId
    if (classId !== undefined) {
        if (typeof classId !== 'string' || classId.length !== 36) {
            return {
                isValid: false,
                error: {
                    status: 400,
                    message: "classId harus berupa UUID (36 karakter)"
                }
            };
        }
        const classExists = await Class.findByPk(classId);
        if (!classExists) {
            return {
                isValid: false,
                error: {
                    status: 404,
                    message: "classId tidak ditemukan"
                }
            };
        }
        validatedData.classId = classId;
    }

    // Validasi studentId jika ada
    if (studentId !== undefined) {
        if (typeof studentId !== 'string' || studentId.length !== 36) {
            return {
                isValid: false,
                error: {
                    status: 400,
                    message: "studentId harus berupa UUID (36 karakter)"
                }
            };
        }
        const userExists = await User.findByPk(studentId);
        if (!userExists) {
            return {
                isValid: false,
                error: {
                    status: 404,
                    message: "studentId tidak ditemukan"
                }
            };
        }
        validatedData.studentId = studentId;
    }

    // Validasi childId jika ada
    if (childId !== undefined) {
        if (typeof childId !== 'string' || childId.length !== 36) {
            return {
                isValid: false,
                error: {
                    status: 400,
                    message: "childId harus berupa UUID (36 karakter)"
                }
            };
        }
        const childExists = await Child.findByPk(childId);
        if (!childExists) {
            return {
                isValid: false,
                error: {
                    status: 404,
                    message: "childId tidak ditemukan"
                }
            };
        }
        validatedData.childId = childId;
    }

    // Pastikan minimal salah satu dari studentId atau childId valid (create atau update)
    if (
        (mode === 'create' || (studentId !== undefined || childId !== undefined)) &&
        !validatedData.studentId && !validatedData.childId
    ) {
        return {
            isValid: false,
            error: {
                status: 400,
                message: "Minimal salah satu dari studentId atau childId harus valid"
            }
        };
    }

    // Validasi tanggal pendaftaran
    if (enrolledAt !== undefined) {
        const date = new Date(enrolledAt);
        if (isNaN(date)) {
            return {
                isValid: false,
                error: {
                    status: 400,
                    message: "enrolled_at harus berupa tanggal yang valid"
                }
            };
        }
        validatedData.enrolledAt = date;
    } else if (mode === 'create') {
        // Jika tidak dikirim dan mode create, set ke tanggal saat ini
        validatedData.enrolledAt = new Date();
    }

    // Validasi status
    if (status !== undefined) {
        const allowedStatuses = ['active', 'completed', 'dropped'];
        if (!allowedStatuses.includes(status)) {
            return {
                isValid: false,
                error: {
                    status: 400,
                    message: "status harus salah satu dari: active, completed, dropped"
                }
            };
        }
        validatedData.status = status;
    }

    // Untuk mode update, pastikan ada field yang diubah
    if (mode === 'update' && Object.keys(validatedData).length === 0) {
        return {
            isValid: false,
            error: {
                status: 400,
                message: "Minimal satu field harus diisi untuk update"
            }
        };
    }

    return {
        isValid: true,
        data: validatedData
    };
};

module.exports = { validateClassEnrollmentData };
