const  Router  = require('express').Router;
const EnumRoutes = Router();
const EnumValueController = require('../controllers/EnumValueControllers');
const isAuthenticated = require('../middlewares/isAuthenticated');



EnumRoutes.get('/', isAuthenticated, EnumValueController.getAllEnum);

module.exports = EnumRoutes;
