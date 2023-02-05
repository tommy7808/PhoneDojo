import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from 'url';
import methodOverride from "method-override";
import engine from 'ejs-mate';
import morgan from "morgan";
import dotenv from 'dotenv';
import AppError from "./utils/AppError.js";
import phoneRoutes from './routes/phones.js';
import reviewRoutes from './routes/reviews.js'
import { errorLogger, errorHandler } from "./utils/errorHandler.js";

// Load environment variables
dotenv.config()

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
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));

// Middleware
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
    res.render('index.ejs', { title: 'Phone Dojo' });
});

app.use('/phones', phoneRoutes);
app.use('/phones/:phoneId/reviews', reviewRoutes);

// 404, matches any undefinded route without bias to HTTP method
app.all('*', (req, res, next) => {
    next(new AppError(404, '404 Page not found'));
});

app.use(errorLogger);
app.use(errorHandler);

app.listen(process.env.PORT || 8080, () => console.log(`Server running on http://localhost:${process.env.PORT || 8080}`));