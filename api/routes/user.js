"use strict"

let express = require("express");
let UserController = require("../controllers/user");

let api = express.Router();

api.post("/users", UserController.create);
api.get("/users", UserController.getAll);
api.post("/users/login", UserController.login);

module.exports = api;