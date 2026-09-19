const db = require('../config/db');

exports.addFavorite = async (req, res) => {
    try {
        const { meal_id, meal_title, meal_thumb } = req.body;
        const user_id = req.user.id;

        const [existing] = await db.execute('SELECT * FROM Favorites WHERE user_id = ? AND meal_id = ?', [user_id, meal_id]);
        if (existing.length > 0) {
            return res.status(400).json({ msg: 'Recipe already in favorites' });
        }

        await db.execute('INSERT INTO Favorites (user_id, meal_id, meal_title, meal_thumb) VALUES (?, ?, ?, ?)', [user_id, meal_id, meal_title, meal_thumb]);
        res.json({ msg: 'Added to favorites' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.removeFavorite = async (req, res) => {
    try {
        const { meal_id } = req.params;
        const user_id = req.user.id;

        await db.execute('DELETE FROM Favorites WHERE user_id = ? AND meal_id = ?', [user_id, meal_id]);
        res.json({ msg: 'Removed from favorites' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getFavorites = async (req, res) => {
    try {
        const user_id = req.user.id;
        const [favorites] = await db.execute(`
            SELECT * FROM Favorites 
            WHERE user_id = ?
            ORDER BY created_at DESC
        `, [user_id]);
        res.json(favorites);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
