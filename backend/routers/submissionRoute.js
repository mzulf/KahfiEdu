const express = require('express');
const router = express.Router();
const { createUpload } = require('../config/multerConfig');
const {
    createSubmission,
    getSubmissions,
    getSubmissionById,
    gradeSubmission,
    deleteSubmission,
    restoreSubmission
} = require('../controllers/submissionsController');

const uploadFile = createUpload("uploads/submissions/", [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png"
]);

router.post('/submission', uploadFile.single('file'), createSubmission);
router.get('/submissions', getSubmissions);
router.get('/submission/:id', getSubmissionById);
router.put('/submission/:id/grade', uploadFile.none(), gradeSubmission);
router.delete('/submission/:id', deleteSubmission);
router.post('/submission/restore/:id', restoreSubmission);

module.exports = router;