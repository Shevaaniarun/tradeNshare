const db = require('../config/db');

class Item {
    static async create(item) {
        const { seller_id, name, shortdescription, description, search_tags, units, category, item_condition, status, item_photo} = item;
        const query = `
            INSERT INTO Items (seller_id, name, shortdescription, description, search_tags, units, category, item_condition, status, item_photo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [seller_id, name, shortdescription, description, search_tags, units, category, item_condition, status, item_photo]);
        return result;
    }

    static async findById(item_id) {
        const query = `
            SELECT Items.*, FixedPriceSales.price 
            FROM Items 
            LEFT JOIN FixedPriceSales ON Items.item_id = FixedPriceSales.item_id 
            WHERE Items.item_id = ?
        `;
        const [rows] = await db.query(query, [item_id]);
        return rows[0];
    }

    static async updateStatus(item_id, status) {
        const query = 'UPDATE Items SET status = ? WHERE item_id = ?';
        const [result] = await db.query(query, [status, item_id]);
        return result;
    }

    static async search(query) {
        const searchQuery = `%${query}%`; // For partial matches
        const queryString = `
        SELECT 
            Items.item_id, 
            Items.seller_id, 
            Items.name, 
            Items.shortdescription, 
            Items.description, 
            Items.units, 
            Items.category, 
            Items.item_condition, 
            Items.status, 
            Items.listing_date,
            COALESCE(FixedPriceSales.price, Auctions.base_price, Lending.price, LendingAuctions.base_price) AS price,
            ROUND(AVG(Reviews.rating), 2) AS seller_rating
        FROM Items
        LEFT JOIN FixedPriceSales ON Items.item_id = FixedPriceSales.item_id
        LEFT JOIN Auctions ON Items.item_id = Auctions.item_id
        LEFT JOIN Lending ON Items.item_id = Lending.item_id
        LEFT JOIN LendingAuctions ON Items.item_id = LendingAuctions.item_id
        LEFT JOIN Reviews ON Items.seller_id = Reviews.reviewed_user_id
        WHERE (Items.name LIKE ? OR Items.description LIKE ? OR Items.shortdescription LIKE ? OR Items.category LIKE ? OR Items.search_tags LIKE ?)
        AND Items.status IN ('Available', 'Bidding')
        GROUP BY Items.item_id, Items.seller_id, Items.name, Items.shortdescription, Items.description, 
                Items.units, Items.category, Items.item_condition, Items.status, Items.listing_date,
                FixedPriceSales.price, Auctions.base_price, Lending.price, LendingAuctions.base_price;
        `;
        const [rows] = await db.query(queryString, [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery]);
        return rows;
    }
}

module.exports = Item;

