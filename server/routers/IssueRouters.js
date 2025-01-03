const Router = require('express').Router
const IssueControllers = require('../controllers/IssueControllers')
const IssueRoutes = Router()
const isAuthenticated = require('../middlewares/isAuthenticated')

IssueRoutes.get('/', isAuthenticated, IssueControllers.getAllIssue)
IssueRoutes.get('/:id', isAuthenticated, IssueControllers.getIssueById)
IssueRoutes.get(
  '/GovernmentOffice/:id',
  isAuthenticated,
  IssueControllers.getIssueByGovernmentOfficeId
)
IssueRoutes.post('/', IssueControllers.createIssue)
IssueRoutes.patch('/:id', isAuthenticated, IssueControllers.updateIssue)
IssueRoutes.delete('/:id', isAuthenticated, IssueControllers.deleteIssue)

module.exports = IssueRoutes
