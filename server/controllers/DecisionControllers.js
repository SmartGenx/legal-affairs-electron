const { validationResult } = require('express-validator');
const DecisionServices = require('../services/DecisionServices'); // Adjust this import to match your actual service file
const { ApiError } = require('../errors/ApiError');
const { ValidationError } = require('../errors/ValidationError');
const { NotFoundError } = require('../errors/NotFoundError');
class DecisionControllers{

    async getAllDecision(req, res, next) {
        try {
            const DecisionFilter = req.query;
            const Decision = await DecisionServices.getAllDecision(DecisionFilter);
            res.status(200).json(Decision);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    async getDecisionById(req, res, next) {
        const id = Number(req.params.id);
        try {
            const Decision = await DecisionServices.getDecisionById(id);
            if (!Decision) {
                return next(new NotFoundError(`Decision with id ${id} not found.`));
            }
            res.status(200).json(Decision);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    async createDecision(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            const DecisionData = req.body;
            let filePath = '';

            if (req.file) {
                filePath = `${req.file.local}`;
            }
            const Decision = await DecisionServices.createDecision(DecisionData, filePath);
            res.status(201).json(Decision);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    async updateDecision(req, res, next) {
        const id = Number(req.params.id);
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            let filePath = '';
            
            if (req.file) {
                filePath = `${req.file.local}-decision`;
            }
            console.log("🚀 ~ DecisionControllers ~ updateDecision ~ filePath:", filePath)
            
            const DecisionData = req.body;
            const Decision = await DecisionServices.updateDecision(id,DecisionData,filePath);
            if (!Decision) {
                return next(new NotFoundError(`Decision with id ${id} not found.`));
            }
            res.status(200).json(Decision);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    async deleteDecision(req, res, next) {
        const id = Number(req.params.id);
        try {
            const Decision = await DecisionServices.deleteDecision(id);
            if (!Decision) { 
                return next(new NotFoundError(`Decision with id ${id} not found.`));
            }
            res.status(200).json(Decision);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }
}
module.exports=new DecisionControllers()