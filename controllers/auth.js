const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('auth/register', { title: 'Register' });
}

module.exports.registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Successfully created new account!');
            res.redirect('/phones');
        });
    } catch (err) {
        err.message = err.code === 11000 ? 'A user is already registered with this email' : err.message;
        req.flash('error', err.message);
        return res.redirect('/register');
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('auth/login', { title: 'Login' });
}

module.exports.loginUser = (req, res) => {
    const redirectUrl = req.session.returnTo || '/phones';
    req.flash('success', 'Welcome back');
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
}