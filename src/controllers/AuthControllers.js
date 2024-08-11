const { validationResult } = require('express-validator');
const { ApiError } = require('../errors/ApiError');
const { ValidationError } = require('../errors/ValidationError');
const AuthService = require('../services/AuthService');

class AuthController {
    async login(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            await AuthService.login(req, res, next);
        } catch (error) {
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }
}

module.exports = new AuthController();
