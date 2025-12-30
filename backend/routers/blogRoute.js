const express = require('express');
const router = express.Router();
const { createUpload } = require('../config/multerConfig');

const { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog, restoreBlog, getUniqueTags } = require('../controllers/blogController');
const { validateToken } = require('../middlewares/authMiddleware');

const uploadImage = createUpload("uploads/blog/", [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp"
]);

router.get('/blogs', getBlogs)
router.get('/tags/blog', getUniqueTags)
router.get('/blog/:id', getBlogById)
router.post('/blog', validateToken, uploadImage.single('thumbnail'), createBlog)
router.put('/blog/:id', validateToken, uploadImage.single('thumbnail'), updateBlog)
router.delete('/blog/:id', validateToken, deleteBlog)
router.post('/blog/restore/:id', validateToken, restoreBlog)

module.exports = router