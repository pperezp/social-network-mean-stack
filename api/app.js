"use strict"

let express = require("express");
let bodyParser = require("body-parser");

let app = express();

// Cargar rutas

// Middleware - Método que se ejecuta antes que llegue a un controlador
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()); // Cuando se recibe una petición, se transforma en un objeto json

// Cors

// Rutas
app.get("/", (request, response) => {
    
});

// Exportar la configuración
module.exports = app;