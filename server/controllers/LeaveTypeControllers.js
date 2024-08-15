const { validationResult } = require('express-validator');
const LeaveTypeServices = require('../services/LeaveTypeServices'); // Adjust this import to match your actual service file
const { ApiError } = require('../errors/ApiError');
const { ValidationError } = require('../errors/ValidationError');
const { NotFoundError } = require('../errors/NotFoundError');
class LeaveTypeControllers{

    async getAllleaveType(req, res, next) {
        try {
            const leaveTypeFilter = req.query;
            const leaveType = await LeaveTypeServices.getAllleaveType(leaveTypeFilter);
            res.status(200).json(leaveType);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    async getleaveTypeById(req, res, next) {
        const id = Number(req.params.id);
        try {
            const leaveType = await LeaveTypeServices.getleaveTypeById(id);
            if (!leaveType) {
                return next(new NotFoundError(`leaveType with id ${id} not found.`));
            }
            res.status(200).json(leaveType);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    async createleaveType(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            const leaveTypeData = req.body;
         
            const leaveType = await LeaveTypeServices.createleaveType(leaveTypeData);
            res.status(201).json(leaveType);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    async updateleaveType(req, res, next) {
        const id = Number(req.params.id);
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
  
            
            const leaveTypeData = req.body;
            const leaveType = await LeaveTypeServices.updateleaveType(id,leaveTypeData);
            if (!leaveType) {
                return next(new NotFoundError(`leaveType with id ${id} not found.`));
            }
            res.status(200).json(leaveType);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    async deleteleaveType(req, res, next) {
        const id = Number(req.params.id);
        try {
            const leaveType = await LeaveTypeServices.deleteleaveType(id);
            if (!leaveType) { 
                return next(new NotFoundError(`leaveType with id ${id} not found.`));
            }
            res.status(200).json(leaveType);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }
}
module.exports=new LeaveTypeControllers()