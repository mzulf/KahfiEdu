const { Op } = require("sequelize");

/**
 * Utility untuk menghitung offset, limit, page, dan handle status filtering.
 * @param {Object} query - req.query dari request.
 * @param {number} totalCount - Total data dari query.
 * @returns {{
 *   limit: number,
 *   offset: number,
 *   page: number,
 *   status: string,
 *   paranoid: boolean,
 *   statusCondition: object | null,
 *   meta: {
 *     total: number,
 *     page: number,
 *     limit: number,
 *     totalPages: number
 *   }
 * }}
 */
function getPagination(query, totalCount = 0) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;
    const totalPages = Math.ceil(totalCount / limit);

    const status = query.status || "active"; // default

    let paranoid = true;
    let statusCondition = null;

    if (status === "deleted") {
        paranoid = false;
        statusCondition = { deletedAt: { [Op.not]: null } };
    } else if (status === "all") {
        paranoid = false;
        statusCondition = null; // don't filter by deletedAt
    }

    return {
        limit,
        offset,
        page,
        status,
        paranoid,
        statusCondition,
        meta: {
            total: totalCount,
            page,
            limit,
            totalPages
        }
    };
}

module.exports = { getPagination };
