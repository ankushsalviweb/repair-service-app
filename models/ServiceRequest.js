const mongoose = require('mongoose');

const ServiceRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deviceType: {
        type: String,
        required: true
    },
    issueDescription: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'assigned', 'in-progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment'
    }
});

module.exports = mongoose.model('ServiceRequest', ServiceRequestSchema);