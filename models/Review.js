const db = require('../config/db');

class Review {
    static async create(review) {
        const { reviewer_id, reviewed_user_id, rating, comment } = review;
        const query = `
            INSERT INTO Reviews (reviewer_id, reviewed_user_id, rating, comment)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [reviewer_id, reviewed_user_id, rating, comment]);
        return result;
    }

    static async findByReviewedUserId(reviewed_user_id) {
        const query = 'SELECT * FROM Reviews WHERE reviewed_user_id = ?';
        const [rows] = await db.query(query, [reviewed_user_id]);
        return rows;
    }

    static async getAverageRating(reviewed_user_id) {
        const query = 'SELECT AVG(rating) AS averageRating FROM Reviews WHERE reviewed_user_id = ?';
        const [rows] = await db.query(query, [reviewed_user_id]);
    
        // Return null if no ratings exist
        return rows[0].averageRating || null;
    }

    static async getComments(reviewed_user_id) {
        const query = `
            SELECT * FROM Reviews 
            WHERE reviewed_user_id = ?
        `;
        const [rows] = await db.query(query, [reviewed_user_id]);
        return rows;
    }
}

module.exports = Review;