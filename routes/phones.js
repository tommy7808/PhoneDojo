const { Router } = require('express');
const multer = require('multer');
const { storage } = require('../cloudinary');
const { renderPhones, createPhone, renderNewPhoneForm, renderPhone, updatePhone, deletePhone, renderEditPhoneForm } = require('../controllers/phones');
const { isLoggedIn, formatCheckBox, isAuthorised } = require('../utils/middleware');

// Specify where to upload images to
const upload = multer({ storage });

const router = Router();

router.route('/')
    .get(renderPhones)
    .post(isLoggedIn, upload.array('image'), formatCheckBox, createPhone);

router.get('/new', isLoggedIn, renderNewPhoneForm);

router.route('/:id')
    .get(renderPhone)
    .put(isLoggedIn, isAuthorised, formatCheckBox, updatePhone)
    .delete(isLoggedIn, isAuthorised, deletePhone);
    
router.get('/:id/edit', isLoggedIn, isAuthorised, renderEditPhoneForm);

module.exports = router;