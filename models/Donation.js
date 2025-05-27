const db = require('../config/db');

class Donation {
    static async create(donation) {
        const { item_id, descriptionOfTheSale, donor_id, receiver_id } = donation;
        const query = `
            INSERT INTO Donations (item_id, description, donor_id, receiver_id)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [item_id, descriptionOfTheSale, donor_id, receiver_id]);
        return result;
    }

    static async findByItemId(item_id) {
        const query = 'SELECT * FROM Donations WHERE item_id = ?';
        const [rows] = await db.query(query, [item_id]);
        return rows[0];
    }

    static async updateReceiver(item_id, receiver_id) {
        const query = `
            UPDATE Donations 
            SET receiver_id = ?, donation_date= NOW()
            WHERE item_id = ?
        `;
        const [result] = await db.query(query, [receiver_id, item_id]);
        console.log(receiver_id,item_id);
        return result;
    }
}

module.exports = Donation;