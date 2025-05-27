const User = require('../models/User');

const renderDashboard = async (req, res) => {
    try {
        // Fetch the logged-in user's details
        const user = await User.findById(req.session.userId);

        // Fetch purchase, sale, bidding, auction, lending, donation, lending auction, and lending bidding history
        const purchaseHistory = await User.getPurchaseHistory(req.session.userId);
        const saleHistory = await User.getSaleHistory(req.session.userId);
        const biddingHistory = await User.getBiddingHistory(req.session.userId);
        const auctionHistory = await User.getAuctionHistory(req.session.userId);
        const lendingHistory = await User.getLendingHistory(req.session.userId);
        const lendingAuctionHistory = await User.getLendingAuctionHistory(req.session.userId);
        const lendingBiddingHistory = await User.getLendingBiddingHistory(req.session.userId);
        const donationHistory = await User.getDonationHistory(req.session.userId);
        const receivedDonationHistory = await User.getReceivedDonationHistory(req.session.userId);
        const lendingBorrowingHistory = await User.getBorrowingHistory(req.session.userId);
        // Render the dashboard with user data and history
        res.render('dashboard', { 
            title: 'Dashboard', 
            user, 
            purchaseHistory, 
            saleHistory, 
            biddingHistory, 
            auctionHistory, 
            lendingHistory, 
            lendingBorrowingHistory,
            donationHistory, 
            lendingAuctionHistory, 
            lendingBiddingHistory ,
            receivedDonationHistory
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

module.exports = { renderDashboard };