// routers/importRoutes.js
const express = require('express');
const router = express.Router();
const { importUsers } = require('../../controllers/import/importController');
const { createUpload } = require('../../config/multerConfig');

const uploadExcel = createUpload("uploads/", [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "text/csv", // ✅ support .csv files
    "application/csv" // (beberapa browser bisa pakai ini)
]);


// Route for importing users from Excel file
router.post('/import/users', uploadExcel.single("file"), importUsers);

module.exports = router;