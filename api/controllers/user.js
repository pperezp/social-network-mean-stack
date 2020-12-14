"use strict"

let bcrypt = require("bcrypt-nodejs");
const user = require("../models/user");

// Se carga el model de usuario
let User = require("../models/user");

async function create(request, response){
    let params = request.body;

    if(await userExist(params)){
        return response.status(200).send({message : "Usuario ya existe"});
    }

    // Si llegan los datos
    if(isDataOK(params)){
        let user = transform(params);

        save(user, response);
    }else{
        return response.status(200).send({message : "Faltan datos"});
    }
}

async function userExist(params){
    let users = await getUsers(params);

    return users && users.length > 0;
}

async function getUsers(params){
    // await es para que el resultado se retorne
    // se debe usar si o si dentro de una funcion async

    return await User.find({
        $or : [
            {email : params.email.toLowerCase()},
            {nick : params.nick.toLowerCase()}
        ]
    });
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
            return response.status(500).send({message : "Error al guardar el usuario"});
        }

        if(userStored){
            return response.status(200).send({user : userStored});
        }else{
            return response.status(404).send({message : "No se ha registrado el usuario"});
        }
    });
}

function getAll(request, response){
    User.find({}, (error, users) => {
        if(error){
            return response.status(500).send({message : "Error al obtener todos los usuarios"});
        }

        return response.status(200).send(users);
    });
}

async function login(request, response){
    let params = request.body;

    let email = params.email;
    let password = params.password;


    let user = await User.findOne({
        "email" : email
    });

    if(!user){
        return response.status(200).send({message : "Usuario no encontrado"});
    }

    if(!bcrypt.compareSync(password, user.password)){
        return response.status(200).send({message : "Password incorrecta"});
    }

    return response.status(200).send(user);
}

// Disponibilizar estas funciones fuera de este archivo
module.exports = {create, getAll, login};