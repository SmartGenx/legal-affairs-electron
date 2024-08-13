const Router = require('express').Router;
const BookController = require('../controllers/BookControllers');
const isAuthenticated = require('../middlewares/isAuthenticated');

const BookRoutes = Router();

BookRoutes.get('/', isAuthenticated, BookController.getAllBooks);
BookRoutes.get('/:id', isAuthenticated, BookController.getBookById);
BookRoutes.post('/', isAuthenticated, BookController.createBook);
BookRoutes.patch('/:id', isAuthenticated, BookController.updateBook);
BookRoutes.delete('/:id', isAuthenticated, BookController.deleteBook);

module.exports = BookRoutes;
