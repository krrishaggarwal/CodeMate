// Custom error-handling middleware
const errorHandler = (err, req, res, next) => {
    // Set default status code and message
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    // Handle duplicate key error (e.g., email already exists)
    if (err.code && err.code === 11000) {
        statusCode = 400;
        message = `Duplicate field value: ${Object.keys(err.keyValue).join(', ')} already exists`;
    }

    // Handle cast errors (e.g., invalid MongoDB ObjectId)
    if (err.name === 'CastError') {
        statusCode = 404;
        message = `Resource not found with id: ${err.value}`;
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};

module.exports = errorHandler;
