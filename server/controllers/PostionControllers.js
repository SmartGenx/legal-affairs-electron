const { validationResult } = require('express-validator');
const PostionService = require('../services/PostionService'); // Adjust this import to match your actual service file
const { ApiError } = require('../errors/ApiError');
const { ValidationError } = require('../errors/ValidationError');
const { NotFoundError } = require('../errors/NotFoundError');
class PostionController{

    async getAllPostion(req, res, next) {
        try {
            const PostionFilter = req.query;
            const Postion = await PostionService.getAllPostion(PostionFilter);
            res.status(200).json(Postion);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    async getPostionById(req, res, next) {
        const id = Number(req.params.id);
        try {
            const Postion = await PostionService.getPostionById(id);
            if (!Postion) {
                return next(new NotFoundError(`Postion with id ${id} not found.`));
            }
            res.status(200).json(Postion);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    async createPostion(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            const PostionData = req.body;
            const Postion = await PostionService.createPostion(PostionData);
            res.status(201).json(Postion);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    async updatePostion(req, res, next) {
        const id = Number(req.params.id);
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            const PostionData = req.body;
            const Postion = await PostionService.updatePostion(id, PostionData);
            if (!Postion) {
                return next(new NotFoundError(`Postion with id ${id} not found.`));
            }
            res.status(200).json(Postion);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }

    async deletePostion(req, res, next) {
        const id = Number(req.params.id);
        try {
            const Postion = await PostionService.deletePostion(id);
            if (!Postion) { 
                return next(new NotFoundError(`Postion with id ${id} not found.`));
            }
            res.status(200).json(Postion);
        } catch (error) {
            console.log(error);
            next(new ApiError(500, 'InternalServer', `${error}`));
        }
    }
}
module.exports=new PostionController()