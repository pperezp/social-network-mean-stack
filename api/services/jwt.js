"use strinct"

let jwt = require("jwt-simple");
let moment = require("moment");
let config = require("../models/config");

exports.createToken = (user) => {
    let payload = {
        sub : user._id,
        name : user.name,
        surname : user.surname,
        nick : user.nick,
        email : user.email,
        role : user.role,
        image : user.image,
        iat : moment().unix(),
        exp : moment().add(30, "days").unix()
    };

    return jwt.encode(payload, config.SECRET_KEY);
};