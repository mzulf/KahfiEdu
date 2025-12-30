const { Op } = require('sequelize');
const { isAdmin } = require('../helpers/validationRole');
const { Category } = require('../models');
const { createSearchWhereClause } = require('../helpers/searchQueryHelper');
const { AppError, handleError } = require('../helpers/helperFunction');

const createCategory = async (req, res) => {
    const { name, isActive } = req.body;

    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status);
    }

    if (!name) {
        throw new AppError("Name diperlukan")
    }

    // Convert isActive to boolean
    const isActiveBoolean = isActive === true || isActive === 'true';

    const lowerCaseName = name.toLowerCase();

    try {
        const existingCategory = await Category.findOne({
            where: { name: lowerCaseName },
            paranoid: false
        });

        if (existingCategory) {
            throw new AppError("Name category telah tersedia")
        }

        const newCategory = await Category.create({
            name: lowerCaseName,
            isActive: isActiveBoolean
        }, {
            userId: req.userId
        });

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            category: newCategory
        });

    } catch (error) {
        return handleError(error, res)
    }
}

const getCategories = async (req, res) => {
    const { search = "", isActive } = req.query;

    const searchFields = ['name'];
    const additionalFilters = {};

    if (isActive !== undefined) {
        additionalFilters.isActive = isActive === "true";
    }

    const whereClause = createSearchWhereClause(search, searchFields, additionalFilters);

    try {
        const categories = await Category.findAll({
            where: whereClause,
            order: [["createdAt", "DESC"]],
            paranoid: false
        });


        return res.status(200).json({
            success: true,
            message: "Data categories berhasil diambil",
            categories
        });

    } catch (error) {
        return handleError(error, res);
    }
};


const updateCategory = async (req, res) => {
    const { name, isActive } = req.body;
    const { id } = req.params;

    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status);
    }

    try {
        const existingCategory = await Category.findOne({
            where: { id },
            paranoid: false
        });

        if (!existingCategory) {
            throw new AppError("Data Category tidak ditemukan", 404)
        }

        // Prepare update data
        const updateData = {};

        // Handle name update if provided
        if (name !== undefined) {
            const lowerCaseName = name.toLowerCase();
            // Check if name already exists
            const nameExists = await Category.findOne({
                where: {
                    name: lowerCaseName,
                    id: { [Op.ne]: id }
                },
                paranoid: false
            });

            if (nameExists) {
                throw new AppError("Category berhasil diperbaharui", 400)
            }
            updateData.name = lowerCaseName;
        }

        // Handle isActive update if provided
        if (isActive !== undefined) {
            const isActiveBoolean = isActive === true || isActive === 'true';
            updateData.isActive = isActiveBoolean;
        }

        // Update only if there are changes
        if (Object.keys(updateData).length === 0) {
            throw new AppError("Tidak ada data yang dikirim", 400)
        }

        await existingCategory.update(updateData, {
            userId: validation.userId
        });

        const updatedCategory = await Category.findByPk(id);

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category: updatedCategory
        });

    } catch (error) {
        return handleError(error, res)
    }
}

const deleteCategory = async (req, res) => {
    const { id } = req.params;

    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status);
    }

    try {
        const category = await Category.findOne({
            where: { id },
            paranoid: false
        });

        if (!category) {
            throw new AppError("Data category tidak ditemukan")
        }

        if (category.isActive) {
            throw new AppError("Categoy masih aktif tidak dapat dihapus", 400)
        }

        if (category.deletedAt) {
            await category.destroy({
                force: true,
                userId: validation.userId
            });
            return res.status(200).json({
                success: true,
                message: "Category berhasil dihapus permanen"
            });
        }

        await category.destroy({
            userId: validation.userId
        });

        return res.status(200).json({
            success: true,
            message: "Category berhasil dihapus"
        });

    } catch (error) {
        return handleError(error, res)
    }
}

const restoreCategory = async (req, res) => {
    const { id } = req.params;

    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status);
    }

    try {
        const category = await Category.findOne({
            where: { id },
            paranoid: false
        });

        if (!category) {
            throw new AppError("Data category tidak ditemukan", 404)
        }

        if (!category.deletedAt) {
            throw new AppError("Category belum dihapus atau masih aktif", 400)
        }

        await category.restore({
            userId: validation.userId
        });

        return res.status(200).json({
            success: true,
            message: "Category restored successfully",
            category
        });

    } catch (error) {
        return handleError(error, res)
    }
}

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
    restoreCategory,
};