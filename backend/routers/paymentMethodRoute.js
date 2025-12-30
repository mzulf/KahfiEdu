const express = require('express')
const router = express.Router();
const multer = require('multer');
const upload = multer();

const { getPaymentMethods, createPaymentMethod, updatePaymentMethod, deletePaymentMethod, restorePaymentMethod } = require('../controllers/paymentMethodController');

router.get('/payment-methods', getPaymentMethods);
router.post('/payment-method', upload.none(), createPaymentMethod);
router.put('/payment-method/:id', upload.none(), updatePaymentMethod);
router.delete('/payment-method/:id', deletePaymentMethod);
router.post('/payment-method/restore/:id', restorePaymentMethod);

module.exports = router;