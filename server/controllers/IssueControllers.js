const { validationResult } = require('express-validator');
const IssueService = require('../services/IssueService'); // Adjust this import to match your actual service file
const { ApiError } = require('../errors/ApiError');
const { ValidationError } = require('../errors/ValidationError');
const { NotFoundError } = require('../errors/NotFoundError');
class IssueController{

    async getAllIssue(req, res, next) {
        try {
            const IssueFilter = req.query;
            const Issue = await IssueService.getAllIssue(IssueFilter);
            res.status(200).json(Issue);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    async getIssueById(req, res, next) {
        const id = Number(req.params.id);
        try {
            const Issue = await IssueService.getIssueById(id);
            if (!Issue) {
                return next(new NotFoundError(`Issue with id ${id} not found.`));
            }
            res.status(200).json(Issue);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    async createIssue(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            const IssueData = req.body;
            const Issue = await IssueService.createIssue(IssueData);
            res.status(201).json(Issue);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    async updateIssue(req, res, next) {
        const id = Number(req.params.id);
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            const IssueData = req.body;
            const Issue = await IssueService.updateIssue(id, IssueData);
            if (!Issue) {
                return next(new NotFoundError(`Issue with id ${id} not found.`));
            }
            res.status(200).json(Issue);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    async deleteIssue(req, res, next) {
        const id = Number(req.params.id);
        try {
            const Issue = await IssueService.deleteIssue(id);
            if (!Issue) { 
                return next(new NotFoundError(`Issue with id ${id} not found.`));
            }
            res.status(200).json(Issue);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }
}
module.exports=new IssueController()