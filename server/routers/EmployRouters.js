const Router = require('express').Router
const EmployControllers = require('../controllers/EmployControllers')
const { upload, copyFileToProfileDir } = require('../middlewares/uploadLoacl')

const EmployRoutes = Router()
const isAuthenticated = require('../middlewares/isAuthenticated')

EmployRoutes.get('/', isAuthenticated, EmployControllers.getAllEmploy)
EmployRoutes.get('/:id', isAuthenticated, EmployControllers.getEmployById)
EmployRoutes.post(
  '/create_employ',
  isAuthenticated,
  upload.single('file'),
  copyFileToProfileDir(),
  EmployControllers.createEmploy
)
EmployRoutes.patch(
  '/:id',
  isAuthenticated,
  upload.single('file'),
  copyFileToProfileDir(),
  EmployControllers.updateEmploy
)
EmployRoutes.delete('/:id', isAuthenticated, EmployControllers.deleteEmploy)

module.exports = EmployRoutes
