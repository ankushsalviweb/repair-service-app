const express = require('express');
const router = express.Router();
const auth = require('../auth-middleware');
const User = require('../models/User');
const ServiceRequest = require('../models/ServiceRequest');
const Assignment = require('../models/Assignment');

// Get all engineers
router.get('/', auth, async (req, res) => {
    try {
        const engineers = await User.find({ role: 'engineer' }).select('-password');
        res.json(engineers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Assign an engineer to a service request
router.post('/assign', auth, async (req, res) => {
    try {
        const { serviceRequestId, engineerId } = req.body;

        const serviceRequest = await ServiceRequest.findById(serviceRequestId);
        if (!serviceRequest) {
            return res.status(404).json({ msg: 'Service request not found' });
        }

        const engineer = await User.findOne({ _id: engineerId, role: 'engineer' });
        if (!engineer) {
            return res.status(404).json({ msg: 'Engineer not found' });
        }

        if (!engineer.isAvailable) {
            return res.status(400).json({ msg: 'Engineer is not available' });
        }

        const assignment = new Assignment({
            serviceRequest: serviceRequestId,
            engineer: engineerId
        });

        await assignment.save();

        serviceRequest.status = 'assigned';
        serviceRequest.assignment = assignment._id;
        await serviceRequest.save();

        engineer.isAvailable = false;
        await engineer.save();

        res.json(assignment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update assignment status
router.put('/assignment/:id', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({ msg: 'Assignment not found' });
        }

        assignment.status = status;
        if (status === 'completed') {
            assignment.completedAt = Date.now();
            const engineer = await User.findById(assignment.engineer);
            engineer.isAvailable = true;
            await engineer.save();

            const serviceRequest = await ServiceRequest.findById(assignment.serviceRequest);
            serviceRequest.status = 'completed';
            await serviceRequest.save();
        }

        await assignment.save();
        res.json(assignment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;