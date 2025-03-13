const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

// Profile route
router.get('/profile', authMiddleware, authorize('user'), (req, res) => {
    res.status(200).json({ message: "Welcome to your User profile!" });
});

// User Dashboard route
router.get('/dashboard', authMiddleware, authorize('user'), (req, res) => {
    res.status(200).json({ message: "Welcome to your User dashboard!" });
});

module.exports = router;