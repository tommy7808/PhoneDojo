import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from 'url';
import methodOverride from "method-override";
import engine from 'ejs-mate';
import morgan from "morgan";
import session from "express-session";
import flash from 'connect-flash';
import passport from "passport";
import localStrategy from 'passport-local';
import dotenv from 'dotenv';

import AppError from "./utils/AppError.js";
import phoneRoutes from './routes/phones.js';
import reviewRoutes from './routes/reviews.js'
import authRoutes from './routes/auth.js';
import { errorLogger, errorHandler } from "./utils/middleware.js";
import User from "./models/user.js";

if (process.env.NODE_ENV !== 'production') {
    // Load environment variables
    dotenv.config();
}

// These global variables are not available in modules (ES6)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to database
const connectToDb = async () => {
    try {
        mongoose.set('strictQuery', true);
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
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));
app.use(express.static(path.join(__dirname, 'public')));
const sessionOptions = {
    secret: 'testSecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        // Cookie expires after one week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionOptions));
app.use(flash());


// Middleware
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.user = req.user;
    next();
});

// Routes
app.get('/', (req, res) => {
    res.render('index.ejs', { title: 'Phone Dojo' });
});

app.use('/', authRoutes);
app.use('/phones', phoneRoutes);
app.use('/phones/:phoneId/reviews', reviewRoutes);

// 404, matches any undefinded route without bias to HTTP method
app.all('*', (req, res, next) => {
    next(new AppError(404, '404 Page not found'));
});

app.use(errorLogger);
app.use(errorHandler);

app.listen(process.env.PORT || 8080, () => console.log(`Server running on http://localhost:${process.env.PORT || 8080}`));