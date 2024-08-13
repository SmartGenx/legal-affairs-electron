const Router = require('express').Router;
const LeaveDetailsController = require('../controllers/LeaveDetailsControllers');
const isAuthenticated = require('../middlewares/isAuthenticated');

const LeaveDetailsRoutes = Router();

// Define routes for leave details
LeaveDetailsRoutes.get('/', isAuthenticated, LeaveDetailsController.getAllLeaveDetails);
LeaveDetailsRoutes.get('/:id', isAuthenticated, LeaveDetailsController.getLeaveDetailsById);
LeaveDetailsRoutes.post('/', isAuthenticated, LeaveDetailsController.createLeaveDetails);
LeaveDetailsRoutes.patch('/:id', isAuthenticated, LeaveDetailsController.updateLeaveDetails);
LeaveDetailsRoutes.delete('/:id', isAuthenticated, LeaveDetailsController.deleteLeaveDetails);

module.exports = LeaveDetailsRoutes;
