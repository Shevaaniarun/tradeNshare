const Item = require('../models/Item');
const User = require('../models/User');
const FixedPriceSale = require('../models/FixedPriceSale');
const Auction = require('../models/Auction');
const Lending = require('../models/Lending');
const LendingAuction = require('../models/LendingAuction');
const Donation = require('../models/Donation');
const Review = require('../models/Review');

const renderBuyPage = (req, res) => {
    res.render('buy', { title: 'Buy Items' });
};

const searchItems = async (req, res) => {
    const { query } = req.query;

    try {
        // Fetch items matching the search query and with status 'Available' or 'Bidding'
        const items = await Item.search(query);
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

const viewItemDetails = async (req, res) => {
    const { item_id } = req.params;

    try {
        const item = await Item.findById(item_id);
        const seller = await User.findById(item.seller_id);
        const sellerRating = await Review.getAverageRating(item.seller_id);

        // Handle null or undefined sellerRating
        const formattedRating = (sellerRating !== null && !isNaN(sellerRating)) ? Math.round(sellerRating * 100) / 100 : 'No ratings yet';
        
        let auctionDetails = Details = null;
        if (item.status === 'Bidding') {
            // Fetch auction details for bidding items
            auctionDetails = await Auction.findById(item_id) ||  await LendingAuction.findById(item_id);
            
        }

        if(item.status ==='Available')
        {
            Details = await FixedPriceSale.findById(item_id) ||  await Lending.findById(item_id) || await Donation.findByItemId(item_id);
        }


        res.render('itemDetails', { 
            title: 'Item Details', 
            item, 
            seller,
            sellerRating: formattedRating,
            auctionDetails,
            Details
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};


const buyNow = async (req, res) => {
    const { item_id } = req.params;
    const buyer_id = req.session.userId;

    try {
        // Fetch the item to get the seller_id
        const item = await Item.findById(item_id);
        if (!item) {
            return res.status(404).send('Item not found');
        }

        // Check if the buyer is the seller
        if (item.seller_id === buyer_id) {
            return res.status(400).send('You cannot buy your own product');
        }

        // Check if the item is listed in FixedPriceSales
        const fixedPriceSale = await FixedPriceSale.findById(item_id);
        if (fixedPriceSale) {
            // Update FixedPriceSale with buyer_id
            await FixedPriceSale.updateBuyer(item_id, buyer_id);

            // Update item status to 'Sold'
            await Item.updateStatus(item_id, 'Sold');

            return res.status(200).send('Item purchased successfully');
        }

        // Check if the item is listed in Donations
        const donation = await Donation.findByItemId(item_id);
        if (donation) {
            // Update Donation with receiver_id
            await Donation.updateReceiver(item_id, buyer_id);

            // Update item status to 'Donated'
            await Item.updateStatus(item_id, 'Donated');

            return res.status(200).send('Donation request sent successfully');
        }

        // Check if the item is listed in Lending
        const lending = await Lending.findById(item_id);
        if (lending) {
            // Update Lending with borrower_id
            await Lending.updateBorrower(item_id, buyer_id);

            // Update item status to 'Lended'
            await Item.updateStatus(item_id, 'Lended');

            return res.status(200).send('Borrow request sent successfully');
        }

        // If the item is not found in any of the tables
        return res.status(404).send('Item not available for purchase, donation, or lending');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

const placeBid = async (req, res) => {
    const { item_id } = req.params;
    const { bidAmount } = req.body;
    const bidder_id = req.session.userId;

    try {
        // Fetch the item to get the seller_id
        const item = await Item.findById(item_id);
        if (!item) {
            return res.status(404).send('Item not found');
        }

        // Check if the bidder is the seller
        if (item.seller_id === bidder_id) {
            return res.status(400).send('You cannot bid on your own product');
        }

        // Fetch auction details
        const auction = await Auction.findById(item_id);
        const lendingAuction = await LendingAuction.findById(item_id);

        // Handle regular auction
        if (auction) {
            // Convert base_price and highest_bid to numbers
            const basePrice = parseFloat(auction.base_price);
            const highestBid = parseFloat(auction.highest_bid);

            // Validate bid amount
            if (bidAmount <= basePrice || bidAmount <= highestBid) {
                return res.status(400).send('Bid amount must be greater than the base price and current highest bid');
            }

            if (new Date() < auction.start_date) {
                return res.status(400).send('Bidding has not started yet.');
            }
        
            // Check if the auction has ended
            if (new Date() > auction.end_date) {
                return res.status(400).send('Bidding has ended.');
            }
    
            // Add bid to Bids table
            await Auction.placeBid(auction.auction_id, bidder_id, bidAmount);

            // Update highest bid in Auctions table
            await Auction.updateHighestBid(auction.auction_id, bidder_id, bidAmount);

            return res.status(200).send('Bid placed successfully');
        }

        // Handle lending auction
        if (lendingAuction) {
            // Convert base_price and highest_bid to numbers
            const basePrice = parseFloat(lendingAuction.base_price);
            const highestBid = parseFloat(lendingAuction.highest_bid);

            // Validate bid amount
            if (bidAmount <= basePrice || bidAmount <= highestBid) {
                return res.status(400).send('Bid amount must be greater than the base price and current highest bid');
            }

            if (new Date() < lendingAuction.start_date) {
                return res.status(400).send('Bidding has not started yet.');
            }
        
            // Check if the auction has ended
            if (new Date() > lendingAuction.end_date) {
                return res.status(400).send('Bidding has ended.');
            }

            // Add bid to LendingBids table
            await LendingAuction.placeBid(lendingAuction.lend_auction_id, bidder_id, bidAmount);

            // Update highest bid in LendingAuctions table
            await LendingAuction.updateHighestBid(lendingAuction.lend_auction_id, bidder_id, bidAmount);

            return res.status(200).send('Bid placed successfully');
        }

        // If no auction or lending auction is found
        return res.status(404).send('Auction not found');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};



module.exports = { renderBuyPage, searchItems, viewItemDetails, buyNow, placeBid};