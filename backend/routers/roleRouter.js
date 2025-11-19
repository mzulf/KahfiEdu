const express = require('express')
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { getRoles, createRole, updateRole, deleteRole, restoreRole } = require('../controllers/roleController');

router.get('/roles', getRoles);
router.post('/role', upload.none(), createRole);
router.post('/role/restore/:id', restoreRole);
router.put('/role/:id', upload.none(), updateRole);
router.delete('/role/:id', deleteRole);

module.exports = router;