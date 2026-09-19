const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.updateProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;
        let query = 'UPDATE Users SET name=?, phone=?';
        let params = [name, phone];

        if (req.file) {
            query += ', profile_image=?';
            params.push(req.file.filename);
        }

        query += ' WHERE id=?';
        params.push(req.user.id);

        await db.execute(query, params);
        res.json({ msg: 'Profile updated' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const [users] = await db.execute('SELECT * FROM Users WHERE id = ?', [req.user.id]);
        if (users.length === 0) return res.status(404).json({ msg: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, users[0].password);
        if (!isMatch) return res.status(400).json({ msg: 'Incorrect current password' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await db.execute('UPDATE Users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);
        res.json({ msg: 'Password changed successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        await db.execute('DELETE FROM Users WHERE id = ?', [req.user.id]);
        res.json({ msg: 'Account deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getStats = async (req, res) => {
    try {
        const user_id = req.user.id;
        const [recipes] = await db.execute('SELECT COUNT(*) as total FROM Recipes WHERE user_id = ?', [user_id]);
        const [favorites] = await db.execute('SELECT COUNT(*) as total FROM Favorites WHERE user_id = ?', [user_id]);
        const [shopping] = await db.execute('SELECT COUNT(*) as total FROM Shopping_List WHERE user_id = ? AND purchased = FALSE', [user_id]);

        res.json({
            recipes: recipes[0].total,
            favorites: favorites[0].total,
            shoppingList: shopping[0].total
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
