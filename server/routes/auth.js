const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyEmail, googleLogin } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.get('/verify/:token', verifyEmail);

module.exports = router;
