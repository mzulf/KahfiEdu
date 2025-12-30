const express = require('express')
const router = express.Router();
const multer = require('multer');
const upload = multer();

const { createAssignment, getAssignments, getAssignmentById, updateAssignment, deleteAssignment, restoreAssignment } = require('../controllers/assignmentController')

router.post('/assignment', upload.none(), createAssignment)
router.get('/assignments', getAssignments)
router.get('/assignment/:id', getAssignmentById)
router.put('/assignment/:id', upload.none(), updateAssignment)
router.delete('/assignment/:id', deleteAssignment)
router.post('/assignment/restore/:id', restoreAssignment)

module.exports = router