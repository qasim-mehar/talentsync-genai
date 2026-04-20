const authController = require("../controllers/auth.contrioller");
const express = require("express");
const route = express.Router();

route.post("/register", authController.userRegisterController);

module.exports = route;
