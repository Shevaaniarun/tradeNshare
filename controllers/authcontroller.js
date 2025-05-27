const bcrypt = require('bcryptjs');
const User = require('../models/User');

const renderLogin = (req, res) => {
    res.render('login', { title: 'Login' });
};

const renderSignup = (req, res) => {
    res.render('signup', { title: 'Signup' });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).send('Invalid credentials');
        }

        // Verify the password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        // Establish a session
        req.session.userId = user.user_id;
        res.redirect('/dashboard'); // Redirect to the dashboard after login
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

const signupUser = async (req, res) => {
    const { email, password, confirmPassword, name, phone, address } = req.body;

    try {
        // Check if email already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).send('Email already in use');
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = { email, password_hash, name, phone, address };
        await User.create(newUser);

        // Redirect to login page
        res.redirect('/auth/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

const logoutUser = (req, res) => {
    // Destroy the session
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Logout failed');
        }

        // Clear the session cookie
        res.clearCookie('connect.sid'); // 'connect.sid' is the default session cookie name
        res.status(200).send('Logged out successfully');
    });
};

module.exports = { renderLogin, renderSignup, loginUser, signupUser, logoutUser };
