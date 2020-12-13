"use strict"

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let PublicationSchema = Schema({
    test : String,
    file : String, 
    created_at : String,
    user : {
        type : Schema.ObjectId,
        ref : "User"
    }
});

module.exports = mongoose.model("Publication", PublicationSchema);