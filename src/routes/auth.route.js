const authController = require("../controllers/auth.contrioller");
const express = require("express");
const route = express.Router();

route.post("/register", authController.userRegisterController);
route.post("/login", authController.userLoginController);
route.post("/logout", authController.userLogoutController);

module.exports = route;
