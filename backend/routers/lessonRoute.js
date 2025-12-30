const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

const { createLesson, getLessons, updateLesson, getLessonById, deleteLesson, restoreLesson } = require('../controllers/lessonController')

router.post('/lesson', upload.none(), createLesson);
router.get('/lessons', getLessons);
router.get('/lesson/:id', getLessonById);
router.put('/lesson/:id', upload.none(), updateLesson);
router.delete('/lesson/:id', deleteLesson);
router.post('/lesson/restore/:id', restoreLesson);


module.exports = router