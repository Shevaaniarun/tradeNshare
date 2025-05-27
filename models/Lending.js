const db = require('../config/db');

class Lending {
    static async create(lending) {
        const { item_id, price, description, duration_days, lender_id } = lending;
        const query = `
            INSERT INTO Lending (item_id, price, description, duration_days, lender_id)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [item_id, price, description, duration_days, lender_id]);
        return result;
    }

    static async findById(item_id) {
        const query = 'SELECT * FROM Lending WHERE item_id = ?';
        const [rows] = await db.query(query, [item_id]);
        return rows[0];
    }

    static async updateBorrower(item_id, borrower_id) {
        console.log(borrower_id,item_id);
        const query = `
            UPDATE Lending 
            SET borrower_id = ?, lending_date = NOW()
            WHERE item_id = ?
        `;
        console.log(borrower_id,item_id);
        const [result] = await db.query(query, [borrower_id, item_id]);
        return result;

    }
}

module.exports = Lending;