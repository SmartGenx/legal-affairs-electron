const Router = require('express').Router
const GeneralizationContrllers = require('../controllers/GeneralizationContrllers')
const { upload, copyFileToProfileDir } = require('../middlewares/uploadLoacl')
const GeneralizationRoutes = Router()
const isAuthenticated = require('../middlewares/isAuthenticated')

GeneralizationRoutes.get('/', isAuthenticated, GeneralizationContrllers.getAllgeneralization)
GeneralizationRoutes.get('/:id', isAuthenticated, GeneralizationContrllers.getgeneralizationById)
GeneralizationRoutes.post(
  '/create_generalization',
  isAuthenticated,
  upload.single('file'),
  copyFileToProfileDir(),
  GeneralizationContrllers.creategeneralization
)
GeneralizationRoutes.patch(
  '/:id',
  isAuthenticated,
  upload.single('file'),
  copyFileToProfileDir(),
  GeneralizationContrllers.updategeneralization
)
GeneralizationRoutes.delete('/:id', isAuthenticated, GeneralizationContrllers.deletegeneralization)

module.exports = GeneralizationRoutes
