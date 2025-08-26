const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, adminLogin, verifyFirebaseToken } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Customer routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Admin login route
router.post('/admin/login', adminLogin);

// Get current user profile (for session persistence)
router.get('/me', protect, getMe);

// OTP route using Firebase
router.post('/verify-firebase-token', verifyFirebaseToken);

module.exports = router;