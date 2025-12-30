const express = require('express')
const router = express.Router();
const multer = require('multer');
const upload = multer();

const { createAttendance, updateAttendance, getAttendances, getAttendanceById } = require('../controllers/attendanceController')

router.post('/attendance', upload.none(), createAttendance)
router.get('/attendances', getAttendances)
router.get('/attendance/:id', getAttendanceById)
router.put('/attendance/:id', upload.none(), updateAttendance)

module.exports = router