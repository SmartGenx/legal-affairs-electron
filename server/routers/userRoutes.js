const { Router } = require("express");
const UserController = require("../controllers/UserControllers");
const { upload, copyFileToProfileDir } = require("../middlewares/uploadLoacl");
const isAuthenticated = require("../middlewares/isAuthenticated");

const UserRoutes = Router();

UserRoutes.post(
  "/registration",
  isAuthenticated,
  upload.single("file"),
  copyFileToProfileDir(),
  UserController.createUser
);
UserRoutes.get("/", isAuthenticated, UserController.getAllUsers);
UserRoutes.get("/:id", isAuthenticated, UserController.getUserById);
UserRoutes.delete("/:id", isAuthenticated, UserController.deleteUser);
UserRoutes.patch(
  "/:id",
  upload.single("file"),
  copyFileToProfileDir(),
  isAuthenticated,
  UserController.updateUser
);
UserRoutes.post("/logout", isAuthenticated, UserController.logout);

module.exports = UserRoutes;
