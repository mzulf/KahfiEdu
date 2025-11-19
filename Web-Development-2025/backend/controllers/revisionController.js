const { Op } = require("sequelize");
const { Revision, RevisionChange, User } = require("../models");
const { getPagination } = require("../utils/paginationUtil");
const { AppError, handleError } = require("../helpers/helperFunction");
const { isAdmin } = require("../helpers/validationRole");

// Utility function to format revision data
const formatRevisionData = (revision) => ({
    id: revision.id,
    model: revision.model,
    documentId: revision.documentId,
    operation: revision.operation,
    revision: revision.revision,
    document: typeof revision.document === 'string' ?
        JSON.parse(revision.document) : revision.document,
    user: revision.user ? {
        id: revision.user.id,
        email: revision.user.email,
        name: revision.user.name
    } : null,
    changes: revision.RevisionChanges ? revision.RevisionChanges.map(change => ({
        path: change.path,
        oldValue: change.diff ? JSON.parse(change.diff)[0]?.value : null,
        newValue: change.diff ? JSON.parse(change.diff)[1]?.value : null
    })) : [],
    createdAt: revision.createdAt,
    updatedAt: revision.updatedAt
});

// Base query configuration
const getBaseQuery = (whereClause) => ({
    where: whereClause,
    include: [
        {
            model: RevisionChange,
            as: 'RevisionChanges',
            required: false,
        },
        {
            model: User,
            as: 'user',
            attributes: ['id', 'email', 'name'],
            required: false,
        }
    ],
    order: [['createdAt', 'DESC']]
});

const getAllRevisions = async (req, res) => {
    try {
        const validation = isAdmin(req.userRole, req.userId);
        if (!validation.isValid) {
            throw new AppError(validation.error.message, validation.error.status);
        }

        const { search = "", model } = req.query;

        // Build where clause
        let whereClause = {};

        if (search) {
            whereClause[Op.or] = [
                { 'document': { [Op.like]: `%${search}%` } },
                { 'model': { [Op.like]: `%${search}%` } }
            ];
        }

        if (model) {
            whereClause.model = model;
        }

        const {
            limit,
            offset,
            statusCondition,
            paranoid,
            meta
        } = getPagination(req.query);

        if (statusCondition) {
            whereClause = { ...whereClause, ...statusCondition };
        }

        const totalCount = await Revision.count({ where: whereClause });
        meta.total = totalCount;
        meta.totalPages = Math.ceil(totalCount / limit);

        const query = {
            ...getBaseQuery(whereClause),
            limit,
            offset,
            paranoid
        };

        const { rows: revisions } = await Revision.findAndCountAll(query);

        if (revisions.length === 0) {
            throw new AppError("Tidak ada data revisi yang ditemukan", 404);
        }

        const formattedRevisions = revisions.map(formatRevisionData);

        return res.status(200).json({
            success: true,
            message: "Data revisi berhasil diambil",
            revisions: formattedRevisions,
            meta
        });

    } catch (error) {
        return handleError(error, res);
    }
};

const getRevisionsByModel = async (req, res) => {
    try {
        const validation = isAdmin(req.userRole, req.userId);
        if (!validation.isValid) {
            throw new AppError(validation.error.message, validation.error.status);
        }

        const { model } = req.params;
        const { documentId, search = "" } = req.query;

        let whereClause = { model };

        if (documentId) {
            whereClause.documentId = documentId;
        }

        if (search) {
            whereClause[Op.or] = [
                { 'document': { [Op.like]: `%${search}%` } }
            ];
        }

        const {
            limit,
            offset,
            statusCondition,
            paranoid,
            meta
        } = getPagination(req.query);

        if (statusCondition) {
            whereClause = { ...whereClause, ...statusCondition };
        }

        const totalCount = await Revision.count({ where: whereClause });
        meta.total = totalCount;
        meta.totalPages = Math.ceil(totalCount / limit);

        const query = {
            ...getBaseQuery(whereClause),
            limit,
            offset,
            paranoid
        };

        const { rows: revisions } = await Revision.findAndCountAll(query);

        if (revisions.length === 0) {
            throw new AppError(`Tidak ada revisi untuk model ${model}`, 404);
        }

        const formattedRevisions = revisions.map(formatRevisionData);

        return res.status(200).json({
            success: true,
            message: `Data revisi untuk model ${model} berhasil diambil`,
            revisions: formattedRevisions,
            meta
        });

    } catch (error) {
        return handleError(error, res);
    }
};

module.exports = {
    getAllRevisions,
    getRevisionsByModel
};