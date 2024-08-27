const { validationResult } = require('express-validator')
const TribunalService = require('../services/TribunalService')
const { ApiError } = require('../errors/ApiError')
const { ValidationError } = require('../errors/ValidationError')
const { NotFoundError } = require('../errors/NotFoundError')

class TribunalControllers {
  async getAllTribunals(req, res, next) {
    try {
      const TribunalFilter = req.query
      const Tribunals = await TribunalService.getAllTribunals(TribunalFilter)
      res.status(200).json(Tribunals)
    } catch (error) {
      console.error(error)
      next(new ApiError(500, 'Internal Server Error', `${error.message}`))
    }
  }

  async getTribunalById(req, res, next) {
    const id = Number(req.params.id)
    try {
      const Tribunal = await TribunalService.getTribunalById(id)
      if (!Tribunal) {
        return next(new NotFoundError(`Tribunal with id ${id} not found.`))
      }
      res.status(200).json(Tribunal)
    } catch (error) {
      console.error(error)
      next(new ApiError(500, 'Internal Server Error', `${error.message}`))
    }
  }

  async createTribunal(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()))
      }
      const TribunalData = req.body
      const Tribunal = await TribunalService.createTribunal(TribunalData)
      res.status(201).json(Tribunal)
    } catch (error) {
      console.error(error)
      next(new ApiError(500, 'Internal Server Error', `${error.message}`))
    }
  }

  async updateTribunal(req, res, next) {
    const id = Number(req.params.id)
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()))
      }
      const TribunalData = req.body
      const Tribunal = await TribunalService.updateTribunal(id, TribunalData)
      if (!Tribunal) {
        return next(new NotFoundError(`Tribunal with id ${id} not found.`))
      }
      res.status(200).json(Tribunal)
    } catch (error) {
      console.error(error)
      next(new ApiError(500, 'Internal Server Error', `${error.message}`))
    }
  }

  async deleteTribunal(req, res, next) {
    const id = Number(req.params.id)
    try {
      const Tribunal = await TribunalService.deleteTribunal(id)
      if (!Tribunal) {
        return next(new NotFoundError(`Tribunal with id ${id} not found.`))
      }
      res.status(200).json(Tribunal)
    } catch (error) {
      console.error(error)
      next(new ApiError(500, 'Internal Server Error', `${error.message}`))
    }
  }
}

module.exports = new TribunalControllers()
