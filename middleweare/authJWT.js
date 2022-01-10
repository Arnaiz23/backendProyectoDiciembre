'use strict'

var jwt = require("jsonwebtoken");
var config = require("../configs/config");
var User = require("../models/usuario");
var Rol = require("../models/roles");

const data = {
    verifyToken: async (req, res, next)=>{
        let token = req.headers["x-access-token"];

        if(!token) return res.status(400).send({status: "error", message: "No has proporcionado un token"});

        try {
            const decoded = jwt.verify(token, config.llave);
            req.userUser = decoded.usuario;
            req.userPass = decoded.password;
            console.log(decoded)

            const user = await User.findOne({usuario: req.userUser, password: req.userPass}, {password: 0});
            if(!user) return res.status(400).send({status: "error", message: "No se ha encontrado el usuario"});

            next();

        } catch (error) {
            console.log(error)
        }

    },
    isAdmin: async (req, res, next) =>{
        
    }
}

module.exports = data;