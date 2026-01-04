const express = require('express');
const router = express.Router();

const {
  login,
  register,
  resetPasswordRequest,
  changePassword,
  confirmOtp,
  logout,
  loginWithGoogle
} = require('../../controllers/auth/authController');

/* ===============================
   AUTHENTICATION
=============================== */
router.post('/login', login);
router.post('/logout', logout);

/* ===============================
   REGISTER & OTP
=============================== */
router.post('/register', register);
router.post('/otp-confirm', confirmOtp);

/* ===============================
   FORGOT / RESET PASSWORD
=============================== */
// 1️⃣ Kirim email reset
router.post('/forgot-password', resetPasswordRequest);

// 2️⃣ Set password baru
router.post('/reset-password', changePassword);

module.exports = router;