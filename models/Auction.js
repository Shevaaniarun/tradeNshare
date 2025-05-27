const db = require('../config/db');

class Auction {
    static async create(auction) {
        const { item_id, base_price, description, start_date, end_date } = auction;
        const query = `
            INSERT INTO Auctions (item_id, base_price, description, start_date, end_date)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [item_id, base_price, description, start_date, end_date]);
        return result;
    }

    static async placeBid(auction_id, bidder_id, bid_amount) {
        const query = `
            INSERT INTO Bids (auction_id, bidder_id, bid_amount)
            VALUES (?, ?, ?)
        `;
        const [result] = await db.query(query, [auction_id, bidder_id, bid_amount]);
        return result;
    }

    static async updateHighestBid(auction_id, highest_bidder_id, highest_bid) {
        const query = `
            UPDATE Auctions 
            SET highest_bid = ?, highest_bidder_id = ?
            WHERE auction_id = ?
        `;
        const [result] = await db.query(query, [highest_bid, highest_bidder_id, auction_id]);
        return result;
    }

    static async findById(item_id) {
        const query = 'SELECT * FROM Auctions WHERE item_id = ?';
        const [rows] = await db.query(query, [item_id]);
        return rows[0];
    }
}

module.exports = Auction;
