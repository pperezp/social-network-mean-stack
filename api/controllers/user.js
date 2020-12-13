"use strict"

let bcrypt = require("bcrypt-nodejs");
const user = require("../models/user");

// Se carga el model de usuario
let User = require("../models/user");

function create(request, response){
    let params = request.body;

    // Si llegan los datos
    if(isDataOK(params)){
        let user = transform(params);

        save(user, response);
    }else{
        response.status(200).send({message : "Faltan datos"});
    }
}

function isDataOK(params){
    return params.name && params.surname && params.nick && params.email && params.password
}

function transform(params){
    let user = new User();

    user.name = params.name;
    user.surname = params.surname;
    user.nick = params.nick;
    user.email = params.email;
    user.role = "ROLE_USER";
    user.image = null;
    user.password = passwordEncrypt(params.password);

    return user;
}

function passwordEncrypt(password){
    let salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

function save(user, response){
    user.save((error, userStored) => {
        if(error){
            response.status(500).send({message : "Error al guardar el usuario"});
        }

        if(userStored){
            response.status(200).send({user : userStored});
        }else{
            response.status(404).send({message : "No se ha registrado el usuario"});
        }
    });
}

function getAll(request, response){
    User.find({}, (error, users) => {
        if(error){
            response.status(500).send({message : "Error al obtener todos los usuarios"});
        }

        response.status(200).send(users);
    });
}

// Disponibilizar estas funciones fuera de este archivo
module.exports = {create, getAll};