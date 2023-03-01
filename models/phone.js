const { Schema, model } = require('mongoose');
const { cloudinary } = require('../cloudinary');
const Review = require('./review');

const imageSchema = new Schema({
    url: String,
    filename: String
});

imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200,h_300');
});

imageSchema.virtual('display').get(function() {
    // return this.url.replace('/upload',  '/upload/ar_3:4,c_crop');
    return this.url.replace('/upload',  '/upload/w_300,h_450');
});

imageSchema.virtual('carousel').get(function() {
    return this.url.replace('/upload',  '/upload/ar_3:4,c_crop');
});

const phoneSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true,
        maxLength: [30, 'Phone name has a maxlength of 30 characters']
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
        maxLength: [20, 'Processor has a maxlength of 20 characters']
    },
    displaySize: {
        type: Number,
        required: true,
        min: [1, 'Minimum display size is 1']
    },
    weight: {
        type: Number,
        min: [0, 'Minimum weight is 0']
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    images: [imageSchema],
    colour: String,
    available: Boolean,
});

phoneSchema.post('findOneAndDelete', async phone => {
    phone.reviews && await Review.deleteMany({ _id: { $in: phone.reviews } });
    phone.images.forEach(async img => await cloudinary.uploader.destroy(img.filename));
});

module.exports = model('Phone', phoneSchema);