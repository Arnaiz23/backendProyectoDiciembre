'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const bcryptjs = require("bcryptjs");
var Role = require("./roles");

var usuarioSchema = Schema({
    "usuario": {
        type: String,
        unique: true
    },
    "password": {
        type: String,
        required: true
    },
    "roles": [
        {
            ref: "Role",
            type: Schema.Types.ObjectId
        }
    ],
    "nombre": String,
    "apellidos": String,
    "correo": {
        type: String,
        unique: true
    },
    "direcciones": Array
});

// AQUI ES 100% OBLIGATORIO TRABAJAR CON ASYNC Y AWAIT
usuarioSchema.statics.encrypt = async (password) =>{
    const salt = await bcryptjs.genSalt(10);
    return await bcryptjs.hash(password, salt);
}

usuarioSchema.statics.comparePassword = async (password, receivedPassword) =>{
    return await bcryptjs.compare(password, receivedPassword);
}

module.exports = mongoose.model("users", usuarioSchema);