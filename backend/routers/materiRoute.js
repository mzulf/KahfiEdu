const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const {
    getMateri,
    getMateriById,
    createMateri,
    updateMateri,
    deleteMateri,
    restoreMateri,
    deleteMateriPermanent,
} = require('../controllers/materiController');

const { validateToken } = require('../middlewares/authMiddleware');

// PUBLIC
router.get('/', getMateri);
router.get('/:id', getMateriById);

// TOKEN ONLY (NO ROLE CHECK)
router.post('/', validateToken, upload.single('image'), createMateri);
router.put('/:id', validateToken, upload.single('image'), updateMateri);
router.delete('/:id', validateToken, deleteMateri);
router.post('/restore/:id', validateToken, restoreMateri);

// HARD DELETE
router.delete('/permanent/:id', validateToken, deleteMateriPermanent);

module.exports = router;
