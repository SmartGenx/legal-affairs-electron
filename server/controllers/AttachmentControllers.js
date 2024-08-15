const { validationResult } = require('express-validator');
const AttachmentService = require('../services/AttachmentServices');
const { ApiError } = require('../errors/ApiError');
const { ValidationError } = require('../errors/ValidationError');
const { NotFoundError } = require('../errors/NotFoundError');

class AttachmentController {

    async getAllAttachments(req, res, next) {
        try {
            const AttachmentFilter = req.query;
            const attachments = await AttachmentService.getAllAttachments(AttachmentFilter);
            res.status(200).json(attachments);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }

    async getAttachmentById(req, res, next) {
        const id = Number(req.params.id);
        try {
            const attachment = await AttachmentService.getAttachmentById(id);
            if (!attachment) {
                return next(new NotFoundError(`Attachment with id ${id} not found.`));
            }
            res.status(200).json(attachment);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }

    async createAttachment(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            const AttachmentData = req.body;
            let filePath = '';

            if (req.file) {
                filePath = `${req.file.local}`;
            }
            const attachment = await AttachmentService.createAttachment(AttachmentData, filePath);
            res.status(201).json(attachment);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }

    async updateAttachment(req, res, next) {
        const id = Number(req.params.id);
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            let filePath = '';
            
            if (req.file) {
                filePath = `${req.file.local}-attachment`;
            }

            const AttachmentData = req.body;
            const attachment = await AttachmentService.updateAttachment(id, AttachmentData, filePath);
            if (!attachment) {
                return next(new NotFoundError(`Attachment with id ${id} not found.`));
            }
            res.status(200).json(attachment);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }

    async deleteAttachment(req, res, next) {
        const id = Number(req.params.id);
        try {
            const attachment = await AttachmentService.deleteAttachment(id);
            if (!attachment) { 
                return next(new NotFoundError(`Attachment with id ${id} not found.`));
            }
            res.status(200).json(attachment);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }
}

module.exports = new AttachmentController();
