const Phone = require('../models/phone');
const Review = require('../models/review');
const AppError = require('../utils/AppError');

module.exports.createReview = async (req, res, next) => {
    try {
        const { phoneId } = req.params;
        const phone = await Phone.findById(phoneId);
        if (!phone) {
            throw new AppError(404, 'Phone not found');
        }
        const review = new Review(req.body);
        review.user = req.user._id;
        await review.save();
        phone.reviews.push(review);
        await phone.save();
        req.flash('success', 'Successfully posted a review');
        res.redirect(`/phones/${phoneId}`);
    } catch (err) {
        next(err);
    }
}

module.exports.deleteReview = async (req, res, next) => {
    try {
        const { phoneId, reviewID } = req.params;
        await Phone.findByIdAndUpdate(phoneId, { $pull: { reviews: reviewID } });
        await Review.findByIdAndDelete(reviewID);
        req.flash('success', 'Successfully deleted a review');
        res.redirect(`/phones/${phoneId}`);
    } catch (err) {
        next(err);
    }
}