const { validationResult } = require('express-validator');
const StateIssueAgencyService = require('../services/StateIssueAgencyServices');
const { ApiError } = require('../errors/ApiError');
const { ValidationError } = require('../errors/ValidationError');
const { NotFoundError } = require('../errors/NotFoundError');

class StateIssueAgencyControllers {

    async getAllStateIssueAgencys(req, res, next) {
        try {
            const StateIssueAgencyFilter = req.query;
            const StateIssueAgencys = await StateIssueAgencyService.getAllStateIssueAgencys(StateIssueAgencyFilter);
            res.status(200).json(StateIssueAgencys);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }

    async getStateIssueAgencyById(req, res, next) {
        const id = Number(req.params.id);
        try {
            const StateIssueAgency = await StateIssueAgencyService.getStateIssueAgencyById(id);
            if (!StateIssueAgency) {
                return next(new NotFoundError(`StateIssueAgency with id ${id} not found.`));
            }
            res.status(200).json(StateIssueAgency);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }

    async createStateIssueAgency(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            const StateIssueAgencyData = req.body;
            const StateIssueAgency = await StateIssueAgencyService.createStateIssueAgency(StateIssueAgencyData);
            res.status(201).json(StateIssueAgency);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }

    async updateStateIssueAgency(req, res, next) {
        const id = Number(req.params.id);
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            const StateIssueAgencyData = req.body;
            const StateIssueAgency = await StateIssueAgencyService.updateStateIssueAgency(id, StateIssueAgencyData);
            if (!StateIssueAgency) {
                return next(new NotFoundError(`StateIssueAgency with id ${id} not found.`));
            }
            res.status(200).json(StateIssueAgency);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }

    async deleteStateIssueAgency(req, res, next) {
        const id = Number(req.params.id);
        try {
            const StateIssueAgency = await StateIssueAgencyService.deleteStateIssueAgency(id);
            if (!StateIssueAgency) {
                return next(new NotFoundError(`StateIssueAgency with id ${id} not found.`));
            }
            res.status(200).json(StateIssueAgency);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }
}

module.exports = new StateIssueAgencyControllers();
