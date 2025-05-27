const db = require('../config/db');

class FixedPriceSale {
    static async create(sale) {
        const { item_id, price, description, buyer_id } = sale;
        const query = `
            INSERT INTO FixedPriceSales (item_id, price, description, buyer_id)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [item_id, price, description, buyer_id]);
        return result;
    }

    static async updateBuyer(item_id, buyer_id) {
        const query = `
            UPDATE FixedPriceSales 
            SET buyer_id = ?, sale_date = NOW() 
            WHERE item_id = ?
        `;
        const [result] = await db.query(query, [buyer_id, item_id]);
        console.log(buyer_id,item_id);
        return result;
    }

    static async findById(item_id) {
        const query = 'SELECT * FROM  FixedPriceSales WHERE item_id = ?';
        const [rows] = await db.query(query, [item_id]);
        return rows[0];
    }
}


module.exports = FixedPriceSale;