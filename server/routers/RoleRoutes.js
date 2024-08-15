const Router = require('express').Router;
const RoleController = require('../controllers/RoleControllers');
const RoleRoutes = Router();
const isAuthenticated  = require('../middlewares/isAuthenticated');

RoleRoutes.get('/', isAuthenticated ,RoleController.getAllRoles);
RoleRoutes.get('/:id', RoleController.getRoleById);
RoleRoutes.post('/', RoleController.createRole);
RoleRoutes.patch('/:id', RoleController.updateRole);

module.exports = RoleRoutes;
