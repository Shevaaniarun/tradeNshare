const db = require('../config/db');

class LendingAuction {
    static async create(lendingAuction) {
        const { item_id, base_price, description, duration_days, start_date, end_date, lender_id } = lendingAuction;
        const query = `
            INSERT INTO LendingAuctions (item_id, base_price, description, duration_days, start_date, end_date, lender_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [item_id, base_price, description, duration_days, start_date, end_date, lender_id]);
        return result;
    }

    static async findById(item_id) {
        const query = 'SELECT * FROM LendingAuctions WHERE item_id = ?';
        const [rows] = await db.query(query, [item_id]);
        return rows[0];
    }

    static async placeBid(lend_auction_id, bidder_id, bid_amount) {
        const query = `
            INSERT INTO LendingBids (lend_auction_id, bidder_id, bid_amount)
            VALUES (?, ?, ?)
        `;
        const [result] = await db.query(query, [lend_auction_id, bidder_id, bid_amount]);
        return result;
    }

    static async updateHighestBid(auction_id, highest_bidder_id, highest_bid) {
        const query = `
            UPDATE LendingAuctions 
            SET highest_bid = ?, highest_bidder_id = ?
            WHERE lend_auction_id = ?
        `;
        const [result] = await db.query(query, [highest_bid, highest_bidder_id, auction_id]);
        return result;
    }

}

module.exports = LendingAuction;