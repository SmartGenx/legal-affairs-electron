const Router = require('express').Router;
const PostionController = require('../controllers/PostionControllers');
const PostionRoutes = Router();
const isAuthenticated  = require('../middlewares/isAuthenticated');

PostionRoutes.get('/', isAuthenticated ,PostionController.getAllPostion);
PostionRoutes.get('/:id', isAuthenticated, PostionController.getPostionById);
PostionRoutes.post('/', isAuthenticated, PostionController.createPostion);
PostionRoutes.patch('/:id', isAuthenticated, PostionController.updatePostion);
PostionRoutes.delete('/:id', isAuthenticated, PostionController.deletePostion);

module.exports = PostionRoutes;
