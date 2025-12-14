const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // folder upload

const {
    getMateri,
    getMateriById,
    createMateri,
    updateMateri,
    deleteMateri,
    restoreMateri
} = require('../controllers/materiController');

router.get('/materi', getMateri);           // list & filter
router.get('/materi/:id', getMateriById);   // detail

router.post('/materi', upload.single('image'), createMateri); // create
router.put('/materi/:id', upload.single('image'), updateMateri); // update

router.delete('/materi/:id', deleteMateri);           // soft delete
router.post('/materi/restore/:id', restoreMateri);    // restore

module.exports = router;
