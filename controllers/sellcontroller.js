const multer = require('multer');
const Item = require('../models/Item');
const FixedPriceSale = require('../models/FixedPriceSale');
const Auction = require('../models/Auction');
const Lending = require('../models/Lending');
const LendingAuction = require('../models/LendingAuction');


const renderSellPage = (req, res) => {
    res.render('sell', { title: 'Sell an Item' });
};

const listItem = async (req, res) => {
    try {
        const { 
            name, shortdescription, description, search_tags, units, category, item_condition, saleType, 
            price, basePrice, startDate, endDate, lendingPrice, durationDays, 
            lendingAuctionPrice, lendingAuctionDuration, lendingAuctionStartDate, 
            lendingAuctionEndDate, fixedPriceDescription, auctionDescription, 
            lendingDescription, lendingAuctionDescription
        } = req.body;

        const seller_id = req.session.userId;
        const item_photo = req.file ? req.file.buffer : null; // Store image as binary

        console.log('Uploaded file:', req.file); // Log the uploaded file

        if (!item_photo) {
            return res.status(400).send('No image uploaded');
        }

        let status = 'Available';
        if (saleType === 'auction' || saleType === 'lendingAuction') {
            status = 'Bidding';
        }

        // Create the item
        const item = await Item.create({
            seller_id,
            name,
            shortdescription,
            description,
            search_tags,
            units,
            category,
            item_condition,
            status,
            item_photo: req.file.buffer// Store image data
        });

        console.log('Item created:', item); // Log the created item

        // Handle different sale types
        if (saleType === 'fixedPrice') {
            await FixedPriceSale.create({
                item_id: item.insertId,  // Ensure ID matches DB type
                price,
                description: fixedPriceDescription,
                buyer_id: null
            });
        } else if (saleType === 'auction') {
            await Auction.create({
                item_id: item.insertId,
                base_price: basePrice,
                description: auctionDescription,
                start_date: startDate,
                end_date: endDate
            });
        } else if (saleType === 'lending') {
            await Lending.create({
                item_id: item.insertId,
                price: lendingPrice,
                description: lendingDescription,
                duration_days: durationDays,
                lender_id: seller_id
            });
        } else if (saleType === 'lendingAuction') {
            await LendingAuction.create({
                item_id: item.insertId,
                base_price: lendingAuctionPrice,
                description: lendingAuctionDescription,
                duration_days: lendingAuctionDuration,
                lender_id: seller_id,
                start_date: lendingAuctionStartDate,
                end_date: lendingAuctionEndDate
            });
        }

        res.redirect('/dashboard');
    } catch (err) {
        console.error('Error listing item:', err);
        res.status(500).send('Server error');
    }

    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }
    } catch (err) {
        console.error('Error listing item:', err);
        res.status(500).send('Server error');
    }
};

module.exports = { renderSellPage, listItem };