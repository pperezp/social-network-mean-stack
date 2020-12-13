"use strict"

let express = require("express");
let bodyParser = require("body-parser");

let app = express();

// Cargar rutas
let userRoutes = require("./routes/user");

// Middleware - Método que se ejecuta antes que llegue a un controlador
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()); // Cuando se recibe una petición, se transforma en un objeto json

// Cors

// Rutas : Se le añade api v1 a todas las rutas que definimos
app.use("/api/v1", userRoutes);

// Exportar la configuración
module.exports = app;