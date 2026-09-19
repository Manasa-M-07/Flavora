const express = require('express');
const router = express.Router();
const shoppingController = require('../controllers/shoppingController');
const auth = require('../middleware/auth');

router.post('/', auth, shoppingController.addItem);
router.get('/', auth, shoppingController.getItems);
router.put('/:id', auth, shoppingController.updateItem);
router.delete('/:id', auth, shoppingController.deleteItem);
router.delete('/clear/purchased', auth, shoppingController.clearPurchased);

module.exports = router;
