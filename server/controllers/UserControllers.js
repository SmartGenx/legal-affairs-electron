const { validationResult } = require('express-validator')
const UserService = require('../services/userServices') // Adjust this import to match your actual service file
const { ApiError } = require('../errors/ApiError')
const { ValidationError } = require('../errors/ValidationError')
const { NotFoundError } = require('../errors/NotFoundError')

class UserController {
  // Get all Users
  async getAllUsers(req, res, next) {
    try {
      const userFilter = req.query
      const users = await UserService.getAllUsers(userFilter)
      res.status(200).json(users)
    } catch (error) {
      console.log(error)
      next(new ApiError(500, 'InternalServer', `${error}`))
    }
  }

  // Get a User by ID
  async getUserById(req, res, next) {
    const id = Number(req.params.id)
    try {
      const user = await UserService.getUserById(id)
      if (!user) {
        return next(new NotFoundError(`User with id ${id} not found.`))
      }
      res.status(200).json(user)
    } catch (error) {
      console.log(error)
      next(new ApiError(500, 'InternalServer', `${error}`))
    }
  }

  // Create a new User
  async createUser(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()))
      }
      const userData = req.body
      if (userData.password.length < 8) {
        return next(new ValidationError('The password is too short'))
      }
      let filePath = ''


      if (req.file) {
        filePath = req.file.local
      }

      const newUser = await UserService.createUser(userData, filePath)

      res.status(201).json(newUser)
    } catch (error) {
      next(new ApiError(500, 'InternalServer', `${error}`))
    }
  }

  // Update an existing User
  async updateUser(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()))
      }
      const id = Number(req.params.id)
      delete req.body.password
      const userData = req.body
      let filePath = ''


            if (req.file) {
                filePath = `${req.file.local}`;
            }
            const updatedUser = await UserService.updateUser(id, userData, filePath);
            if (!updatedUser) {
                return next(new NotFoundError(`User with id ${id} not found.`));
            }

            res.status(200).json(updatedUser);
        } catch (error) {
            next(new ApiError(500, 'InternalServer', `${error}`));
        }






      }
  // Logout
  async logout(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()))
      }
      const userData = req.body
      const updatedUser = await UserService.logout(userData)
      if (!updatedUser) {
        return next(new NotFoundError(`User with resetToken ${userData.resetToken} not found.`))
      }
      res.status(200).json(updatedUser)
    } catch (error) {
      next(new ApiError(500, 'InternalServer', `${error}`))
    }
  }

  // Delete a User by ID
  async deleteUser(req, res, next) {
    try {
      const id = Number(req.params.id)
      const deletedUserName = await UserService.deleteUser(id)

      res
        .status(200)
        .json({ message: `The User '${deletedUserName}' has been successfully deleted` })
    } catch (error) {
      next(new ApiError(500, 'InternalServer', `${error}`))
    }
  }
}

// Create an instance of the UserController to export
module.exports = new UserController()
