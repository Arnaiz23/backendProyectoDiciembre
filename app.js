'use strict'

var express = require("express");
var bodyParser = require("body-parser");
// var config = require("./configs/config.js");
// var jwt = require("jsonwebtoken");

var app = express();

var api_routes = require("./routes//api");

app.use(bodyParser.urlencoded({extended:false}));  //cargar el bodyparser
app.use(bodyParser.json());  //Convertir todo lo que recibamos a json

// CORS  (Buscar cors en nodeJS en victorroblesweb.com y pegarlo)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


app.use("/api", api_routes);


module.exports = app;