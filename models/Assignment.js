const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
    serviceRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceRequest',
        required: true
    },
    engineer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['assigned', 'in-progress', 'completed'],
        default: 'assigned'
    },
    assignedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    }
});

module.exports = mongoose.model('Assignment', AssignmentSchema);