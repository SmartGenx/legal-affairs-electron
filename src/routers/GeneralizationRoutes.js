const Router = require('express').Router;
const GeneralizationContrllers = require('../controllers/GeneralizationContrllers');
const GeneralizationRoutes = Router();
const isAuthenticated  = require('../middlewares/isAuthenticated');

GeneralizationRoutes.get('/', isAuthenticated ,GeneralizationContrllers.getAllgeneralization);
GeneralizationRoutes.get('/:id', isAuthenticated, GeneralizationContrllers.getgeneralizationById);
GeneralizationRoutes.post('/', isAuthenticated, GeneralizationContrllers.creategeneralization);
GeneralizationRoutes.patch('/:id', isAuthenticated, GeneralizationContrllers.updategeneralization);
GeneralizationRoutes.delete('/:id', isAuthenticated, GeneralizationContrllers.deletegeneralization);

module.exports = GeneralizationRoutes;
