const express = require('express')
const router = express.Router();
const multer = require('multer');
const upload = multer();

const { createJob, updateJob, deleteJob, restoreJob, getJobs, getJobById } = require('../controllers/jobController');
const { validateToken } = require('../middlewares/authMiddleware');

router.get('/jobs', getJobs);
router.get('/job/:id', getJobById);
router.post('/job', validateToken, upload.none(), createJob);
router.put('/job/:id', validateToken, upload.none(), updateJob);
router.delete('/job/:id', validateToken, deleteJob);
router.post('/job/restore/:id', validateToken, restoreJob);

module.exports = router;