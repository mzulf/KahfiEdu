const express = require('express')
const router = express.Router();
const multer = require('multer');
const upload = multer();

const { createBank, updateBank, deleteBank, restoreBank, getBanks } = require('../controllers/bankController');

router.get('/banks', getBanks);
router.post('/bank', upload.none(), createBank);
router.put('/bank/:id', upload.none(), updateBank);
router.delete('/bank/:id', deleteBank);
router.post('/bank/restore/:id', restoreBank);

module.exports = router;