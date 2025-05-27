const multer = require('multer');
const Item = require('../models/Item');
const Donation = require('../models/Donation');

const renderDonatePage = (req, res) => {
    res.render('donate', { title: 'Donate an Item' });
};

const donateItem = async (req, res) => {
    const { name, shortdescription, description, search_tags,  descriptionOfTheSale, units, category, item_condition } = req.body;
    const donor_id = req.session.userId;
    const item_photo = req.file ? req.file.buffer : null;

    console.log('Uploaded file:', req.file); // Log the uploaded file

    if (!item_photo) {
        return res.status(400).send('No image uploaded');
    }
    try {
        // Create the item
        const item = await Item.create({
            seller_id: donor_id,
            name,
            shortdescription,
            description,
            search_tags,
            units,
            category,
            item_condition,
            status: 'Available',
            item_photo: req.file.buffer// Store image data
        });

        // Create the donation
        await Donation.create({
            item_id: item.insertId,
            descriptionOfTheSale,
            donor_id,
            receiver_id: null // Receiver is initially null
        });
        
        res.redirect('/dashboard');
        
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

module.exports = { renderDonatePage, donateItem };