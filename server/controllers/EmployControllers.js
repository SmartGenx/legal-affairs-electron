const { validationResult } = require('express-validator')
const EmployServices = require('../services/EmployServices') // Adjust this import to match your actual service file
const { ApiError } = require('../errors/ApiError')
const { ValidationError } = require('../errors/ValidationError')
const { NotFoundError } = require('../errors/NotFoundError')
class EmployControllers {
  async getAllEmploy(req, res, next) {
    try {
      const EmployFilter = req.query
      const Employ = await EmployServices.getAllEmploy(EmployFilter)
      res.status(200).json(Employ)
    } catch (error) {
      console.log(error)
      next(new ApiError(500, 'InternalServer', `${error}`))
    }
  }

  async getEmployById(req, res, next) {
    const id = Number(req.params.id)
    const EmployFiltetr = req.query
    try {

      const Employ = await EmployServices.getEmployById(id,EmployFiltetr)
      if (!Employ) {
        return next(new NotFoundError(`Employ with id ${id} not found.`))
      }
      res.status(200).json(Employ)
    } catch (error) {
      console.log(error)
      next(new ApiError(500, 'InternalServer', `${error}`))
    }
  }

  async createEmploy(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()))
      }
      const EmployData = req.body
      console.log("🚀 ~ EmployControllers ~ createEmploy ~ EmployData:", EmployData)
      let filePath = ''

      if (req.file) {
        filePath = `${req.file.local}`
      }

      const Employ = await EmployServices.createEmploy(EmployData, filePath)
      res.status(201).json(Employ)
    } catch (error) {
      console.log(error)
      next(new ApiError(500, 'InternalServer', `${error}`))
    }
  }

  async updateEmploy(req, res, next) {
    console.log('here')

    const id = Number(req.params.id)
    try {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(new ValidationError('Validation Failed', errors.array()))
    }
    const EmployData = req.body
    let filePath = ''
    if (req.file) {
      filePath = req?.file?.local
    }
    console.log("🚀 ~ EmployControllers ~ updateEmploy ~ filePath:", filePath)
    const Employ = await EmployServices.updateEmploy(id, EmployData, filePath)
    if (!Employ) {
      return next(new NotFoundError(`Employ with id ${id} not found.`))
    }
    res.status(200).json(Employ)
    } catch (error) {
      console.log(error)
      next(new ApiError(500, 'InternalServer', `${error}`))
    }
  }

  async deleteEmploy(req, res, next) {
    const id = Number(req.params.id)
    try {
      const Employ = await EmployServices.deleteEmploy(id)
      if (!Employ) {
        return next(new NotFoundError(`Employ with id ${id} not found.`))
      }
      res.status(200).json(Employ)
    } catch (error) {
      console.log(error)
      next(new ApiError(500, 'InternalServer', `${error}`))
    }
  }
}
module.exports = new EmployControllers()
