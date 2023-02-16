import { Router } from 'express';
import { storage } from '../cloudinary/index.js';
// Multer is middleware for parsing request bodys with files.
import multer from "multer";
// Specify where uploaded files will be stored.
const upload = multer({ storage });
import { renderPhones, createPhone, renderNewPhoneForm, renderPhone, updatePhone, deletePhone, renderEditPhoneForm } from '../controllers/phones.js';
import { isLoggedIn, formatCheckBox, isAuthorised } from '../utils/middleware.js';

const router = Router();

router.route('/')
    .get(renderPhones)
    // .post(isLoggedIn, formatCheckBox, createPhone);
    .post(upload.single('image'), (req, res) => {
        console.log(req.body, req.file);
        res.send('Worked')
    })

router.get('/new', isLoggedIn, renderNewPhoneForm);

router.route('/:id')
    .get(renderPhone)
    .put(isLoggedIn, isAuthorised, formatCheckBox, updatePhone)
    .delete(isLoggedIn, isAuthorised, deletePhone);
    
router.get('/:id/edit', isLoggedIn, isAuthorised, renderEditPhoneForm);

export default router;