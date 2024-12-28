const { validationResult } = require('express-validator')
const StatisticsService = require('../services/StatisticsService')
const { ApiError } = require('../errors/ApiError')
const { ValidationError } = require('../errors/ValidationError')
const { NotFoundError } = require('../errors/NotFoundError')

class StatisticsControllers {
  async getDashboardStatistics(req, res, next) {
    try {
      const DashboardStatistics = await StatisticsService.getDashboardStatistics()
      res.status(200).json(DashboardStatistics)
    } catch (error) {
      console.error(error)
      next(new ApiError(500, 'Internal Server Error', `${error.message}`))
    }
  }
}

module.exports = new StatisticsControllers()
