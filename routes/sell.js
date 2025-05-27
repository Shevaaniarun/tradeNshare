const express = require('express');
const router = express.Router();
const { renderSellPage, listItem } = require('../controllers/sellcontroller');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// Handle item listing (include image upload middleware)
router.post('/', upload.single('item_photo'), listItem);

// Render sell page
router.get('/', renderSellPage);



module.exports = router;
