const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function updateDb() {
    try {
        console.log('Connecting to database...');
        const db = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'flavora_db'
        });

        console.log('Dropping old Favorites and Recipes tables...');
        await db.execute('DROP TABLE IF EXISTS Favorites');
        await db.execute('DROP TABLE IF EXISTS Recipes');

        console.log('Creating new Favorites table for TheMealDB API...');
        await db.execute(`
            CREATE TABLE Favorites (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                meal_id VARCHAR(50) NOT NULL,
                meal_title VARCHAR(255) NOT NULL,
                meal_thumb VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
                UNIQUE KEY unique_favorite (user_id, meal_id)
            )
        `);

        console.log('Database schema successfully updated for V2!');
        await db.end();
    } catch (err) {
        console.error('Update failed:', err);
    }
}

updateDb();
