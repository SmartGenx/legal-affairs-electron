const { validationResult } = require('express-validator');
const LeaveAllocationService = require('../services/LeaveAllocationServices');
const { ApiError } = require('../errors/ApiError');
const { ValidationError } = require('../errors/ValidationError');
const { NotFoundError } = require('../errors/NotFoundError');

class LeaveAllocationController {

    async getAllLeaveAllocations(req, res, next) {
        try {
            const filter = req.query;
            const leaveAllocations = await LeaveAllocationService.getAllLeaveAllocations(filter);
            res.status(200).json(leaveAllocations);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    async getLeaveAllocationById(req, res, next) {
        const id = Number(req.params.id);
        try {
            const leaveAllocation = await LeaveAllocationService.getLeaveAllocationById(id);
            if (!leaveAllocation) {
                return next(new NotFoundError(`LeaveAllocation with id ${id} not found.`));
            }
            res.status(200).json(leaveAllocation);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    async createLeaveAllocation(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            const leaveAllocationData = req.body;
            const leaveAllocation = await LeaveAllocationService.createLeaveAllocation(leaveAllocationData);
            res.status(201).json(leaveAllocation);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    async updateLeaveAllocation(req, res, next) {
        const id = Number(req.params.id);
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            const leaveAllocationData = req.body;
            const leaveAllocation = await LeaveAllocationService.updateLeaveAllocation(id, leaveAllocationData);
            if (!leaveAllocation) {
                return next(new NotFoundError(`LeaveAllocation with id ${id} not found.`));
            }
            res.status(200).json(leaveAllocation);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    async deleteLeaveAllocation(req, res, next) {
        const id = Number(req.params.id);
        try {
            const leaveAllocation = await LeaveAllocationService.deleteLeaveAllocation(id);
            if (!leaveAllocation) {
                return next(new NotFoundError(`LeaveAllocation with id ${id} not found.`));
            }
            res.status(200).json(leaveAllocation);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }
}

module.exports = new LeaveAllocationController();
