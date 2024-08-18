const { validationResult } = require('express-validator');
const LicenseTypeService = require('../services/LicenseTypeServices');
const { ApiError } = require('../errors/ApiError');
const { ValidationError } = require('../errors/ValidationError');
const { NotFoundError } = require('../errors/NotFoundError');

class LicenseTypeController {

    async getAllLicenseTypes(req, res, next) {
        try {
            const LicenseTypeFilter = req.query;
            const licenseTypes = await LicenseTypeService.getAllLicenseTypes(LicenseTypeFilter);
            res.status(200).json(licenseTypes);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }

    async getLicenseTypeById(req, res, next) {
        const id = Number(req.params.id);
        try {
            const licenseType = await LicenseTypeService.getLicenseTypeById(id);
            if (!licenseType) {
                return next(new NotFoundError(`LicenseType with id ${id} not found.`));
            }
            res.status(200).json(licenseType);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }

    async createLicenseType(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            const licenseTypeData = req.body;
            const licenseType = await LicenseTypeService.createLicenseType(licenseTypeData);
            res.status(201).json(licenseType);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }

    async updateLicenseType(req, res, next) {
        const id = Number(req.params.id);
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            const licenseTypeData = req.body;
            const licenseType = await LicenseTypeService.updateLicenseType(id, licenseTypeData);
            if (!licenseType) {
                return next(new NotFoundError(`LicenseType with id ${id} not found.`));
            }
            res.status(200).json(licenseType);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }

    async deleteLicenseType(req, res, next) {
        const id = Number(req.params.id);
        try {
            const licenseType = await LicenseTypeService.deleteLicenseType(id);
            if (!licenseType) { 
                return next(new NotFoundError(`LicenseType with id ${id} not found.`));
            }
            res.status(200).json(licenseType);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }
}

module.exports = new LicenseTypeController();
