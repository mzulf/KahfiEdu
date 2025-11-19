const { createSuccessResponse, AppError, handleError } = require('../helpers/helperFunction');
const { createSearchWhereClauseWithTags } = require('../helpers/searchQueryHelper');
const { isAdmin } = require('../helpers/validationRole');
const { Blog, sequelize } = require('../models');
const getFileUrl = require('../utils/getFileUrl');
const { getPagination } = require('../utils/paginationUtil');
const validateBlogData = require('../utils/validateBlogData');

const createBlog = async (req, res) => {
    const validationResult = await validateBlogData(req.body, 'create');
    if (!validationResult.isValid) {
        const { status, message } = validationResult.error;
        throw new AppError(message, status)
    }

    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status);
    }

    const thumbnailPath = req.file ? getFileUrl(req, `blog/${req.file.filename}`) : null;
    try {

        const blogData = {
            ...validationResult.data,
            thumbnail: thumbnailPath
        };

        const newBlog = await Blog.create(blogData, {
            userId: validation.userId
        });

        const resultBlog = await Blog.findByPk(newBlog.id);

        if (!resultBlog) {
            throw new AppError("Data blog tidak ditemukan", 404)
        }

        return res.status(201).json(createSuccessResponse(
            "Blog berhasil ditambahkan",
            { blog: resultBlog }
        ));

    } catch (error) {
        return handleError(error, res)
    }
};

const getBlogs = async (req, res) => {
    const { search = "", tags = "", isPublish, isFeatured } = req.query;

    try {
        const {
            limit,
            offset,
            statusCondition,
            paranoid,
            meta
        } = getPagination(req.query);

        let whereClause = createSearchWhereClauseWithTags({ search, tags });

        if (typeof isPublish !== 'undefined') {
            const isPublishBoolean = isPublish === 'true' || isPublish === true;
            whereClause.isPublish = isPublishBoolean;
        }

        if (typeof isFeatured !== 'undefined') {
            const isFeaturedBoolean = isFeatured === 'true' || isFeatured === true;
            whereClause.isFeatured = isFeaturedBoolean;
        }

        if (statusCondition) {
            whereClause = { ...whereClause, ...statusCondition };
        }

        const totalCount = await Blog.count({ where: whereClause });

        meta.total = totalCount;
        meta.totalPages = Math.ceil(totalCount / limit);

        const { rows: blogs } = await Blog.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            paranoid,
            distinct: true
        });

        return res.status(200).json({
            success: true,
            message: blogs.length === 0 ? "Data blog tidak ditemukan" : "Berhasil mendapatkan data blog",
            blogs,
            meta,
        });

    } catch (error) {
        return handleError(error, res);
    }
};

const getBlogById = async (req, res) => {
    const { id } = req.params

    try {
        const blog = await Blog.findByPk(id)

        if (!blog) {
            throw new AppError("Data blog tidak ditemukan", 404)
        }

        return res.status(200).json(createSuccessResponse(
            "Berhasil mendapatkan data blog",
            { blog }
        ));

    } catch (error) {
        return handleError(error, res)
    }
}

const updateBlog = async (req, res) => {
    const { id } = req.params;
    const validationResult = validateBlogData(req.body, 'update');

    if (!validationResult.isValid) {
        const { status, message } = validationResult.error;
        throw new AppError(message, status)
    }

    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status);
    }

    try {
        const blog = await Blog.findByPk(id);
        if (!blog) {
            throw new AppError("Data blog tidak di temukan", 404)
        }

        const updateData = { ...validationResult.data };
        if (req.file) {
            updateData.thumbnail = getFileUrl(req, `blog/${req.file.filename}`);
        }

        await blog.update(updateData, {
            userId: validation.userId
        });

        const updatedBlog = await Blog.findByPk(id);

        return res.status(200).json(createSuccessResponse(
            "Blog berhasil diperbarui",
            { blog: updatedBlog }
        ));

    } catch (error) {
        return handleError(error, res)
    }
};

const deleteBlog = async (req, res) => {
    const { id } = req.params;

    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status);
    }

    try {
        const blog = await Blog.findByPk(id, {
            paranoid: false
        });
        if (!blog) {
            throw new AppError("Data blog tidak ditemukan", 404)
        }

        if (blog.deletedAt) {
            await blog.destroy({
                force: true,
                userId: validation.userId
            });

            return res.status(200).json(createSuccessResponse(
                "Blog berhasil dihapus permanen"
            ));
        }

        await blog.destroy({
            userId: validation.userId
        });

        return res.status(200).json(createSuccessResponse(
            "Blog berhasil dihapus"
        ));

    } catch (error) {
        return handleError(error, res)
    }
};

const restoreBlog = async (req, res) => {
    const { id } = req.params;

    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status);
    }

    try {

        const blog = await Blog.findByPk(id, { paranoid: false });

        if (!blog) {
            throw new AppError("Data blog tidak ditemukan", 404)
        }

        if (!blog.deletedAt) {
            throw new AppError("Blog belum dihapus", 400)
        }


        await blog.restore({
            where: { id },
            userId: validation.userId
        });


        return res.status(200).json(createSuccessResponse(
            "Blog berhasil dipulihkan",
            { blog }
        ));

    } catch (error) {
        return handleError(error, res)
    }
};

const getUniqueTags = async (req, res) => {
    try {
        const [tags] = await sequelize.query(`
      SELECT DISTINCT JSON_UNQUOTE(JSON_EXTRACT(tags, CONCAT('$[', numbers.n, ']'))) AS tag
      FROM blogs
      JOIN (
        SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
        UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7
        UNION ALL SELECT 8 UNION ALL SELECT 9
      ) AS numbers
      WHERE JSON_LENGTH(tags) > numbers.n
        AND tags IS NOT NULL
        AND isPublish = true
    `);

        const uniqueTags = tags.map(t => t.tag).filter(Boolean);
        return res.json({ success: true, tags: uniqueTags });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    restoreBlog,
    getUniqueTags
};