const express = require('express');
const router = express.Router();
const { createUpload } = require('../config/multerConfig');

const { getPayments, getPaymentById, createPayment, deletePayment, restorePayment, updatePayment } = require('../controllers/paymentController');
const { validateToken } = require('../middlewares/authMiddleware');

const uploadImage = createUpload("uploads/proof/", [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "application/pdf"
]);


router.get('/payments', getPayments);
router.get('/payment/:id', getPaymentById);
router.post('/payment', uploadImage.single('payment_proof'), createPayment);
router.put('/payment/:id', uploadImage.single('payment_proof'), updatePayment);
router.delete('/payment/:id', deletePayment);
router.post('/payment/restore/:id', restorePayment);

module.exports = router;
