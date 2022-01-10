'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const bcryptjs = require("bcryptjs");
var Role = require("./roles");

var usuarioSchema = Schema({
    "usuario": String,
    "password": String,
    "roles": [
        {
            ref: "Role",
            type: Schema.Types.ObjectId
        }
    ],
    "nombre": String,
    "apellidos": String,
    "correo": String,
    "direcciones": Array
});

// AQUI ES 100% OBLIGATORIO TRABAJAR CON ASYNC Y AWAIT
usuarioSchema.statics.encrypt = async (password) =>{
    const salt = await bcryptjs.genSalt(10);
    return await bcryptjs.hash(password, salt);
}

module.exports = mongoose.model("users", usuarioSchema);