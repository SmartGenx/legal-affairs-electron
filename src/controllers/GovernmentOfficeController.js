const { validationResult } = require('express-validator');
const GovernmentOfficeService = require('../services/GovernmentOfficeServic'); // Adjust this import to match your actual service file
const { ApiError } = require('../errors/ApiError');
const { ValidationError } = require('../errors/ValidationError');
const { NotFoundError } = require('../errors/NotFoundError');
class GovernmentOfficeController{

    async getAllGovernmentOffice(req, res, next) {
        try {
            const GovernmentOfficeFilter = req.query;
            const GovernmentOffice = await GovernmentOfficeService.getAllGovernmentOffice(GovernmentOfficeFilter);
            res.status(200).json(GovernmentOffice);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    async getGovernmentOfficeById(req, res, next) {
        const id = Number(req.params.id);
        try {
            const GovernmentOffice = await GovernmentOfficeService.getGovernmentOfficeById(id);
            if (!GovernmentOffice) {
                return next(new NotFoundError(`GovernmentOffice with id ${id} not found.`));
            }
            res.status(200).json(GovernmentOffice);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    async createGovernmentOffice(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            const GovernmentOfficeData = req.body;
            const GovernmentOffice = await GovernmentOfficeService.createGovernmentOffice(GovernmentOfficeData);
            res.status(201).json(GovernmentOffice);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    async updateGovernmentOffice(req, res, next) {
        const id = Number(req.params.id);
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            const GovernmentOfficeData = req.body;
            const GovernmentOffice = await GovernmentOfficeService.updateGovernmentOffice(id,GovernmentOfficeData);
            if (!GovernmentOffice) {
                return next(new NotFoundError(`GovernmentOffice with id ${id} not found.`));
            }
            res.status(200).json(GovernmentOffice);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    async deleteGovernmentOffice(req, res, next) {
        const id = Number(req.params.id);
        try {
            const GovernmentOffice = await GovernmentOfficeService.deleteGovernmentOffice(id);
            if (!GovernmentOffice) { 
                return next(new NotFoundError(`GovernmentOffice with id ${id} not found.`));
            }
            res.status(200).json(GovernmentOffice);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }
}
module.exports=new GovernmentOfficeController()