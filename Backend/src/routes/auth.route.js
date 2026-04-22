const authController = require("../controllers/auth.contrioller");
const authMiddleware = require("../middleware/auth.middleware");
const express = require("express");
const route = express.Router();

route.post("/register", authController.userRegisterController);
route.post("/login", authController.userLoginController);
route.post("/logout", authController.userLogoutController);

route.get(
  "/get-me",
  authMiddleware.userAuthMiddleware,
  authController.getMeController,
);

module.exports = route;
