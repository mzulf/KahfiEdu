const { Class } = require('../models');

/**
 * Validates Assignment data for create and update operations
 * @param {Object} data Assignment data to validate
 * @param {string} data.classId Assignment's class ID
 * @param {string} data.title Assignment's title
 * @param {string} data.description Assignment's description
 * @param {Date} data.dueDate Assignment's due date
 * @param {string} mode Operation mode ('create' or 'update')
 * @returns {Object} Validation result
 */
const validateAssignmentData = async (data, mode = 'create') => {
    const { classId, title, description, dueDate } = data;
    const validatedData = {};

    if (mode === 'create') {
        // Check required fields for create
        if (!classId || !title || !description || !dueDate) {
            return {
                isValid: false,
                error: {
                    status: 400,
                    message: "ClassId, title, description, and dueDate are required"
                }
            };
        }
    }

    // Validate classId if provided
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

        // Verify class exists
        const classExists = await Class.findOne({ where: { id: classId } });
        if (!classExists) {
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

    // Validate title if provided
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

    // Validate description if provided
    if (description !== undefined) {
        if (typeof description !== 'string' || description.trim().length === 0) {
            return {
                isValid: false,
                error: {
                    status: 400,
                    message: "Description must be a string and cannot be empty"
                }
            };
        }
        validatedData.description = description.trim();
    }

    // Validate dueDate if provided
    if (dueDate !== undefined) {
        const parsedDate = new Date(dueDate);
        if (isNaN(parsedDate.getTime())) {
            return {
                isValid: false,
                error: {
                    status: 400,
                    message: "DueDate must be a valid date"
                }
            };
        }

        // Check if due date is in the future
        if (parsedDate < new Date()) {
            return {
                isValid: false,
                error: {
                    status: 400,
                    message: "DueDate must be in the future"
                }
            };
        }

        validatedData.dueDate = parsedDate;
    }

    // For update mode, ensure at least one field is provided
    if (mode === 'update' && Object.keys(validatedData).length === 0) {
        return {
            isValid: false,
            error: {
                status: 400,
                message: "At least one field must be provided for update"
            }
        };
    }

    return {
        isValid: true,
        data: validatedData
    };
};

module.exports = validateAssignmentData;