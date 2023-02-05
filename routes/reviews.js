import express from 'express';
import Phone from '../models/phone.js';
import Review from '../models/review.js';
import AppError from '../utils/AppError.js';

const router = express.Router({ mergeParams: true });

router.post('/', async (req, res, next) => {
    try {
        const { phoneId } = req.params;
        const phone = await Phone.findById(phoneId);
        if (!phone) {
            throw new AppError(404, 'Phone not found');
        }
        const review = new Review(req.body);
        await review.save();
        phone.reviews.push(review);
        await phone.save();
        req.flash('success', 'Successfully posted a review');
        res.redirect(`/phones/${phoneId}`);
    } catch (err) {
        next(err);
    }
});

router.delete('/:reviewID', async (req, res, next) => {
    try {
        const { phoneId, reviewID } = req.params;
        await Phone.findByIdAndUpdate(phoneId, { $pull: { reviews: reviewID } });
        await Review.findByIdAndDelete(reviewID);
        req.flash('success', 'Successfully deleted a review');
        res.redirect(`/phones/${phoneId}`);
    } catch (err) {
        next(err);
    }
});

export default router;