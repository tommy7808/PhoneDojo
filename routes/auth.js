import { Router } from 'express';
import passport from 'passport';
import { renderRegisterForm, registerUser, renderLoginForm, loginUser, logoutUser } from '../controllers/auth.js';

const router = Router();

router.route('/register')
    .get(renderRegisterForm)
    .post(registerUser);

router.route('/login')
    .get(renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), loginUser);

router.get('/logout', logoutUser);

export default router;
