const db = require('../config/db');

class User {
    static async create(user) {
        const { email, password_hash, name, phone, address } = user;
        const query = `
            INSERT INTO Users (email, password_hash, name, phone, address)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [email, password_hash, name, phone, address]);
        return result;
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM Users WHERE email = ?';
        const [rows] = await db.query(query, [email]);
        return rows[0];
    }

    static async findById(user_id) {
        const query = 'SELECT * FROM Users WHERE user_id = ?';
        const [rows] = await db.query(query, [user_id]);
        return rows[0];
    }

    static async findAll() {
        const query = 'SELECT user_id, name, round(avg(rating),2) as ratings FROM Users LEFT JOIN Reviews ON reviewed_user_id=user_id group by user_id order by ratings desc';
        const [rows] = await db.query(query);
        return rows;

    }

    static async verifyPassword(password, password_hash) {
        return await bcrypt.compare(password, password_hash);
    }

    static async findUsersTransactedWith(user_id) {
        const query = `
            SELECT DISTINCT u.user_id, u.name, u.email 
            FROM Users u
            JOIN FixedPriceSales f ON u.user_id = f.seller_id OR u.user_id = f.buyer_id
            WHERE (f.buyer_id = ? OR f.seller_id = ?) AND u.user_id != ?
        `;
        const [rows] = await db.query(query, [user_id, user_id, user_id]);
        return rows;
    }

    static async getPurchaseHistory(user_id) {
        const query = `
            SELECT 
                Items.name AS item_name,
                Items.description AS item_description,
                Items.item_condition AS item_condition,
                FixedPriceSales.price AS purchase_price,
                FixedPriceSales.sale_date AS purchase_date,
                Users.name AS seller_name,
                Users.email AS seller_email,
                Users.phone AS seller_phonenum,
                Users.address AS seller_address
            FROM FixedPriceSales
            JOIN Items ON FixedPriceSales.item_id = Items.item_id
            JOIN Users ON Items.seller_id = Users.user_id
            WHERE FixedPriceSales.buyer_id = ?
        `;
        const [rows] = await db.query(query, [user_id]);
        return rows;
    }

    static async getSaleHistory(user_id) {
        const query = `
            SELECT 
                Items.name AS item_name,
                Items.description AS item_description,
                Items.item_condition AS item_condition,
                FixedPriceSales.price AS sale_price,
                FixedPriceSales.sale_date AS sale_date,
                Users.name AS buyer_name,
                Users.email AS buyer_email,
                Users.phone AS buyer_phonenum,
                Users.address AS buyer_address

            FROM FixedPriceSales
            JOIN Items ON FixedPriceSales.item_id = Items.item_id
            LEFT JOIN Users ON FixedPriceSales.buyer_id = Users.user_id
            WHERE Items.seller_id = ?
        `;
        const [rows] = await db.query(query, [user_id]);
        return rows;
    }

    static async getBiddingHistory(user_id) {
        const query = `
            SELECT 
                Items.name AS item_name,
                Items.description AS item_description,
                Items.item_condition AS item_condition,
                Items.status AS item_status,
                Auctions.base_price AS base_price,
                Auctions.start_date AS start_date,
                Auctions.end_date AS end_date,
                Auctions.highest_bid AS bid_amount,
                Bids.bid_time AS bid_time,
                Users.name AS auctioneer_name,
                Users.email AS auctioneer_email,
                Users.phone AS auctioneer_phonenum,
                Users.address AS auctioneer_address
            FROM Auctions
            JOIN Bids ON Auctions.auction_id = Bids.auction_id AND Auctions.highest_bid = Bids.bid_amount
            JOIN Items ON Auctions.item_id = Items.item_id
            JOIN Users ON Items.seller_id = Users.user_id
            WHERE Auctions.highest_bidder_id = ?
        `;
        const [rows] = await db.query(query, [user_id, user_id]);
        return rows;
    }

    static async getAuctionHistory(user_id) {
        const query = `
            SELECT 
                Items.name AS item_name,
                Items.description AS item_description,
                Items.item_condition AS item_condition,
                Items.status AS item_status,
                Auctions.base_price AS base_price,
                Auctions.start_date AS start_date,
                Auctions.end_date AS end_date,
                Auctions.highest_bid AS highest_bid,
                Users.name AS highest_bidder_name,
                Users.email AS highest_bidder_email,
                Users.phone AS highest_bidder_phonenum,
                Users.address AS highest_bidder_address
            FROM Auctions
            JOIN Items ON Auctions.item_id = Items.item_id
            LEFT JOIN Users ON Auctions.highest_bidder_id = Users.user_id
            WHERE Items.seller_id = ?
        `;
        const [rows] = await db.query(query, [user_id]);
        return rows;
    }

    static async getLendingHistory(user_id) {
        const query = `
            SELECT 
                Items.name AS item_name,
                Items.description AS item_description,
                Items.item_condition AS item_condition,
                Items.status AS item_status,
                Lending.price AS price,
                Lending.duration_days AS duration_days,
                Lending.lending_date,
                Users.name AS borrower_name,
                Users.email AS borrower_email,
                Users.phone AS borrower_phonenum,
                Users.address AS borrower_address
            FROM Lending
            JOIN Items ON Lending.item_id = Items.item_id
            LEFT JOIN Users ON Lending.borrower_id = Users.user_id
            WHERE Lending.lender_id = ?
        `;
        const [rows] = await db.query(query, [user_id, user_id]);
        return rows;
    }

    static async getBorrowingHistory(user_id) {
        const query = `
            SELECT 
                Items.name AS item_name,
                Items.description AS item_description,
                Items.item_condition AS item_condition,
                Lending.price AS price,
                Lending.duration_days AS duration_days,
                Users.name AS lender_name,
                Users.email AS lender_email,
                Users.phone AS lender_phonenum,
                Users.address AS lender_address,
                Lending.lending_date
            FROM Lending
            JOIN Items ON Lending.item_id = Items.item_id
            JOIN Users ON Lending.lender_id = Users.user_id
            WHERE Lending.borrower_id = ?;
        `;
        const [rows] = await db.query(query, [user_id]);
        return rows;
    }

    

    static async getDonationHistory(user_id) {
        const query = `
            SELECT 
                Items.name AS item_name,
                Items.description AS item_description,
                Items.item_condition AS item_condition,
                Donations.donation_date,
                Users.name AS receiver_name,
                Users.email AS receiver_email,
                Users.phone AS receiver_phonenum,
                Users.address AS receiver_address
            FROM Donations
            JOIN Items ON Donations.item_id = Items.item_id
            LEFT JOIN Users ON Donations.receiver_id = Users.user_id
            WHERE Donations.donor_id = ?
        `;
        const [rows] = await db.query(query, [user_id]);
        return rows;
    }

    static async getReceivedDonationHistory(user_id) {
        const query = `
            SELECT 
                Items.name AS item_name,
                Items.description AS item_description,
                Items.item_condition AS item_condition,
                Donations.donation_date,
                Users.name AS donor_name,
                Users.email AS donor_email,
                Users.phone AS donor_phonenum,
                Users.address AS donor_address
            FROM Donations
            JOIN Items ON Donations.item_id = Items.item_id
            JOIN Users ON Donations.donor_id = Users.user_id
            WHERE Donations.receiver_id = ?
        `;
        const [rows] = await db.query(query, [user_id]);
        return rows;
    }

    static async getLendingAuctionHistory(user_id) {
        const query = `
            SELECT 
                Items.name AS item_name,
                Items.description AS item_description,
                Items.item_condition AS item_condition,
                Items.status AS item_status,
                LendingAuctions.base_price AS base_price,
                LendingAuctions.start_date AS start_date,
                LendingAuctions.end_date AS end_date,
                LendingAuctions.highest_bid AS highest_bid,
                Users.name AS highest_bidder_name,
                Users.email AS highest_bidder_email,
                Users.phone AS highest_bidder_phonenum,
                Users.address AS highest_bidder_address
            FROM LendingAuctions
            JOIN Items ON LendingAuctions.item_id = Items.item_id
            LEFT JOIN Users ON LendingAuctions.highest_bidder_id = Users.user_id
            WHERE LendingAuctions.lender_id = ?
        `;
        const [rows] = await db.query(query, [user_id]);
        return rows;
    }

    static async getLendingBiddingHistory(user_id) {
        const query = `
            SELECT 
                Items.name AS item_name,
                Items.description AS item_description,
                Items.item_condition AS item_condition,
                Items.status AS item_status,
                LendingAuctions.base_price AS base_price,
                LendingAuctions.start_date AS start_date,
                LendingAuctions.end_date AS end_date,
                LendingAuctions.highest_bid AS bid_amount,
                LendingBids.bid_time AS bid_time,
                Users.name AS lender_name,
                Users.email AS lender_email,
                Users.phone AS lender_phonenum,
                Users.address AS lender_address
            FROM LendingAuctions
            JOIN LendingBids ON LendingBids.lend_auction_id = LendingAuctions.lend_auction_id AND LendingAuctions.highest_bid = LendingBids.bid_amount
            JOIN Items ON LendingAuctions.item_id = Items.item_id
            JOIN Users ON LendingAuctions.lender_id = Users.user_id
            WHERE LendingBids.bidder_id = ? AND LendingAuctions.highest_bidder_id = ?
        `;
        const [rows] = await db.query(query, [user_id, user_id]);
        return rows;
    }
}

module.exports = User;