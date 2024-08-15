const { ApiError } = require('./ApiError');

class ValidationError extends ApiError {
    constructor(message, errors, originalError) {
        super(400, 'ValidationError', message, originalError);
        if (errors) {
            this.errors = errors;
        }
    }

    // Override to include specific validation error details
    toResponseJSON() {
        const response = super.toResponseJSON();
        if (this.errors) {
            response.errors = this.errors; // Add the 'errors' field to the response
        }
        return response;
    }
}

module.exports = { ValidationError };
