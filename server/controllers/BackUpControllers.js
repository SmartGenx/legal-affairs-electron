const BackUpServices = require('../services/BackUpServices')
const { ApiError } = require('../errors/ApiError')

class BackUpControllers {
  async getbackup(req, res, next) {
    try {
      const backUpFilter = req.query
      const BackUpControllers = await BackUpServices.getbackup(backUpFilter)
      res.status(200).json(BackUpControllers)
    } catch (error) {
      console.error(error)
      next(new ApiError(500, 'Internal Server Error', `${error.message}`))
    }
  }
}

module.exports = new BackUpControllers()
