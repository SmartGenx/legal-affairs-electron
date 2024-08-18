const Router = require('express').Router;
const LicenseController = require('../controllers/LicenseControllers.js');
const isAuthenticated = require('../middlewares/isAuthenticated.js');

const LicenseRoutes = Router();

LicenseRoutes.get('/', isAuthenticated, LicenseController.getAllLicenses);
LicenseRoutes.get('/:id', isAuthenticated, LicenseController.getLicenseById);
LicenseRoutes.post('/', isAuthenticated, LicenseController.createLicense);
LicenseRoutes.patch('/:id', isAuthenticated, LicenseController.updateLicense);
LicenseRoutes.delete('/:id', isAuthenticated, LicenseController.deleteLicense);

module.exports = LicenseRoutes;
