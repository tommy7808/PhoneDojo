import User from '../models/user.js';

export const renderRegisterForm = (req, res) => {
    res.render('auth/register', { title: 'Register' });
}

export const registerUser = async (req, res) => {
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

export const renderLoginForm = (req, res) => {
    res.render('auth/login', { title: 'Login' });
}

export const loginUser = (req, res) => {
    const redirectUrl = req.session.returnTo || '/phones';
    req.flash('success', 'Welcome back');
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

export const logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
}