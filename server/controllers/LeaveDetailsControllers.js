const { validationResult } = require('express-validator')
const LeaveDetailsService = require('../services/LeaveDetailsServices')
const { ApiError } = require('../errors/ApiError')
const { ValidationError } = require('../errors/ValidationError')
const { NotFoundError } = require('../errors/NotFoundError')

class LeaveDetailsController {
  // Get all leave details with optional filters
  async getAllLeaveDetails(req, res, next) {
    try {
      const LeaveDetailsFilter = req.query
      console.log(
        '🚀 ~ LeaveDetailsController ~ getAllLeaveDetails ~ LeaveDetailsFilter:',
        LeaveDetailsFilter
      )
      const leaveDetails = await LeaveDetailsService.getAllLeaveDetails(LeaveDetailsFilter)
      res.status(200).json(leaveDetails)
    } catch (error) {
      console.error(error)
      next(new ApiError(500, 'Internal Server Error', `${error.message}`))
    }
  }

  // Get leave details by ID
  async getLeaveDetailsById(req, res, next) {
    const id = Number(req.params.id)
    try {
      const leaveDetails = await LeaveDetailsService.getLeaveDetailsById(id)
      if (!leaveDetails) {
        return next(new NotFoundError(`LeaveDetails with id ${id} not found.`))
      }
      res.status(200).json(leaveDetails)
    } catch (error) {
      console.error(error)
      next(new ApiError(500, 'Internal Server Error', `${error.message}`))
    }
  }

  // Create new leave details
  async createLeaveDetails(req, res, next) {
    try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(new ValidationError('Validation Failed', errors.array()))
    }
    const leaveDetailsData = req.body
    const leaveDetails = await LeaveDetailsService.createLeaveDetails(leaveDetailsData)
    res.status(201).json(leaveDetails)
    } catch (error) {
      console.error(error)
      next(new ApiError(500, 'Internal Server Error', `${error.message}`))
    }
  }

  // Update existing leave details by ID
  async updateLeaveDetails(req, res, next) {
    const id = Number(req.params.id)
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()))
      }
      const leaveDetailsData = req.body
      const leaveDetails = await LeaveDetailsService.updateLeaveDetails(id, leaveDetailsData)
      if (!leaveDetails) {
        return next(new NotFoundError(`LeaveDetails with id ${id} not found.`))
      }
      res.status(200).json(leaveDetails)
    } catch (error) {
      console.error(error)
      next(new ApiError(500, 'Internal Server Error', `${error.message}`))
    }
  }

  // Soft delete leave details by ID
  async deleteLeaveDetails(req, res, next) {
    const id = Number(req.params.id)
    try {
      const leaveDetails = await LeaveDetailsService.deleteLeaveDetails(id)
      if (!leaveDetails) {
        return next(new NotFoundError(`LeaveDetails with id ${id} not found.`))
      }
      res.status(200).json(leaveDetails)
    } catch (error) {
      console.error(error)
      next(new ApiError(500, 'Internal Server Error', `${error.message}`))
    }
  }
}

module.exports = new LeaveDetailsController()
