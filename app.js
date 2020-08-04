// Require modules
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Import routes
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// Import helpers
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// Use middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/books', bookRoutes)
app.use('/api/reviews', reviewRoutes)

app.all('*', (req, res, next) => {
    const error = new AppError(`can't find ${req.originalUrl} on this server`, 404);
    next(error);
});
app.use(globalErrorHandler);

// Export app
module.exports = app;
