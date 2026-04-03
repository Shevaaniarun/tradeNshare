const express = require('express');
const router = express.Router();
const { renderHome } = require('../controllers/indexcontroller');

router.get('/', renderHome);

module.exports = router;
