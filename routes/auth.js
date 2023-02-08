import express from 'express';
import passport from 'passport';
import User from '../models/user.js';

const router = express.Router();

router.get('/register', (req, res) => {
    res.render('auth/register', { title: 'Register' });
});

router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        await User.register(user, password);
        req.flash('success', 'Successfully created new account!');
        res.redirect('/phones');
    } catch (err) {
        err.message = err.code === 11000 ? 'A user is already registered with this email' : err.message;
        req.flash('error', err.message);
        return res.redirect('/register');
    }
});

router.get('/login', (req, res) => {
    res.render('auth/login', { title: 'Login' });
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back');
    res.redirect('/phones');
});

router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

export default router;
