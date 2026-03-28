const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, deleteUser, getUsers, updateUserRole } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.route('/').get(protect, admin, getUsers);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/:id').delete(protect, admin, deleteUser).put(protect, admin, updateUserRole);

module.exports = router;
