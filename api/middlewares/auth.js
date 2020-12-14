"use strict"

let jwt = require("jwt-simple");
let moment = require("moment");
let config = require("../models/config");

exports.auth = (request, response, next) => {
    if(!request.headers.authorization){
        return response.status(403).send({message : "La petición no tiene la cabezera de autenticación"});
    }

    let token = request.headers.authorization.replace(/['"]+/g, '');
    
    try {
        let payload = jwt.decode(token, config.SECRET_KEY);

        // Si la fecha de expiración es menor a la fecha actual
        if(payload.exp <= moment().unix()){
            return response.status(401).send({message : "Token expirado"});
        }

        // Dejo el payload (usuario) para que lo puedan ver todos los controladores
        request.user = payload;
        
        next();
    } catch (error) {
        return response.status(404).send({message : "Token no válido"});
    }
};
