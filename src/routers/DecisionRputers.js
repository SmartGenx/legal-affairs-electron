const Router = require('express').Router;
const DecisionControllers = require('../controllers/DecisionControllers');
const DecisionRoutes = Router();
const isAuthenticated  = require('../middlewares/isAuthenticated');

DecisionRoutes.get('/', isAuthenticated ,DecisionControllers.getAllDecision);
DecisionRoutes.get('/:id', isAuthenticated, DecisionControllers.getDecisionById);
DecisionRoutes.post('/', isAuthenticated, DecisionControllers.createDecision);
DecisionRoutes.patch('/:id', isAuthenticated, DecisionControllers.updateDecision);
DecisionRoutes.delete('/:id', isAuthenticated, DecisionControllers.deleteDecision);

module.exports = DecisionRoutes;
