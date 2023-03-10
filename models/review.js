const { Schema, model } = require('mongoose');

const reviewSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: [0, 'Minimum rating is 0'],
        max: [5, 'Maximum rating is 5'],
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = model('Review', reviewSchema);