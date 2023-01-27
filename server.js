import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from 'url';
import methodOverride from "method-override";
import engine from 'ejs-mate';
// Middleware that logs http requests
import morgan from "morgan";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config()

import Phone from "./models/phone.js"
import Review from './models/review.js';
import AppError from "./utils/AppError.js";

// These global variables are not available in modules (ES6)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to database
const connectToDb = async () => {
    try {
        await mongoose.connect(`${process.env.DATABASE_URL}/phone-store`);
        console.log('Connected to database')
    } catch (error) {
        console.log('Failed to connect to database');
        console.log(error);
    }
}

connectToDb();

const app = express();

// Server configurations
// Set template enging, allows us to use code blocks like django
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));

// Middleware
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

const formatCheckBox = (req, res, next) => {
    // HTML checkboxes return string values so must be converted to boolean to match schema
    req.body.available = req.body.available ? true : false;
    next();
};

// Error handlers always have these 4 parameters
const errorLogger = (err, req, res, next) => {
    console.log(err.stack);
    if (err.name === 'ValidationError') err = new AppError(400, err.message);
    if (err.name === 'CastError') err = new AppError(400, 'Cast Error: Phone ID must be exactly 24 characters long');
    next(err);
};

const errorHandler = (err, req, res, next) => {
    const { status = 500, message = 'Oops Something went wrong' } = err;
    res.status(status).render('error', { status, message, title: 'Error' });
}

// Routes
app.get('/', (req, res) => {
    res.render('index.ejs', { title: 'Phone Dojo' });
});

// Read all phones
app.get('/phones', async (req, res, next) => {
    try {
        const phones = await Phone.find({});
        res.render('phones/phones', { phones, title: 'Phones' });
    } catch (err) {
        // This will send it to the next error handler, express handler if none defined
        next(err);
    }
});

// Create
app.post('/phones', formatCheckBox, async (req, res, next) => { 
    console.log(req.body);
    try {
        const phone = new Phone(req.body);
        await phone.save();
        res.redirect('/phones');
    } catch (err) {
        next(err);
    }
});

// New phone form
app.get('/phones/new', (req, res) => res.render('phones/new-phone', { title: 'New Phone' }));

// Read phone
app.get('/phones/:id', async (req, res, next) => {
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
app.put('/phones/:id', formatCheckBox, async (req, res, next) => {
    console.log(req.body);
    try {
        const { id } = req.params;
        await Phone.findByIdAndUpdate(id, req.body, { runValidators: true });
        res.redirect(`/phones/${id}`);
    } catch (err) {
        next(err);
    }
});

// Delete
app.delete('/phones/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await Phone.findByIdAndDelete(id);
        res.redirect('/phones');
    } catch (err) {
        next(err);
    }
});

// Edit form
app.get('/phones/:id/edit', async (req, res, next) => {
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

app.post('/phones/:id/reviews', async (req, res, next) => {
    try { 
        const { id } = req.params;
        const phone = await Phone.findById(id);
        if (!phone) {
            throw new AppError(404, 'Phone not found');
        }
        const review = new Review(req.body);
        await review.save();
        phone.reviews.push(review);
        await phone.save();
        res.redirect(`/phones/${id}`);
    } catch (err) {
        next(err);
    }
})

// 404, matches any undefinded route without bias to HTTP method
app.all('*', (req, res, next) => {
    next(new AppError(404, '404 Page not found'));
});

app.use(errorLogger);
app.use(errorHandler);

app.listen(process.env.PORT || 8080, () => console.log(`Server running on http://localhost:${process.env.PORT || 8080}`));