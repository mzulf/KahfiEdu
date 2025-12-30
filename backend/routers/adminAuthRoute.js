const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/auth/authController");

// 🔥 PASTIKAN ADA
console.log("AuthController keys:", Object.keys(AuthController));

router.post("/login", AuthController.adminLogin);

module.exports = router;
