const { Router } = require('express');
const passport = require('passport');
const { renderRegisterForm, registerUser, renderLoginForm, loginUser, logoutUser } = require('../controllers/auth');

const router = Router();

router.route('/register')
    .get(renderRegisterForm)
    .post(registerUser);

router.route('/login')
    .get(renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), loginUser);

router.get('/logout', logoutUser);

module.exports = router;
