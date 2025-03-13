const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

// Admin-only route
router.get('/admin', authMiddleware, authorize('admin'), (req, res) => {
    res.status(200).json({ message: "Welcome to HabitQuest, Admin user!" });
});

router.get('/profile', authMiddleware, authorize('admin'), (req, res) => {
    res.status(200).json({ message: "Welcome to your Admin HabitQuest Profile!" });
});

router.get('/dashboard', authMiddleware, authorize('admin'), (req, res) => {
    res.status(200).json({ message: "Welcome to HabitQuest Dashboard, Admin user!" });
});



module.exports = router;