const { Class } = require('../models');

/**
 * Validates payment data for create and update operations
 * @param {Object} data Payment data to validate
 * @param {string} data.classId Class being paid for
 * @param {string} data.amount Payment amount
 * @param {string} data.method_name Method used (e.g., bank transfer)
 * @param {string} data.bank_name Bank name
 * @param {string} data.no_rekening Bank account number
 * @param {string} data.atas_nama Account holder name
 * @param {string} [data.status] Payment status (pending/completed/failed)
 * @param {string} [data.confirmation_by] Admin user confirming payment
 * @param {string} mode Operation mode ('create' or 'update')
 * @returns {Object} Validation result
 */
const validatePaymentData = async (data, mode = 'create') => {
    const {
        classId,
        amount,
        method_name,
        bank_name,
        no_rekening,
        atas_nama,
        status,
        payment_date,
        confirmation_date,
    } = data;

    const validatedData = {};

    if (mode === 'create') {
        // Required fields
        const requiredFields = {
            classId, amount, method_name, bank_name, no_rekening, atas_nama
        };

        for (const [field, value] of Object.entries(requiredFields)) {
            if (!value || typeof value !== 'string' || value.trim().length === 0) {
                return {
                    isValid: false,
                    error: {
                        status: 400,
                        message: `${field} is required and must be a non-empty string`
                    }
                };
            }
            validatedData[field] = value.trim();
        }

        // Check related models

        const kelas = await Class.findByPk(classId);
        if (!kelas) {
            return {
                isValid: false,
                error: {
                    status: 404,
                    message: "Class not found"
                }
            };
        }

        // Validate amount
        const amountValue = parseFloat(amount);
        if (isNaN(amountValue) || amountValue <= 0) {
            return {
                isValid: false,
                error: {
                    status: 400,
                    message: "Amount must be a valid positive number"
                }
            };
        }
        validatedData.amount = amountValue;

        // Optional fields
        if (status !== undefined) {
            if (!['pending', 'completed', 'failed'].includes(status)) {
                return {
                    isValid: false,
                    error: {
                        status: 400,
                        message: "Invalid status value"
                    }
                };
            }
            validatedData.status = status;
        }

        if (payment_date !== undefined) {
            const date = new Date(payment_date);
            if (isNaN(date)) {
                return {
                    isValid: false,
                    error: {
                        status: 400,
                        message: "Invalid payment_date"
                    }
                };
            }
            validatedData.payment_date = date;
        }

        if (confirmation_date !== undefined) {
            const date = new Date(confirmation_date);
            if (isNaN(date)) {
                return {
                    isValid: false,
                    error: {
                        status: 400,
                        message: "Invalid confirmation_date"
                    }
                };
            }
            validatedData.confirmation_date = date;
        }

        return {
            isValid: true,
            data: validatedData
        };
    }

    if (mode === 'update') {
        const updates = {};

        const stringFields = {
            method_name, bank_name, no_rekening, atas_nama, payment_proof
        };

        for (const [field, value] of Object.entries(stringFields)) {
            if (value !== undefined) {
                if (typeof value !== 'string' || value.trim().length === 0) {
                    return {
                        isValid: false,
                        error: {
                            status: 400,
                            message: `${field} must be a non-empty string`
                        }
                    };
                }
                updates[field] = value.trim();
            }
        }

        if (amount !== undefined) {
            const amountValue = parseFloat(amount);
            if (isNaN(amountValue) || amountValue <= 0) {
                return {
                    isValid: false,
                    error: {
                        status: 400,
                        message: "Amount must be a valid positive number"
                    }
                };
            }
            updates.amount = amountValue;
        }

        if (status !== undefined) {
            if (!['pending', 'completed', 'failed'].includes(status)) {
                return {
                    isValid: false,
                    error: {
                        status: 400,
                        message: "Invalid status value"
                    }
                };
            }
            updates.status = status;
        }

        if (payment_date !== undefined) {
            const date = new Date(payment_date);
            if (isNaN(date)) {
                return {
                    isValid: false,
                    error: {
                        status: 400,
                        message: "Invalid payment_date"
                    }
                };
            }
            updates.payment_date = date;
        }

        if (confirmation_date !== undefined) {
            const date = new Date(confirmation_date);
            if (isNaN(date)) {
                return {
                    isValid: false,
                    error: {
                        status: 400,
                        message: "Invalid confirmation_date"
                    }
                };
            }
            updates.confirmation_date = date;
        }

        return {
            isValid: true,
            data: updates
        };
    }

    return {
        isValid: false,
        error: {
            status: 500,
            message: "Invalid operation mode"
        }
    };
};

module.exports = validatePaymentData;
