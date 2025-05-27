const express = require('express');
const router = express.Router();
const { renderBuyPage, searchItems, viewItemDetails, buyNow, placeBid} = require('../controllers/buycontroller');

// Render buy page
router.get('/', renderBuyPage);

// Search and filter items
router.get('/search', searchItems);

// View item details
router.get('/item/:item_id', viewItemDetails);

router.post('/item/:item_id/buy', buyNow);

router.post('/item/:item_id/bid', placeBid);


module.exports = router;

