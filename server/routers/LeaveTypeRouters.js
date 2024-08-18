const Router = require('express').Router;
const LeaveTypeControllers = require('../controllers/LeaveTypeControllers');
const LeaveTypeRoutes = Router();
const isAuthenticated  = require('../middlewares/isAuthenticated');

LeaveTypeRoutes.get('/', isAuthenticated ,LeaveTypeControllers.getAllleaveType);
LeaveTypeRoutes.get('/:id', isAuthenticated, LeaveTypeControllers.getleaveTypeById);
LeaveTypeRoutes.post('/', isAuthenticated, LeaveTypeControllers.createleaveType)
LeaveTypeRoutes.patch('/:id', isAuthenticated, LeaveTypeControllers.updateleaveType);
LeaveTypeRoutes.delete('/:id', isAuthenticated, LeaveTypeControllers.deleteleaveType);

module.exports = LeaveTypeRoutes;
