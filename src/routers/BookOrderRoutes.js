const Router = require('express').Router;
const BookOrderController = require('../controllers/BookOrderControllers');
const isAuthenticated = require('../middlewares/isAuthenticated');

const BookOrderRoutes = Router();

BookOrderRoutes.get('/', isAuthenticated, BookOrderController.getAllBookOrders);
BookOrderRoutes.get('/:id', isAuthenticated, BookOrderController.getBookOrderById);
BookOrderRoutes.post('/', isAuthenticated, BookOrderController.createBookOrder);
BookOrderRoutes.patch('/:id', isAuthenticated, BookOrderController.updateBookOrder);
BookOrderRoutes.delete('/:id', isAuthenticated, BookOrderController.deleteBookOrder);

module.exports = BookOrderRoutes;
