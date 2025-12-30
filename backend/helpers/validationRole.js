/**
 * Helper untuk validasi role & userId
 */
const baseValidation = (userRole, userId, allowedRoles = []) => {
    if (!userRole) {
        return {
            isValid: false,
            error: {
                status: 403,
                message: "Role tidak ditemukan"
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

    const role = userRole.toLowerCase();

    if (!allowedRoles.includes(role)) {
        return {
            isValid: false,
            error: {
                status: 403,
                message: "Access denied"
            }
        };
    }

    return { isValid: true, userRole: role, userId };
};

/**
 * ADMIN ONLY
 */
const isAdmin = (userRole, userId) => {
    return baseValidation(userRole, userId, ["admin"]);
};

/**
 * ADMIN OR TEACHER
 */
const isAdminOrTeacher = (userRole, userId) => {
    return baseValidation(userRole, userId, ["admin", "teacher"]);
};

/**
 * PARENT ONLY
 */
const isParent = (userRole, userId) => {
    return baseValidation(userRole, userId, ["parent"]);
};

/**
 * PARENT OR ADMIN
 */
const isParentOrAdmin = (userRole, userId) => {
    return baseValidation(userRole, userId, ["parent", "admin"]);
};

/**
 * PARENT OR ADMIN OR TEACHER
 */
const isParentOrAdminOrTeacher = (userRole, userId) => {
    return baseValidation(userRole, userId, ["parent", "admin", "teacher"]);
};

/**
 * STUDENT OR PARENT
 */
const isStudentOrParent = (userRole, userId) => {
    return baseValidation(userRole, userId, ["student", "parent"]);
};

module.exports = {
    isAdmin,
    isAdminOrTeacher,
    isParent,
    isStudentOrParent,
    isParentOrAdmin,
    isParentOrAdminOrTeacher
};
