const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const auth = require('../middleware/auth');

router.post('/', auth, favoriteController.addFavorite);
router.delete('/:meal_id', auth, favoriteController.removeFavorite);
router.get('/', auth, favoriteController.getFavorites);

module.exports = router;
