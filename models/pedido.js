'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var pedidoSchema = Schema({
    "pedido" : Array,
    "id_usuario" : String
});

module.exports = mongoose.model("Pedido", pedidoSchema);