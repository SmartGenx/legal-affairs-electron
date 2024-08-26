const Router = require('express').Router;
const TribunalControllers = require('../controllers/TribunalControllers');
const isAuthenticated = require('../middlewares/isAuthenticated');

const TribunalRoutes = Router();

TribunalRoutes.get('/', isAuthenticated, TribunalControllers.getAllTribunals);
TribunalRoutes.get('/:id', isAuthenticated, TribunalControllers.getTribunalById);
TribunalRoutes.post('/', isAuthenticated, TribunalControllers.createTribunal);
TribunalRoutes.patch('/:id', isAuthenticated, TribunalControllers.updateTribunal);
TribunalRoutes.delete('/:id', isAuthenticated, TribunalControllers.deleteTribunal);

module.exports = TribunalRoutes;
