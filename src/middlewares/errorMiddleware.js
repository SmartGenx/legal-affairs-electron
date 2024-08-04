const { ApiError } = require('../errors/ApiError');

function errorMiddleware(error, req, res, next) {
    if (error instanceof ApiError) {
        // Custom error handling for API-specific errors
        res.status(error.statusCode).json(error.toResponseJSON());
    } else {
        // Catch-all for other unexpected errors
        console.error('Unexpected error:', error);
        res.status(500).json({ status: 'error', message: 'An unexpected error occurred.' });
    }
}

module.exports = { errorMiddleware };
