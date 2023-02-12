import AppError from './AppError.js';
import Phone from '../models/phone.js';
import Review from '../models/review.js';

// Error handlers always have these 4 parameters
export const errorLogger = (err, req, res, next) => {
    console.log(err.stack);
    if (err.name === 'ValidationError') err = new AppError(400, err.message);
    if (err.name === 'CastError') err = new AppError(400, 'Cast Error: Phone ID must be exactly 24 characters long');
    next(err);
};

export const errorHandler = (err, req, res, next) => {
    const { status = 500, message = 'Oops Something went wrong' } = err;
    res.status(status).render('error', { status, message, title: 'Error' });
}

export const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}

export const formatCheckBox = (req, res, next) => {
    // HTML checkboxes return string values so must be converted to boolean to match schema
    req.body.available = req.body.available ? true : false;
    next();
};

export const isAuthorised = async (req, res, next) => {
    try {
        const { id } = req.params;
        const phone = await Phone.findById(id);
        if (!phone) {
            req.flash('error', 'Cannot find phone!');
            return res.redirect('/phones');
            // throw new AppError(404, 'Phone not found');
        }
        if (!phone.user.equals(req.user._id)) {
            req.flash('error', 'You do not have permission to do that!')
            return res.redirect(`/phones/${id}`);
        }
    } catch (err) {
        return next(err);
        // return next(new AppError(404, 'Phone not found'));
    }   
    next();
};

export const isAuthorisedReview = async (req, res, next) => {
    try {
        const { phoneId, reviewID } = req.params;
        const review = await Review.findById(reviewID);
        if (!review) {
            req.flash('error', 'Cannot find review!');
            return res.redirect(`/phones/${phoneId}`);
        }
        if (!review.user.equals(req.user._id)) {
            req.flash('error', 'You do not have permission to do that!')
            return res.redirect(`/phones/${phoneId}`);
        }
    } catch (err) {
        return next(err);
        // return next(new AppError(404, 'Phone not found'));
    }   
    next();
};