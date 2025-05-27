const express = require('express');
const router = express.Router();
const multer = require('multer');
const { renderDonatePage, donateItem } = require('../controllers/donatecontroller');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Render donate page
router.get('/', renderDonatePage);

// Handle item donation with image upload middleware
router.post('/', upload.single('item_photo'), donateItem);

module.exports = router;
