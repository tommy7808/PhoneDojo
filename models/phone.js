import { Schema, model } from "mongoose";

const phoneSchema = new Schema({
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
    colour: String,
    available: Boolean,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

export default model('Phone', phoneSchema);