const { getPagination } = require("../utils/paginationUtil");
const { Role } = require("../models");
const { Op } = require("sequelize");
const { isAdmin } = require("../helpers/validationRole");
const { AppError, handleError } = require("../helpers/helperFunction");
const PROTECTED_ROLES = ['admin', 'teacher', 'parent', 'student'];


const getRoles = async (req, res) => {
    try {
        const search = req.query.search || "";

        const validation = isAdmin(req.userRole, req.userId);
        if (!validation.isValid) {
            throw new AppError(validation.error.message, validation.error.status);
        }

        const {
            limit,
            offset,
            statusCondition,
            paranoid,
            meta
        } = getPagination(req.query);

        const whereClause = {
            name: {
                [Op.like]: `%${search}%`,
                [Op.not]: 'admin', // ⛔ mengecualikan role dengan nama 'admin'
            },
            ...(statusCondition || {})
        };


        const totalCount = await Role.count({
            where: whereClause,
            paranoid
        });

        meta.total = totalCount;
        meta.totalPages = Math.ceil(totalCount / limit);

        const { rows: roles } = await Role.findAndCountAll({
            where: whereClause,
            order: [["createdAt", "DESC"]],
            limit,
            offset,
            paranoid,
        });

        if (roles.length === 0) {
            throw new AppError("Data roles tidak ditemukan", 404);
        }

        return res.status(200).json({
            success: true,
            message: "Data roles berhasil diambil",
            roles,
            meta
        });
    } catch (error) {
        return handleError(error, res);
    }
};

const createRole = async (req, res) => {
    try {
        const { name } = req.body;

        const validation = isAdmin(req.userRole, req.userId);
        if (!validation.isValid) {
            throw new AppError(validation.error.message, validation.error.status);
        }

        if (!name) {
            throw new AppError("Nama role wajib diisi", 400);
        }

        if (PROTECTED_ROLES.includes(name.toLowerCase())) {
            throw new AppError(`Nama role '${name}' tidak diperbolehkan`, 400);
        }

        if (name.length < 3) {
            throw new AppError("Nama role minimal 3 karakter", 400);
        }

        const lowerCaseName = name.toLowerCase();

        const existingRole = await Role.findOne({
            where: { name: lowerCaseName },
            paranoid: false,
        });

        if (existingRole) {
            throw new AppError("Nama role sudah digunakan", 400);
        }

        const newRole = await Role.create({
            name: lowerCaseName,
            revision: 0,
        }, {
            userId: validation.userId
        });

        return res.status(201).json({
            success: true,
            message: "Role berhasil ditambahkan",
            role: newRole
        });
    } catch (error) {
        return handleError(error, res);
    }
};

const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const validation = isAdmin(req.userRole, req.userId);
        if (!validation.isValid) {
            throw new AppError(validation.error.message, validation.error.status);
        }

        if (!id || !name) {
            throw new AppError("ID dan nama role wajib diisi", 400);
        }

        const lowerCaseName = name.toLowerCase();
        const role = await Role.findByPk(id);

        if (!role) {
            throw new AppError("Role tidak ditemukan", 404);
        }

        if (PROTECTED_ROLES.includes(role.name)) {
            throw new AppError(`Role ${role.name} tidak dapat diubah`, 400);
        }

        const isUsed = await role.countUsers();
        if (isUsed > 0) {
            throw new AppError("Role sedang digunakan", 400);
        }

        const existing = await Role.findOne({
            where: {
                name: lowerCaseName,
                id: { [Op.ne]: id }
            },
            paranoid: false,
        });

        if (existing) {
            throw new AppError("Nama role sudah digunakan oleh role lain", 400);
        }

        role.name = lowerCaseName;
        await role.save({
            userId: validation.userId
        });

        return res.status(200).json({
            success: true,
            message: "Role berhasil diperbarui",
            role
        });
    } catch (error) {
        return handleError(error, res);
    }
};

const deleteRole = async (req, res) => {

    try {
        const { id } = req.params;

        const validation = isAdmin(req.userRole, req.userId);
        if (!validation.isValid) {
            throw new AppError(validation.error.message, validation.error.status);
        }

        const role = await Role.findByPk(id, {
            paranoid: false
        });

        if (!role) {
            throw new AppError("Role tidak ditemukan", 404);
        }


        if (PROTECTED_ROLES.includes(role.name)) {
            throw new AppError(`Role ${role.name} tidak dapat dihapus`, 400);
        }

        const isUsed = await role.countUsers();
        if (isUsed > 0) {
            throw new AppError("Role ini sedang digunakan oleh user lain", 400);
        }

        if (role.deletedAt) {
            await role.destroy({
                force: true,
                userId: validation.userId
            });
            return res.status(200).json({
                success: true,
                message: "Role berhasil dihapus permanen"
            });
        }

        await role.destroy({
            userId: validation.userId
        });

        return res.status(200).json({
            success: true,
            message: "Role berhasil dihapus"
        });
    } catch (error) {
        return handleError(error, res);
    }
};

const restoreRole = async (req, res) => {
    try {
        const { id } = req.params;

        const validation = isAdmin(req.userRole, req.userId);
        if (!validation.isValid) {
            throw new AppError(validation.error.message, validation.error.status);
        }

        if (!id) {
            throw new AppError("ID role wajib diisi", 400);
        }

        const role = await Role.findByPk(id, {
            paranoid: false
        });

        if (!role) {
            throw new AppError("Role tidak ditemukan", 404);
        }

        await role.restore({
            userId: validation.userId
        });

        return res.status(200).json({
            success: true,
            message: "Role berhasil dipulihkan",
            role
        });
    } catch (error) {
        return handleError(error, res);
    }
};

module.exports = {
    getRoles,
    createRole,
    updateRole,
    deleteRole,
    restoreRole
};