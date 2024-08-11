const Router = require('express').Router;
const DecisionControllers = require('../controllers/DecisionControllers');
const { upload, copyFileToProfileDir } = require("../middlewares/uploadLoacl");
const DecisionRoutes = Router();
const isAuthenticated  = require('../middlewares/isAuthenticated');

DecisionRoutes.get('/', isAuthenticated ,DecisionControllers.getAllDecision);
DecisionRoutes.get('/:id', isAuthenticated, DecisionControllers.getDecisionById);
DecisionRoutes.post('/', isAuthenticated,  upload.single("file"),copyFileToProfileDir(), DecisionControllers.createDecision);
DecisionRoutes.patch('/:id', isAuthenticated, upload.single("file"),copyFileToProfileDir(),DecisionControllers.updateDecision);
DecisionRoutes.delete('/:id', isAuthenticated, DecisionControllers.deleteDecision);

module.exports = DecisionRoutes;
