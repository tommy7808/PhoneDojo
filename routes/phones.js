import { Router } from 'express';
import { renderPhones, createPhone, renderNewPhoneForm, renderPhone, updatePhone, deletePhone, renderEditPhoneForm } from '../controllers/phones.js';
import { isLoggedIn, formatCheckBox, isAuthorised } from '../utils/middleware.js';

const router = Router();

router.route('/')
    .get(renderPhones)
    .post(isLoggedIn, formatCheckBox, createPhone);

router.get('/new', isLoggedIn, renderNewPhoneForm);

router.route('/:id')
    .get(renderPhone)
    .put(isLoggedIn, isAuthorised, formatCheckBox, updatePhone)
    .delete(isLoggedIn, isAuthorised, deletePhone);
    
router.get('/:id/edit', isLoggedIn, isAuthorised, renderEditPhoneForm);

export default router;