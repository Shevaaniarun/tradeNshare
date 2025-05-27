const Review = require('../models/Review');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

const renderReviewPage = (req, res) => {
    res.render('review', { title: 'Leave a Review' });
};

const submitReview = async (req, res) => {
    const { reviewedUserEmail, rating, comment } = req.body;
    const reviewer_id = req.session.userId;

    try {
        // Find the reviewed user by email
        const reviewedUser = await User.findByEmail(reviewedUserEmail);
        if (!reviewedUser) {
            return res.status(400).send('Invalid reviewed user email');
        }

        // Check if the reviewer has transacted with the reviewed user
        const hasTransaction = await Transaction.hasTransaction(reviewer_id, reviewedUser.user_id);
        if (!hasTransaction) {
            return res.status(400).send('Invalid review attempt. You must have transacted with this user to leave a review.');
        }

        // Create the review
        await Review.create({
            reviewer_id,
            reviewed_user_id: reviewedUser.user_id,
            rating,
            comment
        });

        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

module.exports = { renderReviewPage, submitReview };