const { validationResult } = require('express-validator');
const BookService = require('../services/BookServices');
const { ApiError } = require('../errors/ApiError');
const { ValidationError } = require('../errors/ValidationError');
const { NotFoundError } = require('../errors/NotFoundError');

class BookController {

    async getAllBooks(req, res, next) {
        try {
            const BookFilter = req.query;
            const books = await BookService.getAllBooks(BookFilter);
            res.status(200).json(books);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }

    async getBookById(req, res, next) {
        const id = Number(req.params.id);
        try {
            const book = await BookService.getBookById(id);
            if (!book) {
                return next(new NotFoundError(`Book with id ${id} not found.`));
            }
            res.status(200).json(book);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }

    async createBook(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            const bookData = req.body;
            const book = await BookService.createBook(bookData);
            res.status(201).json(book);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }

    async updateBook(req, res, next) {
        const id = Number(req.params.id);
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ValidationError('Validation Failed', errors.array()));
            }
            const bookData = req.body;
            const book = await BookService.updateBook(id, bookData);
            if (!book) {
                return next(new NotFoundError(`Book with id ${id} not found.`));
            }
            res.status(200).json(book);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }

    async deleteBook(req, res, next) {
        const id = Number(req.params.id);
        try {
            const book = await BookService.deleteBook(id);
            if (!book) {
                return next(new NotFoundError(`Book with id ${id} not found.`));
            }
            res.status(200).json(book);
        } catch (error) {
            console.error(error);
            next(new ApiError(500, 'Internal Server Error', `${error.message}`));
        }
    }
}

module.exports = new BookController();
