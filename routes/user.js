const express = require('express');
const router = express.Router();
const { renderUserComments, fetchAllUsers } = require('../controllers/usercontroller');
const User = require('../models/User'); 

// Render user comments
router.get('/comments/:user_id', renderUserComments);

// Fetch all users
router.get('/', fetchAllUsers);

module.exports = router;

