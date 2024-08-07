// The base class for handling API errors. Other error types should extend this class.

class ApiError extends Error {
    constructor(statusCode, type, message, originalError) {
        super(message);
        this.statusCode = statusCode;
        this.type = type;
        this.originalError = originalError;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
    }

    toResponseJSON() {
        return {
            status: "error",
            statusCode: this.statusCode,
            message: this.message,
            // Ensure no sensitive details are included, especially from `originalError`
        };
    }
}

module.exports = { ApiError };
