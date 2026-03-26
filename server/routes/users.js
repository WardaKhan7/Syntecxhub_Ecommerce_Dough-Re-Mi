const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/:id').delete(protect, admin, deleteUser);

module.exports = router;
