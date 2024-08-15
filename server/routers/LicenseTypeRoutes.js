const Router = require('express').Router;
const LicenseTypeController = require('../controllers/LicenseTypeControllers');
const isAuthenticated = require('../middlewares/isAuthenticated');

const LicenseTypeRoutes = Router();

LicenseTypeRoutes.get('/', isAuthenticated, LicenseTypeController.getAllLicenseTypes);
LicenseTypeRoutes.get('/:id', isAuthenticated, LicenseTypeController.getLicenseTypeById);
LicenseTypeRoutes.post('/', isAuthenticated, LicenseTypeController.createLicenseType);
LicenseTypeRoutes.patch('/:id', isAuthenticated, LicenseTypeController.updateLicenseType);
LicenseTypeRoutes.delete('/:id', isAuthenticated, LicenseTypeController.deleteLicenseType);

module.exports = LicenseTypeRoutes;
