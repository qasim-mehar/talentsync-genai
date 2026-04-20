const authController = require("../controllers/auth.contrioller");
const express = require("express");
const route = express.Router();

route.post("/register", authController.userRegisterController);
route.post("/login", authController.userLoginController);

module.exports = route;
