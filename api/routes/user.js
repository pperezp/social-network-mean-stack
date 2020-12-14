"use strict"

let express = require("express");
let UserController = require("../controllers/user");

let api = express.Router();

// El middleware auth sirve para securizar un endpoint con un jwt
let middlewareAuth = require("../middlewares/auth");

api.post("/users", middlewareAuth.auth, UserController.create);
api.get("/users", middlewareAuth.auth, UserController.getAll);
api.post("/users/login", UserController.login);

module.exports = api;