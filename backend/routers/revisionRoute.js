const express = require('express')
const router = express.Router();
const { getAllRevisions } = require('../controllers/revisionController');

router.get('/revisions', getAllRevisions);

module.exports = router;