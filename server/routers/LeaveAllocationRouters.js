const Router = require('express').Router;
const LeaveAllocationController = require('../controllers/LeaveAllocationControllers');
const LeaveAllocationRoutes = Router();
const isAuthenticated = require('../middlewares/isAuthenticated');

LeaveAllocationRoutes.get('/', isAuthenticated, LeaveAllocationController.getAllLeaveAllocations);
LeaveAllocationRoutes.get('/:id', isAuthenticated, LeaveAllocationController.getLeaveAllocationById);
LeaveAllocationRoutes.post('/', isAuthenticated, LeaveAllocationController.createLeaveAllocation);
LeaveAllocationRoutes.patch('/:id', isAuthenticated, LeaveAllocationController.updateLeaveAllocation);
LeaveAllocationRoutes.delete('/:id', isAuthenticated, LeaveAllocationController.deleteLeaveAllocation);

module.exports = LeaveAllocationRoutes;
