import express from 'express';
import { renderPhones, createPhone, renderNewPhoneForm, renderPhone, updatePhone, deletePhone, renderEditPhoneForm } from '../controllers/phones.js';
import { isLoggedIn, formatCheckBox, isAuthorised } from '../utils/middleware.js';

const router = express.Router();

router.get('/', renderPhones);
router.get('/new', isLoggedIn, renderNewPhoneForm);
router.post('/', isLoggedIn, formatCheckBox, createPhone);
router.get('/:id', renderPhone);
router.get('/:id/edit', isLoggedIn, isAuthorised, renderEditPhoneForm);
router.put('/:id', isLoggedIn, isAuthorised, formatCheckBox, updatePhone);
router.delete('/:id', isLoggedIn, isAuthorised, deletePhone);

export default router;