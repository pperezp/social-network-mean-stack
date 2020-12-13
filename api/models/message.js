"use strict"

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let MessageSchema = Schema({
    text : String,
    created_at : String,
    emitter : {
        type : Schema.ObjectId,
        ref : "User"
    },
    receiver : {
        type : Schema.ObjectId,
        ref : "User"
    }
});

module.exports = mongoose.model("Message", MessageSchema);