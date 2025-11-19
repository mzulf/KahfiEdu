const express = require('express')
const router = express.Router();
const multer = require('multer');
const upload = multer();

const { createChild, getChildrens, getChildById, updateChild, deleteChild, restoreChild } = require('../controllers/childrenController');

router.get('/childrens', getChildrens);
router.get('/children/:id', getChildById);
router.post('/children', upload.none(), createChild);
router.put('/children/:id', upload.none(), updateChild);
router.delete('/children/:id', deleteChild);
router.post('/children/restore/:id', restoreChild);

module.exports = router;