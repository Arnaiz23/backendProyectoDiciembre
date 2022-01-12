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

            const user = await User.findOne({usuario: req.userUser }, {password: 0});
            if(!user) return res.status(400).send({status: "error", message: "No se ha encontrado el usuario"});

            req.userId = user.id;

            next();

        } catch (error) {
            console.log(error)
        }

    },
    isAdmin: async (req, res, next) =>{
        try {
            
            const user = await User.findById(req.userId);
            const roles = await Rol.find({_id: { $in: user.roles }});

            for(let i = 0; i < roles.length; i++){
                if(roles[i].name === "admin"){
                    next();
                    return;
                }
            }

            return res.status(403).send({
                status: "error",
                message: "Es necesario ser admin"
            })

        } catch (error) {
            console.log(error);
            return res.status(500).send({message: "No funciono"});
        }
    }
}

module.exports = data;