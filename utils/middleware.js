import AppError from './AppError.js';

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