const express = require('express');
const router = express.Router();
const Item = require('../models/Item'); // Adjust the path to your Item model

// Endpoint to serve the image
router.get('/image/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id); // Fetch the item by ID
        if (!item || !item.item_photo) {
            return res.status(404).send('Image not found');
        }

        // Set the content type to image/jpeg (or the appropriate type)
        res.contentType('image/jpeg');
        res.send(item.item_photo); 
    } catch (err) {
        console.error('Error fetching image:', err);
        res.status(500).send('Server error');
    }
});

module.exports = router;