const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // We'll create this next

const router = express.Router();

// Public routes
router.post('/register', registerUser); // Route for user registration
router.post('/login', loginUser);     // Route for user login

// Protected routes (require authentication)
router.post('/logout', protect, logoutUser); // Route for user logout (requires user to be logged in)

module.exports = router;