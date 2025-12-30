const express = require('express');
const router = express.Router();
const { exportUsers } = require('../../controllers/export/userExportController');

router.get('/export/users', exportUsers);

module.exports = router;