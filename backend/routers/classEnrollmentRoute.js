const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer();

const {
    createClassEnrollment,
    getClassEnrollments,
    getClassEnrollmentById,
    updateClassEnrollment,
    deleteClassEnrollment,
    restoreClassEnrollment
} = require('../controllers/classEnrollmentController')

router.post('/class-enrollment', upload.none(), createClassEnrollment)
router.get('/class-enrollments', getClassEnrollments)
router.get('/class-enrollment/:id', getClassEnrollmentById)
router.put('/class-enrollment/:id', upload.none(), updateClassEnrollment)
router.delete('/class-enrollment/:id', deleteClassEnrollment)
router.post('/class-enrollment/restore/:id', restoreClassEnrollment)


module.exports = router