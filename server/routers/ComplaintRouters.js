const Router = require('express').Router;
const ComplaintController = require('../controllers/ComplaintControllers');
const ComplaintRoutes = Router();
const isAuthenticated = require('../middlewares/isAuthenticated');

ComplaintRoutes.get('/', isAuthenticated, ComplaintController.getAllComplaints);
ComplaintRoutes.get('/:id', isAuthenticated, ComplaintController.getComplaintById);
ComplaintRoutes.post('/', isAuthenticated, ComplaintController.createComplaint);
ComplaintRoutes.patch('/:id', isAuthenticated, ComplaintController.updateComplaint);
ComplaintRoutes.delete('/:id', isAuthenticated, ComplaintController.deleteComplaint);

module.exports = ComplaintRoutes;
