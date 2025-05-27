const express = require('express');
const router = express.Router();
const { renderLogin, renderSignup, loginUser, signupUser, logoutUser } = require('../controllers/authcontroller');

router.get('/login', renderLogin);
router.get('/signup', renderSignup);
router.post('/login', loginUser);
router.post('/signup', signupUser);
router.post('/logout', logoutUser);


module.exports = router;
