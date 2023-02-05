import express from 'express';
import Phone from '../models/phone.js';
import AppError from '../utils/AppError.js';

// Middleware
const formatCheckBox = (req, res, next) => {
    // HTML checkboxes return string values so must be converted to boolean to match schema
    req.body.available = req.body.available ? true : false;
    next();
};

const router = express.Router();

// Read all phones
router.get('/', async (req, res, next) => {
    try {
        const phones = await Phone.find({});
        res.render('phones/phones', { phones, title: 'Phones' });
    } catch (err) {
        // This will send it to the next error handler, express handler if none defined
        next(err);
    }
});

// Create
router.post('/', formatCheckBox, async (req, res, next) => {
    try {
        const phone = new Phone(req.body);
        await phone.save();
        res.redirect('/phones');
    } catch (err) {
        next(err);
    }
});

// New phone form
router.get('/new', (req, res) => res.render('phones/new-phone', { title: 'New Phone' }));

// Read phone
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const phone = await Phone.findById(id).populate('reviews');
        // Handle error when phone is not found
        if (!phone) {
            throw new AppError(404, 'Phone not found');
        }
        res.render('phones/phone', { phone, title: phone.name });
    } catch (err) {
        next(err);
    }
});

// Update
router.put('/:id', formatCheckBox, async (req, res, next) => {
    try {
        const { id } = req.params;
        await Phone.findByIdAndUpdate(id, req.body, { runValidators: true });
        res.redirect(`/phones/${id}`);
    } catch (err) {
        next(err);
    }
});

// Delete
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await Phone.findByIdAndDelete(id);
        res.redirect('/phones');
    } catch (err) {
        next(err);
    }
});

// Edit form
router.get('/:id/edit', async (req, res, next) => {
    try {
        const memories = Phone.schema.obj.memory.enum;
        const storages = Phone.schema.obj.storage.enum;
        const { id } = req.params;
        const phone = await Phone.findById(id);
        if (!phone) {
            throw new AppError(404, 'Phone not found');
        }
        res.render('phones/edit', { phone, memories, storages, title: 'Edit' });
    } catch (err) {
        next(err);
    }
});

export default router;