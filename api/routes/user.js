"use strict"

let express = require("express");
let UserController = require("../controllers/user");

let api = express.Router();

api.post("/users", UserController.create);
api.get("/users", UserController.getAll);

module.exports = api;