const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer();

const { createClass, getClasses, getClassById, updateClass, deleteClass, restoreClass } = require('../controllers/classController');

router.get('/classes', getClasses)
router.get('/class/:id', getClassById)
router.post('/class', upload.none(), createClass)
router.put('/class/:id', upload.none(), updateClass)
router.delete('/class/:id', upload.none(), deleteClass)
router.post('/class/restore/:id', upload.none(), restoreClass)

module.exports = router