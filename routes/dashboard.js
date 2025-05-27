const express = require('express');
const router = express.Router();
const { renderDashboard } = require('../controllers/dashboardcontroller');

// Render dashboard
router.get('/', renderDashboard);

module.exports = router;