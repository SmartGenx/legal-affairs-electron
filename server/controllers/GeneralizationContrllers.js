const { validationResult } = require('express-validator')
const GeneralizationServicesss = require('../services/GeneralizationServices') // Adjust this import to match your actual service file
const { ApiError } = require('../errors/ApiError')
const { ValidationError } = require('../errors/ValidationError')
const { NotFoundError } = require('../errors/NotFoundError')
class GeneralizationContrllers {
  async getAllgeneralization(req, res, next) {
    try {
      const generalizationFilter = req.query
      const generalization =
        await GeneralizationServicesss.getAllgeneralization(generalizationFilter)
      res.status(200).json(generalization)
    } catch (error) {
      console.log(error)
      next(new ApiError(500, 'InternalServer', `${error}`))
    }
  }

  async getgeneralizationById(req, res, next) {
    const id = Number(req.params.id)
    try {
      const generalization = await GeneralizationServicesss.getgeneralizationById(id)
      if (!generalization) {
        return next(new NotFoundError(`generalization with id ${id} not found.`))
      }
      res.status(200).json(generalization)
    } catch (error) {
      console.log(error)
      next(new ApiError(500, 'InternalServer', `${error}`))
    }
  }

  async creategeneralization(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()))
      }
      const generalizationData = req.body
      let filePath = ''
      if (req.file) {
        filePath = `${req.file.local}-generalization`
      }
      const generalization = await GeneralizationServicesss.creategeneralization(
        generalizationData,
        filePath
      )
      res.status(201).json(generalization)
    } catch (error) {
      console.log(error)
      next(new ApiError(500, 'InternalServer', `${error}`))
    }
  }

  async updategeneralization(req, res, next) {
    const id = Number(req.params.id)
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()))
      }
      const generalizationData = req.body
      let filePath = ''
      if (req.file) {
        filePath = `${req.file.local}-generalization`
      }
      const generalization = await GeneralizationServicesss.updategeneralization(
        id,
        generalizationData,
        filePath
      )
      if (!generalization) {
        return next(new NotFoundError(`generalization with id ${id} not found.`))
      }
      res.status(200).json(generalization)
    } catch (error) {
      console.log(error)
      next(new ApiError(500, 'InternalServer', `${error}`))
    }
  }

  async deletegeneralization(req, res, next) {
    const id = Number(req.params.id)
    try {
      const generalization = await GeneralizationServicesss.deletegeneralization(id)
      if (!generalization) {
        return next(new NotFoundError(`generalization with id ${id} not found.`))
      }
      res.status(200).json(generalization)
    } catch (error) {
      console.log(error)
      next(new ApiError(500, 'InternalServer', `${error}`))
    }
  }
}
module.exports = new GeneralizationContrllers()
