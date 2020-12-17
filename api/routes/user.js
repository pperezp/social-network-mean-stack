"use strict"

const { request } = require("express");
let express = require("express");
let UserController = require("../controllers/user");

let api = express.Router();

// El middleware auth sirve para securizar un endpoint con un jwt
let middlewareAuth = require("../middlewares/auth");

// Multipart de archivos
let multipart = require("connect-multiparty");

// Esta carpeta se debe crear manualmente
let middlewareUpload = multipart({uploadDir:"./uploads/users"});

api.post("/users", middlewareAuth.auth, UserController.create);
api.get("/users/:id", middlewareAuth.auth, UserController.getUser);
api.post("/users/login", UserController.login);
api.get("/users/page/:page", middlewareAuth.auth, UserController.getPaginationUsers);
api.put("/users/:id", middlewareAuth.auth, UserController.update);
api.post("/users/image/:id", [middlewareAuth.auth, middlewareUpload], UserController.uploadImage);

module.exports = api;