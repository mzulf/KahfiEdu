const express = require('express')
const router = express.Router();
const multer = require('multer');
const upload = multer();

const {
    login,
    register,
    resetPasswordRequest,
    changePassword,
    confirmOtp,
    logout,
    loginWithGoogle
} = require('../../controllers/auth/authController');

// Authentication routes
router.post('/login', upload.none(), login);
router.post('/login/google', upload.none(), loginWithGoogle); // Add Google login route
router.post('/logout', upload.none(), logout);

// Registration and verification routes
router.post('/register', upload.none(), register);
router.post('/otp-confirm', upload.none(), confirmOtp);

// Password management routes
router.post('/reset-password', upload.none(), resetPasswordRequest);
router.post('/change-password', upload.none(), changePassword);

module.exports = router;