'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var productoSchema = Schema({
    "imagen" : String,
    "nombre" : String,
    "marca" : String,
    "tipo" : String,
    "descripcionCorta" : String,
    "descripcion" : String,
    "precio" : Number,
    "deporte" : String,
    "disponibilidad" : String,
    "date" : {type: Date, default: Date.now}
});

module.exports = mongoose.model("Producto", productoSchema);