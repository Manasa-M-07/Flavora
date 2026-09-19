const db = require('../config/db');

exports.addItem = async (req, res) => {
    try {
        const { ingredient, quantity } = req.body;
        const user_id = req.user.id;

        const [result] = await db.execute(
            'INSERT INTO Shopping_List (user_id, ingredient, quantity) VALUES (?, ?, ?)',
            [user_id, ingredient, quantity]
        );
        res.json({ msg: 'Item added', id: result.insertId });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getItems = async (req, res) => {
    try {
        const [items] = await db.execute('SELECT * FROM Shopping_List WHERE user_id = ?', [req.user.id]);
        res.json(items);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateItem = async (req, res) => {
    try {
        const { purchased } = req.body;
        await db.execute('UPDATE Shopping_List SET purchased = ? WHERE id = ? AND user_id = ?', [purchased, req.params.id, req.user.id]);
        res.json({ msg: 'Item updated' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteItem = async (req, res) => {
    try {
        await db.execute('DELETE FROM Shopping_List WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        res.json({ msg: 'Item deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.clearPurchased = async (req, res) => {
    try {
        await db.execute('DELETE FROM Shopping_List WHERE user_id = ? AND purchased = TRUE', [req.user.id]);
        res.json({ msg: 'Purchased items cleared' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
