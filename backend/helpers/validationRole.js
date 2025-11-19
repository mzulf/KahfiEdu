/**
 * Validates if user is admin and has valid userId
 * @param {string} userRole - User's role name
 * @param {string} userId - User's ID
 * @returns {Object} { isValid: boolean, error?: { status: number, message: string } }
 */
const isAdmin = (userRole, userId) => {
    const lowerCaseRole = userRole.toLowerCase();

    if (lowerCaseRole !== "admin") {
        return {
            isValid: false,
            error: {
                status: 403,
                message: "Access denied"
            }
        };
    }

    if (!userId) {
        return {
            isValid: false,
            error: {
                status: 400,
                message: "Token User tidak ditemukan"
            }
        };
    }

    return { isValid: true, userId, userRole };
};

const isAdminOrTeacher = (userRole, userId) => {
    const lowerCaseRole = userRole.toLowerCase();

    if (lowerCaseRole !== "admin" && lowerCaseRole !== "teacher") {
        return {
            isValid: false,
            error: {
                status: 403,
                message: "Access denied"
            }
        };
    }

    if (!userId) {
        return {
            isValid: false,
            error: {
                status: 400,
                message: "Token User tidak ditemukan"
            }
        };
    }

    return { isValid: true, userId, userRole };
};

const isParent = (userRole, userId) => {
    const lowerCaseRole = userRole.toLowerCase();

    if (lowerCaseRole !== "parent") {
        return {
            isValid: false,
            error: {
                status: 403,
                message: "Access denied"
            }
        };
    }

    if (!userId) {
        return {
            isValid: false,
            error: {
                status: 400,
                message: "Token User tidak ditemukan"
            }
        };
    }

    return { isValid: true, userId, userRole };
}

const isParentOrAdmin = (userRole, userId) => {
    const lowerCaseRole = userRole.toLowerCase();

    if (lowerCaseRole !== "parent" && lowerCaseRole !== "admin") {
        return {
            isValid: false,
            error: {
                status: 403,
                message: "Access denied"
            }
        };
    }

    if (!userId) {
        return {
            isValid: false,
            error: {
                status: 400,
                message: "Token User tidak ditemukan"
            }
        };
    }

    return { isValid: true, userId, userRole };
}

const isParentOrAdminOrTeacher = (userRole, userId) => {
    const lowerCaseRole = userRole.toLowerCase();

    if (lowerCaseRole !== "parent" && lowerCaseRole !== "admin" && lowerCaseRole !== "teacher") {
        return {
            isValid: false,
            error: {
                status: 403,
                message: "Access denied"
            }
        };
    }

    if (!userId) {
        return {
            isValid: false,
            error: {
                status: 400,
                message: "Token User tidak ditemukan"
            }
        };
    }

    return { isValid: true, userId, userRole };
}

const isStudentOrParent = (userRole, userId) => {
    const lowerCaseRole = userRole.toLowerCase();

    if (lowerCaseRole !== "student" && lowerCaseRole !== "parent") {
        return {
            isValid: false,
            error: {
                status: 403,
                message: "Access denied"
            }
        };
    }

    if (!userId) {
        return {
            isValid: false,
            error: {
                status: 400,
                message: "Token User tidak ditemukan"
            }
        };
    }

    return { isValid: true, userId, userRole };
}


module.exports = {
    isAdmin,
    isAdminOrTeacher,
    isParent,
    isStudentOrParent,
    isParentOrAdmin,
    isParentOrAdminOrTeacher
};