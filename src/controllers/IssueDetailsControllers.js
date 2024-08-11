const { validationResult } = require('express-validator');
const IssueDetailsService = require('../services/IssueDetailsServices'); // Adjust this import to match your actual service file
const { ApiError } = require('../errors/ApiError');
const { ValidationError } = require('../errors/ValidationError');
const { NotFoundError } = require('../errors/NotFoundError');

class IssueDetailsController {

    async getAllIssueDetails(req, res, next) {
        try {
            const IssueDetailsFilter = req.query;
            const issueDetails = await IssueDetailsService.getAllIssueDetails(IssueDetailsFilter);
            res.status(200).json(issueDetails);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    async getIssueDetailsById(req, res, next) {
        const id = Number(req.params.id);
        try {
            const issueDetails = await IssueDetailsService.getIssueDetailsById(id);
            if (!issueDetails) {
                return next(new NotFoundError(`IssueDetails with id ${id} not found.`));
            }
            res.status(200).json(issueDetails);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    async createIssueDetails(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            const issueDetailsData = req.body;
            const issueDetails = await IssueDetailsService.createIssueDetails(issueDetailsData);
            res.status(201).json(issueDetails);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    async updateIssueDetails(req, res, next) {
        const id = Number(req.params.id);
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            const issueDetailsData = req.body;
            const issueDetails = await IssueDetailsService.updateIssueDetails(id, issueDetailsData);
            if (!issueDetails) {
                return next(new NotFoundError(`IssueDetails with id ${id} not found.`));
            }
            res.status(200).json(issueDetails);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    async deleteIssueDetails(req, res, next) {
        const id = Number(req.params.id);
        try {
            const issueDetails = await IssueDetailsService.deleteIssueDetails(id);
            if (!issueDetails) { 
                return next(new NotFoundError(`IssueDetails with id ${id} not found.`));
            }
            res.status(200).json(issueDetails);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }
}

module.exports = new IssueDetailsController();
