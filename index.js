'use strict'

var mongoose = require("mongoose");
var port = "3900";
var app = require("./app");

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://user1:pass1@localhost:2717/api_rest", {useNewUrlParser: true}, ()=>{
    console.log("Conectado a la base de datos correctamente");

    app.listen(port, ()=>{
        console.log("Servidor corriendo por http://localhost:"+port);
    });
});