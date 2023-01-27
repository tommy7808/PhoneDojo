import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    }
});

export default model('Review', reviewSchema);