const { Schema, model } = require('mongoose');
const Review = require('./review');

const phoneSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true,
        maxLength: 30
    },
    memory: {
        type: Number,
        required: true,
        enum: [2, 4, 8, 16, 32, 64]
    },
    storage: {
        type: Number,
        required: true,
        enum: [2, 4, 8, 16, 32, 64, 128, 256, 512]
    },
    processor: {
        type: String,
        required: true,
        maxLength: [20, 'Processor name is too long']
    },
    displaySize: {
        type: Number,
        required: true,
        min: 0
    },
    weight: {
        type: Number,
        min: 0
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    images: [
        {
            url: String,
            filename: String
        }
    ],
    colour: String,
    available: Boolean,
});

phoneSchema.post('findOneAndDelete', async phone => phone.reviews && await Review.deleteMany({ _id: { $in: phone.reviews } }));

module.exports = model('Phone', phoneSchema);