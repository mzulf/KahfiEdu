const { Op, literal } = require("sequelize");

/**
 * Creates a search where clause for database queries
 * @param {string} search - Search term
 * @param {string[]} fields - Array of field names to search in
 * @param {Object} additionalFilters - Additional filters to apply
 * @returns {Object} Sequelize where clause object
 */
const createSearchWhereClause = (search = "", fields = [], additionalFilters = {}) => {
    if (!search) return { ...additionalFilters };

    const orConditions = fields.map(field => {
        if (field === "tags") {
            // JSON_CONTAINS di MySQL untuk array
            return literal(`JSON_CONTAINS(tags, '["${search}"]')`);
        }

        return {
            [field]: {
                [Op.like]: `%${search}%`
            }
        };
    });

    return {
        [Op.or]: orConditions,
        ...additionalFilters
    };
};

const createSearchWhereClauseWithTags = ({ search = "", tags = "" }, additionalFilters = {}) => {
    const where = [];

    if (search) {
        where.push({
            title: {
                [Op.like]: `%${search}%`
            }
        });
    }

    if (tags) {
        const tagList = tags.split(",").map(tag => tag.trim()).filter(Boolean);
        tagList.forEach(tag => {
            where.push(literal(`JSON_CONTAINS(tags, '["${tag}"]')`));
        });
    }

    return {
        ...(where.length > 0 ? { [Op.and]: where } : {}),
        ...additionalFilters
    };
};

module.exports = {
    createSearchWhereClause,
    createSearchWhereClauseWithTags
};