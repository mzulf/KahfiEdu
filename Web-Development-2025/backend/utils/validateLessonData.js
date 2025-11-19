const { Class } = require('../models')

/**
 * Validates child data for create and update operations
 * @param {Object} data Class data to validate
 * @param {string} data.classId Class's title
 * @param {string} data.title Class's description
 * @param {string} data.content Class's categoryId
 * @param {string} data.videoUrl Class's level
 * @param {number} data.order Class's publish status
 * @param {string} mode Operation mode ('create' or 'update')
 * @returns {Object} Validation result
 */


const validateLessonData = async (data, mode = 'create') => {
    const { classId, title, content, videoUrl, order } = data;
    const validatedData = {};

    if (mode === 'create') {
        if (!title || !classId || !content || !order) {
            return {
                isValid: false,
                error: {
                    status: 400,
                    message: "classId, title, content, and order are required"
                }
            };
        }
    }

    if (title !== undefined) {
        if (typeof title !== 'string' || title.trim().length === 0) {
            return {
                isValid: false,
                error: {
                    status: 400,
                    message: "Title must be a string and cannot be empty"
                }
            };
        }
        validatedData.title = title.trim();
    }

    if (classId !== undefined) {
        if (typeof classId !== 'string' || classId.trim().length === 0) {
            return {
                isValid: false,
                error: {
                    status: 400,
                    message: "ClassId must be a string and cannot be empty"
                }
            };
        }

        // Add await here
        const course = await Class.findOne({
            where: { id: classId.trim() },
            paranoid: false
        });

        if (!course) {
            return {
                isValid: false,
                error: {
                    status: 404,
                    message: "Class not found"
                }
            };
        }
        validatedData.classId = classId.trim();
    }

    if (content !== undefined) {
        if (typeof content !== 'string' || content.trim().length === 0) {
            return {
                isValid: false,
                error: {
                    status: 400,
                    message: "Content must be a string and cannot be empty"
                }
            };
        }
        validatedData.content = content.trim();
    }

    if (order !== undefined) {
        if (typeof order === 'number' && Number.isFinite(order)) {
            return {
                isValid: false,
                error: {
                    status: 400,
                    message: "Order must be a valid number"
                }
            };
        }
        validatedData.order = order.trim();
    }

    if (videoUrl !== undefined) {
        if (typeof videoUrl !== 'string' || videoUrl.trim().length === 0) {
            return {
                isValid: false,
                error: {
                    status: 400,
                    message: "Video URL must be a non-empty string"
                }
            };
        }

        // (Opsional) Validasi format URL secara dasar
        try {
            new URL(videoUrl); // akan throw jika bukan URL valid
        } catch {
            return {
                isValid: false,
                error: {
                    status: 400,
                    message: "Video URL is not a valid URL format"
                }
            };
        }

        validatedData.videoUrl = videoUrl.trim();
    } else if (mode === 'create') {
        validatedData.videoUrl = null;
    }

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

}

module.exports = { validateLessonData }