const { Router } = require('express');
const AuthController = require('../controllers/AuthControllers');


const AuthRoutes = Router();

AuthRoutes.post('/login', AuthController.login);

module.exports = AuthRoutes;
