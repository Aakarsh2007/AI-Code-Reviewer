const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;