// utils/validators.js
/**
 * Validate email format
 * @param {String} email - Email to validate
 * @returns {Boolean} - True if valid
 */
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate and resolve role
 * @param {String} roleName - Role name from import
 * @param {Object} rolesMap - Map of available roles
 * @returns {Object} - Result of validation with roleId
 */
function validateRole(roleName, rolesMap) {
    const validRoles = ['parent', 'student', 'teacher'];

    if (roleName) {
        const normalizedRole = roleName.toLowerCase();

        // Cek apakah role termasuk yang valid
        if (!validRoles.includes(normalizedRole)) {
            return {
                success: false,
                message: `Invalid role: '${roleName}'. Valid roles are: ${validRoles.join(', ')}`
            };
        }

        const roleId = rolesMap[normalizedRole];
        if (!roleId) {
            return {
                success: false,
                message: `Role '${roleName}' is valid but not found in role mapping`
            };
        }

        return {
            success: true,
            roleId
        };
    } else {
        // Jika role tidak disediakan, gunakan student sebagai default
        const defaultRoleId = rolesMap['student'];
        if (!defaultRoleId) {
            return {
                success: false,
                message: "No role provided and default role 'student' not found"
            };
        }

        return {
            success: true,
            roleId: defaultRoleId,
            message: "No role provided, using default role 'student'"
        };
    }
}

module.exports = {
    validateEmail,
    validateRole
};