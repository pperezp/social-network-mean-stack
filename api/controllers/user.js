"use strict"

// Se carga bcrypt para la password
let bcrypt = require("bcrypt-nodejs");

// Se carga el model de usuario
let User = require("../models/user");

// Se carga el json web token
let jwt = require("../services/jwt");

// Pagination
let mongoosePaginate = require("mongoose-pagination");

// Endpoints y funciones
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

function getUser(request, response){
    let userId = request.params.id;

    User.findById(userId, (error, user) => {
        if(error){
            return response.status(404).send({message : "Usuario no existe: "});
        }

        deletePassword(user);

        return response.status(200).send(user);
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

    deletePassword(user);

    return response.status(200).send({token : jwt.createToken(user)});
}

function deletePassword(user){
    user.password = undefined;
}

async function getPaginationUsers(request, response){
    // El id del usuario logeado (ver jwt.js)
    let identityUserId = request.user.sub;

    let page = 1;
    if(request.params.page){
        page = request.params.page;
    }

    let itemsPerPage = 2;

    User.find().sort("_id").paginate(page, itemsPerPage, (error, users, total) => {
        if(error) 
            return response.status(500).send({message:"Error en la petición"});

        if(!users || users.length == 0) 
            return response.status(404).send({message : "No hay usuarios disponibles"});
        
        return response.status(200).send({
            pages : Math.ceil(total / itemsPerPage), total, users 
        });
    });
}

function update(request, response){
    // El id del usuario logeado (ver jwt.js)
    let identityUserId = request.user.sub;
    let userId = request.params.id;
    let update = request.body;

    // Borrar la propiedad password, ya que no se puede cambiar
    // En definitiva, eliminamos los campos que no se puedan actualizar
    delete update.password;
    delete update.role

    if(userId != identityUserId){
        return response.status(500).send({message:"No tienes permiso para actualizar los datos del usuario"});
    }

    // new:true --> userUpdate es el objeto actualizado, si no retorna el antiguo
    User.findByIdAndUpdate(userId, update, {new:true},(error, userUpdated) => {
        if(error) 
            return response.status(500).send({message:"Error en la petición"});

        if(!userUpdated)
            return response.status(404).send({message:"No se ha podido actualizar el usuario"});

        return response.status(200).send({user:userUpdated});
    });
}
// Endpoints y funciones

// Disponibilizar estas funciones fuera de este archivo
module.exports = {create, getUser, login, getPaginationUsers, update};