const { validationResult } = require('express-validator');
const Agencyervice = require('../services/Agencyervices');
const { ApiError } = require('../errors/ApiError');
const { ValidationError } = require('../errors/ValidationError');
const { NotFoundError } = require('../errors/NotFoundError');

class Agency {

    async getAllAgency(req, res, next) {
        try {
            const AgencyFilter = req.query;
            const Agency = await Agencyervice.getAllAgency(AgencyFilter);
            res.status(200).json(Agency);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }

    async getAgencyById(req, res, next) {
        const id = Number(req.params.id);
        try {
            const Agency = await Agencyervice.getAgencyById(id);
            if (!Agency) {
                return next(new NotFoundError(`Agency with id ${id} not found.`));
            }
            res.status(200).json(Agency);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }

    async createAgency(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            const AgencyData = req.body;
            const Agency = await Agencyervice.createAgency(AgencyData);
            res.status(201).json(Agency);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }

    async updateAgency(req, res, next) {
        const id = Number(req.params.id);
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            const AgencyData = req.body;
            const Agency = await Agencyervice.updateAgency(id, AgencyData);
            if (!Agency) {
                return next(new NotFoundError(`Agency with id ${id} not found.`));
            }
            res.status(200).json(Agency);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }

    async deleteAgency(req, res, next) {
        const id = Number(req.params.id);
        try {
            const Agency = await Agencyervice.deleteAgency(id);
            if (!Agency) {
                return next(new NotFoundError(`Agency with id ${id} not found.`));
            }
            res.status(200).json(Agency);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }
}

module.exports = new Agency();
