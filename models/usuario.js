'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var usuarioSchema = Schema({
    "usuario": String,
    "password": String,
    "tipo": String,
    "nombre": String,
    "apellidos": String,
    "correo": String,
    "direcciones": Array
});

module.exports = mongoose.model("Usuarios", usuarioSchema);