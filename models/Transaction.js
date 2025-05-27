const db = require('../config/db');

class Transaction {
    static async hasTransaction(reviewer_id, reviewed_user_id) {
        // Check FixedPriceSales
        const fixedPriceQuery = `
            SELECT * FROM FixedPriceSales 
            JOIN Items ON FixedPriceSales.item_id = Items.item_id
            WHERE buyer_id = ? AND seller_id = ? AND Items.status = 'Sold'
        `;
        const [fixedPriceRows] = await db.query(fixedPriceQuery, [reviewer_id, reviewed_user_id]);

        // Check Auctions
        const auctionQuery = `
            SELECT * FROM Auctions 
            JOIN Items ON Auctions.item_id = Items.item_id
            WHERE highest_bidder_id = ? AND seller_id = ? AND Items.status = 'Sold'
        `;
        const [auctionRows] = await db.query(auctionQuery, [reviewer_id, reviewed_user_id]);

        // Check LendingAuctions
        const lendingAuctionQuery = `
            SELECT * FROM LendingAuctions 
            JOIN Items ON LendingAuctions.item_id = Items.item_id
            WHERE highest_bidder_id = ? AND lender_id = ? AND Items.status = 'Lended'
        `;
        const [lendingAuctionRows] = await db.query(lendingAuctionQuery, [reviewer_id, reviewed_user_id]);

        // Check Lending
        const lendingQuery = `
            SELECT * FROM Lending 
            JOIN Items ON Lending.item_id = Items.item_id
            WHERE borrower_id = ? AND lender_id = ? AND Items.status = 'Lended'
        `;
        const [lendingRows] = await db.query(lendingQuery, [reviewer_id, reviewed_user_id]);

        // Check Donations
        const donationQuery = `
            SELECT * FROM Donations 
            JOIN Items ON Donations.item_id = Items.item_id
            WHERE donor_id = ? AND receiver_id = ? AND Items.status = 'Donated'
        `;
        const [donationRows] = await db.query(donationQuery, [reviewed_user_id, reviewer_id]);

        // Debugging: Log the results of each query
        console.log('FixedPrice Rows:', fixedPriceRows);
        console.log('Auction Rows:', auctionRows);
        console.log('LendingAuction Rows:', lendingAuctionRows);
        console.log('Lending Rows:', lendingRows);
        console.log('Donation Rows:', donationRows);


        // If any of the queries return results, a valid transaction exists
        return (
            fixedPriceRows.length > 0 ||
            auctionRows.length > 0 ||
            lendingAuctionRows.length > 0 ||
            lendingRows.length > 0 ||
            donationRows.length > 0
        );
    }
}

module.exports = Transaction;