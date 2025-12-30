const express = require('express')
const router = express.Router();
const multer = require('multer');
const upload = multer();

const { getRegions, createRegion, updateRegion, deleteRegion, restoreRegion } = require('../controllers/regionController')

router.get('/regions', getRegions)
router.post('/region', upload.none(), createRegion)
router.put('/region/:id', upload.none(), updateRegion)
router.delete('/region/:id', upload.none(), deleteRegion)
router.post('/region/restore/:id', upload.none(), restoreRegion)

module.exports = router