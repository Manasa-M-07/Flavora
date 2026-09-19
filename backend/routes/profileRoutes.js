const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.put('/', auth, upload.single('profile_image'), profileController.updateProfile);
router.put('/password', auth, profileController.changePassword);
router.delete('/', auth, profileController.deleteAccount);
router.get('/stats', auth, profileController.getStats);

module.exports = router;
