const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    language: {
        type: String,
        required: true,
        default: 'javascript'
    },
    originalCode: {
        type: String,
        required: true,
    },
    aiResponse: {
        type: Object,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Review', reviewSchema);

