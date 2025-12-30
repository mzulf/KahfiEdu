/**
 * Validates child data for create and update operations
 * @param {Object} data Child data to validate
 * @param {string} data.name Child's name
 * @param {number} data.age Child's age
 * @param {string} data.date_of_birth Child's date of birth
 * @param {string} data.gender Child's gender
 * @param {string} data.relationship Child's relationship
 * @param {string} mode Operation mode ('create' or 'update')
 * @returns {Object} Validation result
 */
const validateChildData = (data, mode = 'create') => {
    const { name, age, date_of_birth, gender, relationship } = data;
    const validatedData = {};

    // Validate based on mode
    if (mode === 'create') {
        // Check required fields for create
        if (!name || !age || !date_of_birth || !gender || !relationship) {
            return {
                isValid: false,
                error: {
                    status: 400,
                    message: "Name, age, date_of_birth, gender, and relationship are required"
                }
            };
        }
    }

    // Validate name if provided
    if (name !== undefined) {
        if (typeof name !== 'string' || name.trim().length === 0) {
            return {
                isValid: false,
                error: {
                    status: 400,
                    message: "Nama harus berupa text dan tidak boleh kosong"
                }
            };
        }
        validatedData.name = name.trim();
    }

    // Validate age if provided
    if (age !== undefined) {
        const parsedAge = parseInt(age);
        if (isNaN(parsedAge) || parsedAge < 1) {
            return {
                isValid: false,
                error: {
                    status: 400,
                    message: "Umur harus berupa angka dan tidak boleh kurang dari 1"
                }
            };
        }
        validatedData.age = parsedAge;
    }

    // Validate date_of_birth if provided
    if (date_of_birth !== undefined) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date_of_birth) || isNaN(Date.parse(date_of_birth))) {
            return {
                isValid: false,
                error: {
                    status: 400,
                    message: "Format tanggal lahir harus YYYY-MM-DD"
                }
            };
        }
        validatedData.date_of_birth = date_of_birth;
    }

    // Validate gender if provided
    if (gender !== undefined) {
        const genderLowerCase = gender.toLowerCase();
        if (genderLowerCase !== "laki-laki" && genderLowerCase !== "perempuan") {
            return {
                isValid: false,
                error: {
                    status: 400,
                    message: "Gender harus laki-laki atau perempuan"
                }
            };
        }
        validatedData.gender = genderLowerCase;
    }

    // Validate relationship if provided
    if (relationship !== undefined) {
        const relationshipLowerCase = relationship.toLowerCase();
        if (relationshipLowerCase !== "anak" &&
            relationshipLowerCase !== "keponakan" &&
            relationshipLowerCase !== "cucu") {
            return {
                isValid: false,
                error: {
                    status: 400,
                    message: "Relationship harus anak, keponakan, atau cucu"
                }
            };
        }
        validatedData.relationship = relationshipLowerCase;
    }

    // For update mode, check if at least one field is being updated
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

module.exports = { validateChildData };