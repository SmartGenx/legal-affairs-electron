const { validationResult } = require('express-validator');
const ComplaintService = require('../services/ComplaintServices'); // Adjust this import to match your actual service file
const { ApiError } = require('../errors/ApiError');
const { ValidationError } = require('../errors/ValidationError');
const { NotFoundError } = require('../errors/NotFoundError');

class ComplaintController {

    async getAllComplaints(req, res, next) {
        try {
            const complaintFilter = req.query;
            const complaints = await ComplaintService.getAllComplaints(complaintFilter);
            res.status(200).json(complaints);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    async getComplaintById(req, res, next) {
        const id = Number(req.params.id);
        try {
            const complaint = await ComplaintService.getComplaintById(id);
            if (!complaint) {
                return next(new NotFoundError(`Complaint with id ${id} not found.`));
            }
            res.status(200).json(complaint);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    async createComplaint(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            const complaintData = req.body;
            const complaint = await ComplaintService.createComplaint(complaintData);
            res.status(201).json(complaint);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    async updateComplaint(req, res, next) {
        const id = Number(req.params.id);
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            const complaintData = req.body;
            const complaint = await ComplaintService.updateComplaint(id, complaintData);
            if (!complaint) {
                return next(new NotFoundError(`Complaint with id ${id} not found.`));
            }
            res.status(200).json(complaint);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    async deleteComplaint(req, res, next) {
        const id = Number(req.params.id);
        try {
            const complaint = await ComplaintService.deleteComplaint(id);
            if (!complaint) { 
                return next(new NotFoundError(`Complaint with id ${id} not found.`));
            }
            res.status(200).json(complaint);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }
}

module.exports = new ComplaintController();
