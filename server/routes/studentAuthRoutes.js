const express = require('express');
const router = express.Router();
const { login, getCurrentStudent } = require('../controllers/studentAuthController');
const { auth, requireStudent } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', login);

// Protected routes
router.get('/me', auth, requireStudent, getCurrentStudent);

module.exports = router; 