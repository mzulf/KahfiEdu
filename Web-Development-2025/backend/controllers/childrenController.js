const { createSearchWhereClause } = require("../helpers/searchQueryHelper");
const { Child, User } = require("../models");
const { Op } = require('sequelize');
const { validateChildData } = require("../utils/validateChildData");
const { AppError, handleError } = require("../helpers/helperFunction");
const { isParentOrAdmin, isParentOrAdminOrTeacher, isParent } = require('../helpers/validationRole');

const createChild = async (req, res) => {
    try {
        // Validate data
        const validation = validateChildData(req.body, 'create');
        if (!validation.isValid) {
            throw new AppError(validation.error.message, validation.error.status);
        }

        // Validate parent role
        const parentValidation = isParent(req.userRole, req.userId);
        if (!parentValidation.isValid) {
            throw new AppError(parentValidation.error.message, parentValidation.error.status);
        }

        // Create child
        const newChild = await Child.create({
            ...validation.data,
            parentId: parentValidation.userId
        }, {
            userId: parentValidation.userId
        });

        return res.status(201).json({
            success: true,
            message: "Berhasil menambahkan data anak",
            children: newChild
        });

    } catch (error) {
        return handleError(error, res);
    }
};

const getChildrens = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "", isActive, parentId } = req.query;
        const { name, age, relationship, gender } = req.query;

        // Validate parent/admin role
        const roleValidation = isParentOrAdmin(req.userRole, req.userId);
        if (!roleValidation.isValid) {
            throw new AppError(roleValidation.error.message, roleValidation.error.status);
        }

        const offset = (parseInt(page) - 1) * parseInt(limit);
        const searchFields = ['name', 'relationship', 'gender'];

        // Build where clause
        let whereClause = createSearchWhereClause(search, searchFields);

        // Add filters
        if (name) whereClause.name = { [Op.like]: `%${name}%` };
        if (age) whereClause.age = age;
        if (relationship) whereClause.relationship = relationship;
        if (gender) whereClause.gender = gender;
        if (isActive !== undefined) whereClause.isActive = isActive === 'true';

        // Role-based filtering
        if (req.userRole === "parent") {
            whereClause.parentId = roleValidation.userId;
        } else if (req.userRole === "admin" && parentId) {
            whereClause.parentId = parentId;
        }

        const { count, rows: childrens } = await Child.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset,
            order: [['createdAt', 'DESC']],
            include: [{
                model: User,
                as: 'parent',
                attributes: ['id', 'name', 'email', 'phone'],
            }],
            distinct: true
        });

        const meta = {
            page: parseInt(page),
            limit: parseInt(limit),
            totalItems: count,
            totalPages: Math.ceil(count / parseInt(limit))
        };

        if (childrens.length === 0) {
            return res.status(200).json({
                success: true,
                message: "Tidak ada data anak yang ditemukan",
                childrens: [],
                meta
            });
        }

        return res.status(200).json({
            success: true,
            message: "Berhasil mendapatkan data anak",
            childrens,
            meta
        });

    } catch (error) {
        return handleError(error, res);
    }
};

const getChildById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate parent/admin role
        const roleValidation = isParentOrAdminOrTeacher(req.userRole, req.userId);
        if (!roleValidation.isValid) {
            throw new AppError(roleValidation.error.message, roleValidation.error.status);
        }

        const children = await Child.findOne({
            where: { id },
            include: [{
                model: User,
                as: 'parent',
                attributes: ['id', 'name', 'email', 'phone'],
            }]
        });

        if (!children) {
            throw new AppError("Data anak tidak ditemukan", 404);
        }

        if (req.userRole === 'parent') {
            if (children.parentId !== roleValidation.userId) {
                throw new AppError("Anda tidak dapat mendapatkan data ini", 400);
            }
        }

        return res.status(200).json({
            success: true,
            message: "Berhasil mendapatkan data anak",
            children
        });

    } catch (error) {
        return handleError(error, res);
    }
};

const updateChild = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate data
        const validation = validateChildData(req.body, 'update');
        if (!validation.isValid) {
            throw new AppError(validation.error.message, validation.error.status);
        }

        // Validate parent/admin role
        const roleValidation = isParentOrAdmin(req.userRole, req.userId);
        if (!roleValidation.isValid) {
            throw new AppError(roleValidation.error.message, roleValidation.error.status);
        }

        const child = await Child.findByPk(id);
        if (!child) {
            throw new AppError("Data anak tidak ditemukan", 404);
        }

        if (req.userRole === 'parent') {
            if (child.parentId !== roleValidation.userId) {
                throw new AppError("Anda tidak dapat mengubah data ini", 400);
            }
        }

        await child.update(validation.data, {
            userId: roleValidation.userId
        });

        return res.status(200).json({
            success: true,
            message: "Berhasil memperbarui data anak",
            child
        });

    } catch (error) {
        return handleError(error, res);
    }
};

const deleteChild = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate parent/admin role
        const roleValidation = isParentOrAdmin(req.userRole, req.userId);
        if (!roleValidation.isValid) {
            throw new AppError(roleValidation.error.message, roleValidation.error.status);
        }

        const children = await Child.findByPk(id, {
            paranoid: false
        });

        if (!children) {
            throw new AppError("Data anak tidak ditemukan", 404);
        }

        if (children.deletedAt) {
            await children.destroy({
                force: true,
                userId: roleValidation.userId
            });
            return res.status(200).json({
                success: true,
                message: "Data anak dihapus permanen"
            });
        }

        await children.destroy({
            userId: roleValidation.userId
        });

        return res.status(200).json({
            success: true,
            message: "Berhasil menghapus data anak"
        });

    } catch (error) {
        return handleError(error, res);
    }
};

const restoreChild = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate parent/admin role
        const roleValidation = isParentOrAdmin(req.userRole, req.userId);
        if (!roleValidation.isValid) {
            throw new AppError(roleValidation.error.message, roleValidation.error.status);
        }

        const child = await Child.findByPk(id, {
            paranoid: false
        });

        if (!child) {
            throw new AppError("Data anak tidak ditemukan", 404);
        }

        await child.restore({
            userId: roleValidation.userId
        });

        return res.status(200).json({
            success: true,
            message: "Berhasil memulihkan data anak",
            child
        });

    } catch (error) {
        return handleError(error, res);
    }
};

module.exports = {
    createChild,
    getChildrens,
    getChildById,
    updateChild,
    deleteChild,
    restoreChild
};