const express = require('express');
const router = express.Router();
const auth = require('../auth-middleware');
const User = require('../models/User');

// Get user profile
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update user profile
router.put('/', auth, async (req, res) => {
    console.log('Update profile route called');
    const { fullName, email } = req.body;

    try {
        let user = await User.findById(req.user);
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ msg: 'User not found' });
        }

        user.fullName = fullName || user.fullName;
        user.email = email || user.email;

        await user.save();
        console.log('User updated:', user);
        res.json(user);
    } catch (err) {
        console.error('Error updating profile:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;