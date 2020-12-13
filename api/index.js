"use strict"

// app.js (express)
let app = require("./app"); 
const PORT = 3800;
// app.js (express)

// Conexión a mongodb
let mongoose = require("mongoose");

mongoose.Promise = global.Promise;

let options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

let urlConnection = "mongodb://localhost:27017/social_network_db";

mongoose.connect(urlConnection, options)
    .then(() => {
        console.log("Mongo db connection OK");

        // Si es que se conecta a la base de datos, se crea el servidor
        app.listen(PORT, () => {
            console.log("Server run in http://localhost:" + PORT);
        });
    })
    .catch(err => console.log(err));
// Conexión a mongodb