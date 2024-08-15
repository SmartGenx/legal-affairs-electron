const Router = require('express').Router;
const GovernmentOfficeController = require('../controllers/GovernmentOfficeController');
const GovernmentOfficeRoutes = Router();
const isAuthenticated  = require('../middlewares/isAuthenticated');

GovernmentOfficeRoutes.get('/', isAuthenticated ,GovernmentOfficeController.getAllGovernmentOffice);
GovernmentOfficeRoutes.get('/:id', isAuthenticated, GovernmentOfficeController.getGovernmentOfficeById);
GovernmentOfficeRoutes.post('/', isAuthenticated, GovernmentOfficeController.createGovernmentOffice);
GovernmentOfficeRoutes.patch('/:id', isAuthenticated, GovernmentOfficeController.updateGovernmentOffice);
GovernmentOfficeRoutes.delete('/:id', isAuthenticated, GovernmentOfficeController.deleteGovernmentOffice);

module.exports = GovernmentOfficeRoutes;
