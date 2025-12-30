const express = require('express');
const router = express.Router();
const guruController = require('../controllers/guruController');

// Routes tanpa authentication (untuk testing)
router.get('/', guruController.getAllGuru);
router.get('/:id', guruController.getGuruById);
router.post('/', guruController.createGuru);
router.put('/:id', guruController.updateGuru);
router.delete('/:id', guruController.deleteGuru);

module.exports = router;