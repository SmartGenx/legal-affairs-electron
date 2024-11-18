const Router = require('express').Router;
const StatisticsControllers = require('../controllers/StatisticsControllers');
const isAuthenticated = require('../middlewares/isAuthenticated');

const StatisticsRoutes = Router();

StatisticsRoutes.get('/', isAuthenticated, StatisticsControllers.getDashboardStatistics);

module.exports = StatisticsRoutes;
