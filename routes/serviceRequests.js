const express = require('express');
const router = express.Router();
const auth = require('../auth-middleware');
const ServiceRequest = require('../models/ServiceRequest');

// Submit a new service request
router.post('/', auth, async (req, res) => {
    try {
        const { deviceType, issueDescription } = req.body;
        const newRequest = new ServiceRequest({
            user: req.user,
            deviceType,
            issueDescription
        });

        const savedRequest = await newRequest.save();
        res.json(savedRequest);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get all service requests for a user
router.get('/', auth, async (req, res) => {
    console.log('Get service requests route called');
    try {
        const requests = await ServiceRequest.find({ user: req.user }).sort({ createdAt: -1 });
        console.log('Requests found:', requests);
        res.json(requests);
    } catch (err) {
        console.error('Error getting service requests:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;