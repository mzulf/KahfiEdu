/**
 * Validates Blog data for create and update operations
 * @param {Object} data Blog data to validate
 * @param {string} data.title Blog's title
 * @param {string} data.description Blog's description
 * @param {string} data.thumbnail Blog's thumbnail
 * @param {boolean} data.isPublish Blog's publish status
 * @param {boolean} data.isFeatured Blog's featured status
 * @param {Array} data.tags Blog's tags
 * @param {string} mode Operation mode ('create' or 'update')
 * @returns {Object} Validation result
 */
const validateBlogData = (data, mode = 'create') => {
    const { title, description, isPublish, isFeatured, tags } = data;
    const validatedData = {};

    if (mode === 'create') {
        // Check required fields for create
        if (!title || !description) {
            return {
                isValid: false,
                error: {
                    status: 400,
                    message: "Title, description file are required"
                }
            };
        }

        // Validate title
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

        // Validate description
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

        // Validate isPublish if provided
        if (isPublish !== undefined) {
            if (typeof isPublish !== 'boolean' && isPublish !== 'true' && isPublish !== 'false') {
                return {
                    isValid: false,
                    error: {
                        status: 400,
                        message: "isPublish must be a boolean value"
                    }
                };
            }
            validatedData.isPublish = isPublish === true || isPublish === 'true';
        }

        // Validate isFeatured if provided
        if (isFeatured !== undefined) {
            if (typeof isFeatured !== 'boolean' && isFeatured !== 'true' && isFeatured !== 'false') {
                return {
                    isValid: false,
                    error: {
                        status: 400,
                        message: "isFeatured must be a boolean value"
                    }
                };
            }
            validatedData.isFeatured = isFeatured === true || isFeatured === 'true';
        }

        // Validate tags if provided
        if (tags !== undefined) {
            let parsedTags;

            // Handle tags whether they come as string or array
            try {
                parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
            } catch (error) {
                return {
                    isValid: false,
                    error: {
                        status: 400,
                        message: "Tags must be a valid JSON array string or an array"
                    }
                };
            }

            // Check if it's an array
            if (!Array.isArray(parsedTags)) {
                return {
                    isValid: false,
                    error: {
                        status: 400,
                        message: "Tags must be an array"
                    }
                };
            }

            // Validate each tag
            const validatedTags = parsedTags.map(tag => {
                // Convert to string and trim
                const processedTag = String(tag).trim().toLowerCase();

                // Check if tag is empty after trimming
                if (processedTag.length === 0) {
                    return null;
                }

                // Check if tag contains only alphanumeric characters, hyphens, and spaces
                if (!/^[a-z0-9\s-]+$/.test(processedTag)) {
                    return null;
                }

                return processedTag;
            }).filter(Boolean); // Remove null values

            // Check if we have any valid tags after processing
            if (validatedTags.length === 0) {
                return {
                    isValid: false,
                    error: {
                        status: 400,
                        message: "At least one valid tag is required. Tags can only contain letters, numbers, spaces, and hyphens"
                    }
                };
            }

            // Remove duplicates and assign
            validatedData.tags = [...new Set(validatedTags)];
        }

    }

    if (mode === 'update') {
        // Allow empty updates but validate any provided fields
        const updates = {};

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
            updates.title = title.trim();
        }

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
            updates.description = description.trim();
        }

        if (isPublish !== undefined) {
            if (typeof isPublish !== 'boolean' && isPublish !== 'true' && isPublish !== 'false') {
                return {
                    isValid: false,
                    error: {
                        status: 400,
                        message: "isPublish must be a boolean value"
                    }
                };
            }
            updates.isPublish = isPublish === true || isPublish === 'true';
        }

        if (isFeatured !== undefined) {
            if (typeof isFeatured !== 'boolean' && isFeatured !== 'true' && isFeatured !== 'false') {
                return {
                    isValid: false,
                    error: {
                        status: 400,
                        message: "isFeatured must be a boolean value"
                    }
                };
            }
            updates.isFeatured = isFeatured === true || isFeatured === 'true';
        }

        if (tags !== undefined) {
            let parsedTags;

            try {
                parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
            } catch (error) {
                return {
                    isValid: false,
                    error: {
                        status: 400,
                        message: "Tags must be a valid JSON array string or an array"
                    }
                };
            }

            if (!Array.isArray(parsedTags)) {
                return {
                    isValid: false,
                    error: {
                        status: 400,
                        message: "Tags must be an array"
                    }
                };
            }

            const validatedTags = parsedTags.map(tag => {
                const processedTag = String(tag).trim().toLowerCase();

                if (processedTag.length === 0) {
                    return null;
                }

                if (!/^[a-z0-9\s-]+$/.test(processedTag)) {
                    return null;
                }

                return processedTag;
            }).filter(Boolean);

            if (validatedTags.length === 0) {
                return {
                    isValid: false,
                    error: {
                        status: 400,
                        message: "At least one valid tag is required. Tags can only contain letters, numbers, spaces, and hyphens"
                    }
                };
            }

            updates.tags = [...new Set(validatedTags)];
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

module.exports = validateBlogData;