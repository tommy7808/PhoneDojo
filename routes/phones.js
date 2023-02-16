const { Router } = require('express');
const { storage } = require('../cloudinary/index');
// Multer is middleware for parsing request bodys with files.
const multer = require('multer');
// Specify where uploaded files will be stored.
const upload = multer({ storage });
const { renderPhones, createPhone, renderNewPhoneForm, renderPhone, updatePhone, deletePhone, renderEditPhoneForm } = require('../controllers/phones');
const { isLoggedIn, formatCheckBox, isAuthorised } = require('../utils/middleware');

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

module.exports = router;