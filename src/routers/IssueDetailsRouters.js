const Router = require('express').Router;
const IssueDetailsController = require('../controllers/IssueDetailsControllers');
const IssueDetailsRoutes = Router();
const isAuthenticated = require('../middlewares/isAuthenticated');

IssueDetailsRoutes.get('/', isAuthenticated, IssueDetailsController.getAllIssueDetails);
IssueDetailsRoutes.get('/:id', isAuthenticated, IssueDetailsController.getIssueDetailsById);
IssueDetailsRoutes.post('/', isAuthenticated, IssueDetailsController.createIssueDetails);
IssueDetailsRoutes.patch('/:id', isAuthenticated, IssueDetailsController.updateIssueDetails);
IssueDetailsRoutes.delete('/:id', isAuthenticated, IssueDetailsController.deleteIssueDetails);

module.exports = IssueDetailsRoutes;
