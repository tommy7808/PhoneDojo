import express from 'express';
import passport from 'passport';
import { renderRegisterForm, registerUser, renderLoginForm, loginUser, logoutUser } from '../controllers/auth.js';

const router = express.Router();

router.get('/register', renderRegisterForm);
router.post('/register', registerUser);
router.get('/login', renderLoginForm);
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), loginUser);
router.get('/logout', logoutUser);

export default router;
