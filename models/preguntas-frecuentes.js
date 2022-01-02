'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var preguntasSchema = Schema({
    "pregunta": String,
    "respuesta": String
});

module.exports = mongoose.model("Preguntas-frecuentes", preguntasSchema);