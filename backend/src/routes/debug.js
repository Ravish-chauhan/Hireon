const express = require('express');
const User = require('../../models/User');

const router = express.Router();

// Debug route to check users in database
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'email isEmailVerified createdAt').sort({ createdAt: -1 });
    res.json({
      count: users.length,
      users: users
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Debug route to delete unverified users
router.delete('/unverified-users', async (req, res) => {
  try {
    const result = await User.deleteMany({ isEmailVerified: false });
    res.json({ 
      message: `Deleted ${result.deletedCount} unverified users`,
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;