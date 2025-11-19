const express = require('express');
const router = express.Router();
const { createUpload } = require('../config/multerConfig');

const { createCourse, updateCourse, getCourses, getCourseById, deleteCourse, restoreCourse, getAllCourses } = require('../controllers/courseController');
const { validateToken } = require('../middlewares/authMiddleware');

const uploadImage = createUpload("uploads/course/", [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp"
]);

router.get('/courses', getCourses);
router.get('/all/course', getAllCourses);
router.get('/course/:id', getCourseById);
router.post('/course', validateToken, uploadImage.single('thumbnail'), createCourse);
router.put('/course/:id', validateToken, uploadImage.single('thumbnail'), updateCourse);
router.delete('/course/:id', validateToken, deleteCourse);
router.post('/course/restore/:id', validateToken, restoreCourse);

module.exports = router;
