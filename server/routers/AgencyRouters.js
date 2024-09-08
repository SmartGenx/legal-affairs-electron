const Router = require('express').Router
const AgencyControllers = require('../controllers/AgencyControllers')
const isAuthenticated = require('../middlewares/isAuthenticated')

const AgencyRoutes = Router()

AgencyRoutes.get('/', isAuthenticated, AgencyControllers.getAllAgency)
AgencyRoutes.get('/:id', isAuthenticated, AgencyControllers.getAgencyById)
AgencyRoutes.post('/', isAuthenticated, AgencyControllers.createAgency)
AgencyRoutes.patch('/:id', isAuthenticated, AgencyControllers.updateAgency)
AgencyRoutes.delete('/:id', isAuthenticated, AgencyControllers.deleteAgency)

module.exports = AgencyRoutes
