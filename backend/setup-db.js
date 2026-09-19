const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function setupDatabase() {
    try {
        console.log('Connecting to MySQL...');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true
        });

        console.log('Reading flavora_db.sql...');
        const sqlScript = fs.readFileSync(path.join(__dirname, 'flavora_db.sql'), 'utf-8');

        console.log('Executing SQL script...');
        await connection.query(sqlScript);

        console.log('Database initialized successfully!');
        await connection.end();
    } catch (err) {
        console.error('Failed to setup database:', err);
        process.exit(1);
    }
}

setupDatabase();
