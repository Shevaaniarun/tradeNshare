const Review = require('../models/Review');
const User = require('../models/User');

const renderUserComments = async (req, res) => {
    const { user_id } = req.params;

    try {
        // Fetch the user's details
        const user = await User.findById(user_id);

        // Fetch the user's comments
        const comments = await Review.getComments(user_id);

        // Render the comments page
        res.render('comments', { 
            title: 'User Comments', 
            user, 
            comments 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

const fetchAllUsers=async (req, res) => {
    try {
        const users = await User.findAll(); // Fetch all users from the database
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Server error');
    }
}

module.exports = { renderUserComments, fetchAllUsers};