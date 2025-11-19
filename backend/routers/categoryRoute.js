const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

const { createCategory, getCategories, deleteCategory, restoreCategory, updateCategory } = require('../controllers/categoryController');

router.post('/category', upload.none(), createCategory);
router.get('/categories', getCategories);
router.put('/category/:id', upload.none(), updateCategory);
router.delete('/category/:id', deleteCategory);
router.post('/category/restore/:id', restoreCategory);

module.exports = router;