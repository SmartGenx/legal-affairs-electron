const Router = require('express').Router;
const AttachmentController = require('../controllers/AttachmentControllers');
const { upload, copyFileToProfileDir } = require("../middlewares/uploadLocal");
const isAuthenticated = require('../middlewares/isAuthenticated');

const AttachmentRoutes = Router();

AttachmentRoutes.get('/', isAuthenticated, AttachmentController.getAllAttachments);
AttachmentRoutes.get('/:id', isAuthenticated, AttachmentController.getAttachmentById);
AttachmentRoutes.post('/create_attachment', isAuthenticated, upload.single("file"), copyFileToProfileDir(), AttachmentController.createAttachment);
AttachmentRoutes.patch('/:id', isAuthenticated, upload.single("file"), copyFileToProfileDir(), AttachmentController.updateAttachment);
AttachmentRoutes.delete('/:id', isAuthenticated, AttachmentController.deleteAttachment);

module.exports = AttachmentRoutes;
