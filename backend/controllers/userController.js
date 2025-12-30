const { Op } = require("sequelize");
const { User, Role, Payment, Class, Course } = require("../models");
const { validateEmail } = require("../utils/validorUtil");
const getFileUrl = require("../utils/getFileUrl");
const { getPagination } = require("../utils/paginationUtil");
const { AppError, handleError } = require("../helpers/helperFunction");
const { isAdmin, isAdminOrTeacher } = require("../helpers/validationRole");
const { createSearchWhereClause } = require("../helpers/searchQueryHelper");

const getUsers = async (req, res) => {
    try {
        const validation = isAdmin(req.userRole, req.userId);
        if (!validation.isValid) {
            throw new AppError(validation.error.message, validation.error.status);
        }

        const { search = "", roleId } = req.query;
        const { limit, offset, statusCondition, paranoid, meta } = getPagination(req.query);
        const searchFields = ['name', 'email', 'phone'];

        let whereClause = createSearchWhereClause(search, searchFields);

        if (statusCondition) {
            whereClause = { ...whereClause, ...statusCondition };
        }

        if (roleId) {
            whereClause.roleId = roleId;
        }

        const includeRole = {
            model: Role,
            as: "role",
            attributes: ["id", "name"],
            where: { name: { [Op.not]: "admin" } }
        };

        const totalCount = await User.count({
            where: whereClause,
            include: [includeRole],
            paranoid
        });

        meta.total = totalCount;
        meta.totalPages = Math.ceil(totalCount / limit);

        const { rows: users } = await User.findAndCountAll({
            where: whereClause,
            attributes: { exclude: ["password"] },
            order: [["createdAt", "DESC"]],
            limit,
            offset,
            paranoid,
            include: [includeRole]
        });

        // ⬇️ Tambahkan perhitungan jumlah user berdasarkan role
        const roles = await Role.findAll({
            where: { name: { [Op.not]: "admin" } },
            attributes: ['id', 'name']
        });

        const countByRole = await Promise.all(roles.map(async (role) => {
            // Count total (termasuk yang dihapus)
            const total = await User.count({
                where: { roleId: role.id },
                paranoid: false
            });

            // Count aktif (belum dihapus)
            const active = await User.count({
                where: {
                    roleId: role.id,
                    deletedAt: null
                },
                paranoid: false
            });

            // Inactive = total - active
            const inactive = total - active;

            return {
                roleName: role.name,
                total,
                active,
                inactive
            };
        }));

        return res.status(200).json({
            success: true,
            message: users.length === 0 ? "Data users tidak ditemukan" : "Data users berhasil diambil",
            users,
            meta,
            countByRole
        });

    } catch (error) {
        return handleError(error, res);
    }
};

const getUserByRole = async (req, res) => {
    const { roleName } = req.query;
    try {
        const validation = isAdminOrTeacher(req.userRole, req.userId);
        if (!validation.isValid) {
            throw new AppError(validation.error.message, validation.error.status);
        }
        const roleTeacher = await Role.findOne({ where: { name: roleName } });
        if (!roleTeacher) {
            throw new AppError("Role teacher tidak ditemukan", 404);
        }

        const users = await User.findAll({
            where: { roleId: roleTeacher.id },
            attributes: ["id", "name"],
        });
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tidak ada guru yang ditemukan"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Data guru berhasil diambil",
            users
        });
    } catch (error) {
        return handleError(error, res);
    }
}

const getMe = async (req, res) => {
    const userId = req.userId
    try {
        const user = await User.findByPk(userId);

        if (!user) {
            throw AppError("Pengguna tidak di temukan", 404)
        }

        res.status(200).json({
            success: true,
            message: "Data ditemukan",
            user: user,
        })

    } catch (error) {
        return handleError(error, res);
    }
}


const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const validation = isAdminOrTeacher(req.userRole, req.userId);
        if (!validation.isValid) {
            throw new AppError(validation.error.message, validation.error.status);
        }

        const user = await User.findByPk(id, {
            attributes: { exclude: ["password"] },
            include: [
                {
                    model: Role,
                    as: "role",
                    attributes: ["id", "name"]
                },
                {
                    model: Payment,
                    as: "payments",
                    include: [
                        {
                            model: Class,
                            as: 'forClass',
                            include: [
                                {
                                    model: Course,
                                    as: "course"
                                }
                            ]
                        },
                    ]
                },
            ],
            paranoid: false
        });

        if (!user) {
            throw new AppError("User tidak ditemukan", 404);
        }

        return res.status(200).json({
            success: true,
            message: "Detail user berhasil diambil",
            user
        });
    } catch (error) {
        return handleError(error, res);
    }
};

const addUser = async (req, res) => {
    try {
        const {
            name, email, password, alamat,
            province, regency, district, roleId, village, phone, gender
        } = req.body;

        if (!name || !email || !password || !roleId) {
            throw new AppError("Name, email, roleId and password are required", 400);
        }

        const validation = isAdmin(req.userRole, req.userId);
        if (!validation.isValid) {
            throw new AppError(validation.error.message, validation.error.status);
        }

        if (!validateEmail(email)) {
            throw new AppError("Invalid email format", 400);
        }

        if (password.length < 8) {
            throw new AppError("Password must be at least 8 characters long", 400);
        }

        const avatarPath = req.file ? getFileUrl(req, `profil/${req.file.filename}`) : null;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new AppError("User already exists", 409);
        }

        const role = await Role.findOne({ where: { id: roleId } });
        if (!role) {
            throw new AppError("Role not found", 404);
        }

        if (role.name === "admin") {
            throw new AppError("Role tidak dizinkan", 404);
        }

        const newUser = await User.create({
            name, email, password, alamat,
            province, regency, district, village, phone, gender,
            roleId, avatar: avatarPath, emailVerified: new Date()
        }, {
            userId: req.userId
        });

        const { password: _, ...userWithoutPassword } = newUser.toJSON();
        userWithoutPassword.role = role.name;

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: userWithoutPassword,
        });
    } catch (error) {
        return handleError(error, res);
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const {
        name,
        email,
        alamat,
        province,
        regency,
        district,
        roleId,
        village,
        phone,
        gender,
        password
    } = req.body;


    // Check if the user is an admin
    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status);
    }

    try {
        // Find user
        const user = await User.findByPk(id);
        if (!user) {
            throw new AppError("Data puser tidak ditemukan", 404)
        }

        // If email is being changed, check if new email already exists
        if (email && email !== user.email) {
            if (!validateEmail(email)) {
                throw new AppError("Email tidak valid", 400)
            }

            const existingUser = await User.findOne({
                where: {
                    email,
                    id: { [Op.ne]: id }
                }
            });

            if (existingUser) {
                throw new AppError("Email telah terdaftar", 409)
            }
        }

        // If roleId is being changed, check if new role exists
        if (roleId && roleId !== user.roleId) {
            const newRole = await Role.findByPk(roleId);
            if (!newRole) {
                throw new AppError("Role id tidak tersedia")
            }
        }

        // Handle avatar update if file is uploaded
        const avatarPath = req.file ? getFileUrl(req, `profil/${req.file.filename}`) : user.avatar;

        // Build update object
        const updateData = {
            name: name || user.name,
            email: email || user.email,
            alamat: alamat || user.alamat,
            province: province || user.province,
            regency: regency || user.regency,
            district: district || user.district,
            village: village || user.village,
            phone: phone || user.phone,
            gender: gender || user.gender,
            roleId: roleId || user.roleId,
            avatar: avatarPath
        };

        // Only update password if provided
        if (password) {
            if (password.length < 8) {
                throw new AppError("Password minimal 8 karakter", 400)
            }
            updateData.password = password;
        }

        // Update user with context for revision tracking
        await user.update(updateData, {
            userId: req.userId
        });

        // Get updated user data with role
        const updatedUser = await User.findByPk(user.id, {
            attributes: { exclude: ['password'] },
            include: [{
                model: Role,
                as: 'role',
                attributes: ['id', 'name']
            }]
        });

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: updatedUser
        });

    } catch (error) {
        return handleError(error, res)
    }
};

// Fungsi untuk menghapus pengguna berdasarkan ID
// dengan pengecekan apakah pengguna adalah admin
const deleteUser = async (req, res) => {
    const { id } = req.params;

    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status);
    }

    try {
        // Cari termasuk data yang sudah soft deleted
        const user = await User.findByPk(id, { paranoid: false });

        if (!user) {
            throw new AppError("Data user tidak ditemukan", 404)
        }

        const userRole = await Role.findOne({ where: { id: user.roleId } });
        if (!userRole) {
            throw new AppError("Data role tidak ditemukan", 404)
        }

        if (userRole.name === "admin") {
            throw new AppError("Data user tidak ditemukan", 404)
        }

        // Jika sudah soft deleted, maka hapus permanen
        if (user.deletedAt) {
            await user.destroy({ force: true });
            return res.status(200).json({
                success: true,
                message: "User berhasil dihapus permanen"
            });
        } else {
            await user.destroy(); // soft delete
            return res.status(200).json({
                success: true,
                message: "User berhasil dihapus"
            });
        }

    } catch (error) {
        return handleError(error, res)
    }
};

const restoreUser = async (req, res) => {
    const { id } = req.params;

    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status);
    }

    try {
        const user = await User.findByPk(id, { paranoid: false });

        if (!user) {
            throw new AppError("Data user tidak ditemukan", 404)
        }

        // Restore the user
        await user.restore({
            userId: req.userId // <-- tambahkan di sini
        });

        const safeUser = {
            ...user.toJSON(),
            password: undefined // Exclude password from response
        };

        res.status(200).json({
            success: true,
            message: "User berhasil dipulihkan",
            safeUser
        });
    } catch (error) {
        return handleError(error, res)
    }
};


module.exports = {
    getUsers,
    getUserById,
    addUser,
    deleteUser,
    updateUser,
    restoreUser,
    getUserByRole,
    getMe
};
