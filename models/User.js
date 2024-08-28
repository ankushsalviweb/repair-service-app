const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['customer', 'engineer', 'admin'],
        default: 'customer'
    },
    specialization: {
        type: String,
        enum: ['hardware', 'software', 'networking', 'general'],
        required: function() { return this.role === 'engineer'; }
    },
    isAvailable: {
        type: Boolean,
        default: true,
        required: function() { return this.role === 'engineer'; }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);