const { validationResult } = require('express-validator');
const LicenseService = require('../services/LicenseServices');
const { ApiError } = require('../errors/ApiError');
const { ValidationError } = require('../errors/ValidationError');
const { NotFoundError } = require('../errors/NotFoundError');

class LicenseController {

    async getAllLicenses(req, res, next) {
        try {
            const LicenseFilter = req.query;
            const licenses = await LicenseService.getAllLicenses(LicenseFilter);
            res.status(200).json(licenses);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }

    async getLicenseById(req, res, next) {
        const id = Number(req.params.id);
        try {
            const LicenseFilter=req.query
            const license = await LicenseService.getLicenseById(id,LicenseFilter);
            if (!license) {
                return next(new NotFoundError(`License with id ${id} not found.`));
            }
            res.status(200).json(license);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }

    async createLicense(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            const licenseData = req.body;
            const license = await LicenseService.createLicense(licenseData);
            res.status(201).json(license);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }

    async updateLicense(req, res, next) {
        const id = Number(req.params.id);
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            const licenseData = req.body;
            const license = await LicenseService.updateLicense(id, licenseData);
            if (!license) {
                return next(new NotFoundError(`License with id ${id} not found.`));
            }
            res.status(200).json(license);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }

    async deleteLicense(req, res, next) {
        const id = Number(req.params.id);
        try {
            const license = await LicenseService.deleteLicense(id);
            if (!license) { 
                return next(new NotFoundError(`License with id ${id} not found.`));
            }
            res.status(200).json(license);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }
}

module.exports = new LicenseController();
