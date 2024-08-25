const Router = require('express').Router;
const StateIssueAgencyControllers = require('../controllers/StateIssueAgencyControllers');
const isAuthenticated = require('../middlewares/isAuthenticated');

const StateIssueAgencyRoutes = Router();

StateIssueAgencyRoutes.get('/', isAuthenticated, StateIssueAgencyControllers.getAllStateIssueAgencys);
StateIssueAgencyRoutes.get('/:id', isAuthenticated, StateIssueAgencyControllers.getStateIssueAgencyById);
StateIssueAgencyRoutes.post('/', isAuthenticated, StateIssueAgencyControllers.createStateIssueAgency);
StateIssueAgencyRoutes.patch('/:id', isAuthenticated, StateIssueAgencyControllers.updateStateIssueAgency);
StateIssueAgencyRoutes.delete('/:id', isAuthenticated, StateIssueAgencyControllers.deleteStateIssueAgency);

module.exports = StateIssueAgencyRoutes;
