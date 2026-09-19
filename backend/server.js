const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));
app.use('/api/shopping-list', require('./routes/shoppingRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Flavora API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    // \x1b[34m is blue, \x1b[4m is underline, \x1b[0m resets formatting
    console.log(`Server running at \x1b[34m\x1b[4mhttp://localhost:${PORT}\x1b[0m`);
});
