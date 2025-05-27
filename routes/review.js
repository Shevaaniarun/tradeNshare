const express = require('express');
const router = express.Router();
const { renderReviewPage, submitReview } = require('../controllers/reviewcontroller');

// Render review page
router.get('/', renderReviewPage);

// Handle review submission
router.post('/', submitReview);

module.exports = router;