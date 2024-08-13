const { validationResult } = require('express-validator');
const BookOrderService = require('../services/BookOrderServices');
const { ApiError } = require('../errors/ApiError');
const { ValidationError } = require('../errors/ValidationError');
const { NotFoundError } = require('../errors/NotFoundError');

class BookOrderController {

    async getAllBookOrders(req, res, next) {
        try {
            const BookOrderFilter = req.query;
            const bookOrders = await BookOrderService.getAllBookOrders(BookOrderFilter);
            res.status(200).json(bookOrders);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }

    async getBookOrderById(req, res, next) {
        const id = Number(req.params.id);
        try {
            const bookOrder = await BookOrderService.getBookOrderById(id);
            if (!bookOrder) {
                return next(new NotFoundError(`BookOrder with id ${id} not found.`));
            }
            res.status(200).json(bookOrder);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }

    async createBookOrder(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            const bookOrderData = req.body;
            const bookOrder = await BookOrderService.createBookOrder(bookOrderData);
            res.status(201).json(bookOrder);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }

    async updateBookOrder(req, res, next) {
        const id = Number(req.params.id);
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            const bookOrderData = req.body;
            const bookOrder = await BookOrderService.updateBookOrder(id, bookOrderData);
            if (!bookOrder) {
                return next(new NotFoundError(`BookOrder with id ${id} not found.`));
            }
            res.status(200).json(bookOrder);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }

    async deleteBookOrder(req, res, next) {
        const id = Number(req.params.id);
        try {
            const bookOrder = await BookOrderService.deleteBookOrder(id);
            if (!bookOrder) {
                return next(new NotFoundError(`BookOrder with id ${id} not found.`));
            }
            res.status(200).json(bookOrder);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }
}

module.exports = new BookOrderController();
