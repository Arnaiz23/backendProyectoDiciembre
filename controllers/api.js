'use strict'

var validator = require("validator");
var fs = require("fs");
var path = require("path");
var jwt = require("jsonwebtoken");
var config = require("../configs/config.js");

var express = require("express");
var app = express();
app.set("llave", config.llave);

// const { validate, exists } = require("../models/producto");
var Producto = require("../models/producto");
var Usuario = require("../models/usuario");
var Pregunta = require("../models/preguntas-frecuentes");
var Pedido = require("../models/pedido");
var Role = require("../models/roles");
const { exit } = require("process");

var controller = {
    prueba: (req, res) => {
        res.status(200).send({
            status: "success",
            message: "Prueba correcta"
        })
    },
    // Todos los productos
    getProductos: (req, res) => {
        var query = Producto.find();

        query.exec((err, productos) => {
            if (err) {
                res.status(500).send({
                    status: "error",
                    message: "Error al devolver los productos"
                });
            }

            if (!productos) {
                res.status(404).send({
                    status: "error",
                    message: "No hay productos disponibles"
                });
            }

            return res.status(200).send({
                status: "success",
                productos
            });
        });
    },
    // Productos de un deporte en concreto
    getDeporte: (req, res) => {
        var deporte = req.params.deporte;

        Producto.find({ deporte: deporte }, (err, productos) => {
            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Error al devolver los productos de " + deporte
                });
            }

            if (!productos || productos.length == 0) {
                res.status(404).send({
                    status: "error",
                    message: "No hay productos disponibles"
                });
            }

            return res.status(200).send({
                status: "success",
                productos
            });
        });
    },
    // Un solo producto por id
    getProducto: (req, res) => {
        var productoId = req.params.id;

        if (!productoId || productoId == null) {
            return res.status(404).send({
                status: "error",
                message: "No existe ese identificador !!!"
            });
        }

        Producto.findById(productoId, (err, producto) => {
            if (!producto || err) {
                return res.status(404).send({
                    status: "error",
                    message: "No existe el producto !!!"
                });
            }

            return res.status(200).send({
                status: "success",
                producto
            });
        });
    },
    // A??adir producto
    newProducto: (req, res) => {
        var data = req.body;

        try {
            var validate_nombre = !validator.isEmpty(data.nombre);
            var validate_marca = !validator.isEmpty(data.marca);
            var validate_tipo = !validator.isEmpty(data.tipo);
            var validate_descripcionCorta = !validator.isEmpty(data.descripcionCorta);
            var validate_descripcion = !validator.isEmpty(data.descripcion);
            var validate_precio = !validator.isEmpty(data.precio);
            var validate_deporte = !validator.isEmpty(data.deporte);
            var validate_disponibilidad = !validator.isEmpty(data.disponibilidad);

        } catch (err) {
            return res.status(200).send({
                status: "error",
                message: 'Faltan datos por enviar !!!'
            });
        }

        if (validate_nombre && validate_marca && validate_tipo && validate_descripcionCorta && validate_descripcion && validate_precio && validate_deporte && validate_disponibilidad) {
            var producto = new Producto();

            producto.nombre = data.nombre;
            producto.marca = data.marca;
            producto.tipo = data.tipo;
            producto.descripcionCorta = data.descripcionCorta;
            producto.descripcion = data.descripcion;
            producto.precio = data.precio;
            producto.deporte = data.deporte;
            producto.disponibilidad = data.disponibilidad;

            if (data.image) {
                producto.image = data.image;
            } else {
                producto.image = null;
            }

            producto.save((err, productoStored) => {
                if (err || !productoStored) {
                    return res.status(404).send({
                        status: "error",
                        message: "El producto no se ha guardado!!!"
                    });
                }

                return res.status(200).send({
                    status: "success",
                    producto: productoStored
                });
            });

        } else {
            return res.status(404).send({
                status: "error",
                message: 'Los datos no son validos'
            });
        }
    },
    // Eliminar un producto
    deleteProducto: (req, res) => {
        var productoId = req.params.id;

        if (!productoId || productoId == null) {
            return res.status(404).send({
                status: "error",
                message: "No existe ese identificador !!!"
            });
        }

        Producto.findOneAndDelete({ _id: productoId }, (err, productoDelete) => {
            if (err || !productoDelete) {
                return res.status(500).send({
                    status: "error",
                    message: "No se ha eliminado ningun producto"
                });
            }

            return res.status(200).send({
                status: "success",
                productoDelete
            });
        });
    },
    // Editar producto
    updateProducto: (req, res) => {
        var productoId = req.params.id;
        var data = req.body;

        try {
            var validate_nombre = !validator.isEmpty(data.nombre);
            var validate_marca = !validator.isEmpty(data.marca);
            var validate_tipo = !validator.isEmpty(data.tipo);
            var validate_descripcionCorta = !validator.isEmpty(data.descripcionCorta);
            var validate_descripcion = !validator.isEmpty(data.descripcion);
            var validate_precio = !validator.isEmpty(data.precio);
            var validate_deporte = !validator.isEmpty(data.deporte);
            var validate_disponibilidad = !validator.isEmpty(data.disponibilidad);

        } catch (err) {
            return res.status(200).send({
                status: "error",
                message: 'Faltan datos por enviar !!!'
            });
        }

        if (validate_nombre && validate_marca && validate_tipo && validate_descripcionCorta && validate_descripcion && validate_precio && validate_deporte && validate_disponibilidad) {

            Producto.findByIdAndUpdate({ _id: productoId }, data, (err, productoUpdate) => {
                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: "Error al actualizar"
                    });
                }

                if (!productoUpdate) {
                    return res.status(404).send({
                        status: "error",
                        message: "No existe ese producto"
                    });
                }

                return res.status(200).send({
                    status: "success",
                    productoUpdate
                });
            });

        } else {
            return res.status(404).send({
                status: "error",
                message: 'Los datos no son validos'
            });
        }
    },
    // Sacar una imagen
    getImage: (req, res) => {
        var file = req.params.image;
        var path_file = './upload/productos/' + file;

        fs.exists(path_file, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(404).send({
                    status: "error",
                    message: "La imagen no existe"
                });
            }
        });
    },
    // Buscar productos
    searchProductos: (req, res) => {
        var searchString = req.params.search;

        Producto.find({
            "$or": [
                { "nombre": { "$regex": searchString, "$options": "i" } },  //Si el searchString esta incluido("i") dentro del titulo("title")
                { "marca": { "$regex": searchString, "$options": "i" } }, //Si el searchString esta incluido("i") dentro del contenido("content")
                { "tipo": { "$regex": searchString, "$options": "i" } },
                { "descripcionCorta": { "$regex": searchString, "$options": "i" } }
            ]
        })
            .sort([['date', 'descending']])
            .exec((err, productos) => {
                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: "Error en la peticion!!!"
                    });
                }
                if (!productos || productos.length <= 0) {
                    return res.status(500).send({
                        status: "error",
                        message: "No hay productos que coincidan con tu busqueda"
                    });
                }
                return res.status(200).send({
                    status: "success",
                    productos
                });
            });
    },
    // Ordenar productos
    orderProductos: (req, res) => {
        var params = req.params.order;
        var deporte = req.params.deporte;

        if (params == "mas" || params == "menos" || params == "normal") {
            switch (params) {
                case "mas":
                    Producto.find({ deporte: deporte }).sort('-precio')
                        .exec((err, productos) => {
                            if (err) {
                                return res.status(500).send({
                                    status: "error",
                                    message: "Error en la peticion!!!"
                                });
                            }
                            if (!productos || productos.length <= 0) {
                                return res.status(500).send({
                                    status: "error",
                                    message: "No hay productos que coincidan con tu busqueda"
                                });
                            }
                            return res.status(200).send({
                                status: "success",
                                productos
                            });
                        })
                    break;
                case "menos":
                    Producto.find({ deporte: deporte }).sort('precio')
                        .exec((err, productos) => {
                            if (err) {
                                return res.status(500).send({
                                    status: "error",
                                    message: "Error en la peticion!!!"
                                });
                            }
                            if (!productos || productos.length <= 0) {
                                return res.status(500).send({
                                    status: "error",
                                    message: "No hay productos que coincidan con tu busqueda"
                                });
                            }
                            return res.status(200).send({
                                status: "success",
                                productos
                            });
                        })
                    break;
                default:
                    Producto.find({ deporte: deporte })
                        .exec((err, productos) => {
                            if (err) {
                                return res.status(500).send({
                                    status: "error",
                                    message: "Error en la peticion!!!"
                                });
                            }
                            if (!productos || productos.length <= 0) {
                                return res.status(500).send({
                                    status: "error",
                                    message: "No hay productos que coincidan con tu busqueda"
                                });
                            }
                            return res.status(200).send({
                                status: "success",
                                productos
                            });
                        })
                    break;
            }
        } else {
            return res.status(500).send({
                status: "error",
                message: "El orden no esta permitido"
            });
        }
    },
    // Sacar todas las preguntas
    getPreguntas: (req, res) => {
        Pregunta.find((err, preguntas) => {
            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: 'Error al devolver las preguntas'
                });
            }

            if (!preguntas) {
                return res.status(404).send({
                    status: "error",
                    message: 'No hay preguntas disponibles'
                });
            }

            return res.status(200).send({
                status: "success",
                preguntas
            });
        });
    },
    // A??adir una pregunta
    newPregunta: (req, res) => {
        var data = req.body;
        var pregunta = new Pregunta();

        try {
            var validate_pregunta = !validator.isEmpty(data.pregunta);
            var validate_respuesta = !validator.isEmpty(data.respuesta);
        } catch (err) {
            return res.status(200).send({
                status: "error",
                message: 'Faltan datos por enviar !!!'
            });
        }

        if (validate_pregunta && validate_respuesta) {
            pregunta.pregunta = data.pregunta;
            pregunta.respuesta = data.respuesta;

            pregunta.save((err, preguntaNew) => {
                if (err || !preguntaNew) {
                    return res.status(404).send({
                        status: "error",
                        message: "No se ha podido guardar la pregunta!!!"
                    });
                }

                return res.status(200).send({
                    status: "success",
                    preguntaNew
                });

            });

        } else {
            return res.status(404).send({
                status: "error",
                message: "Los datos no son validos!!!"
            });
        }
    },
    // Actualizar una pregunta
    updatePregunta: (req, res) => {
        var preguntaId = req.params.id;
        var data = req.body;

        try {
            var validate_pregunta = !validator.isEmpty(data.pregunta);
            var validate_respuesta = !validator.isEmpty(data.respuesta);
        } catch (err) {
            return res.status(200).send({
                status: "error",
                message: 'Faltan datos por enviar !!!'
            });
        }

        if (validate_respuesta && validate_pregunta) {
            Pregunta.findByIdAndUpdate({ _id: preguntaId }, data, (err, preguntaUpdate) => {
                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: 'Error al actualizar'
                    });
                }

                if (!preguntaUpdate) {
                    return res.status(404).send({
                        status: "error",
                        message: 'No existe esa pregunta'
                    });
                }

                return res.status(200).send({
                    status: "success",
                    preguntaUpdate
                });
            });
        }
    },
    // Eliminar una pregunta
    deletePregunta: (req, res) => {
        var preguntaId = req.params.id;

        if (!preguntaId || preguntaId == null) {
            return res.status(404).send({
                status: "error",
                message: "No existe ese identificador"
            });
        }

        Pregunta.findOneAndDelete({ _id: preguntaId }, (err, preguntaDelete) => {
            if (err || !preguntaDelete) {
                return res.status(500).send({
                    status: "error",
                    message: "No se ha eliminado ninguna pregunta!!!"
                });
            }

            return res.status(200).send({
                status: "success",
                preguntaDelete
            });
        });
    },
    // Buscar un usuario por usuario y contrase??a
    comprobarUsuario: async (req, res) => {
        var data = req.body;

        Usuario.findOne({ usuario: data.usuario}, async (err, usuario) => {

            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Error al recoger los datos"
                });
            }

            if (!usuario || usuario.length == 0) {
                return res.status(404).send({
                    status: "error",
                    message: "Ese usuario no existe"
                });
            }

            if(usuario){
                const verificado = await Usuario.comparePassword(data.password, usuario.password);
                
                if(verificado){
                    const payload = {
                        usuario: data.usuario,
                        password: data.password,
                        id: data._id
                    }
                    const token = jwt.sign(payload, app.get("llave"), { expiresIn: 1440 });
        
                    return res.status(200).send({
                        status: "success",
                        token
                    });
                }else{
                    return res.status(404).send({
                        status: "error",
                        message: "Las contrase??as no coinciden!!!"
                    });
                }
            }

            
        });
    },
    // Devolver datos de un usuario en concreto
    getUsuario: (req, res) => {
        var token = req.body; //Recibes el token


        // en este caso, recoge el token y lo descifra, si no da error, busca en la base de datos
        jwt.verify(token.token, app.get("llave"), (err, user) => {
            if (err) {
                return res.status(404).send({
                    status: "error",
                    message: "Hay un error en los datos"
                });
            }

            Usuario.find({ usuario: user.usuario}, (err, usuario) => {
                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: "Error al comprobar"
                    });
                }

                if (!usuario || usuario.length == 0) {
                    return res.status(404).send({
                        status: "error",
                        message: "No existe ese usuario"
                    });
                }

                return res.status(200).send({
                    status: "success",
                    usuario
                });
            });
        })
    },
    // Sacar todos los usuarios
    getUsuarios: (req, res) => {
        Usuario.find().exec((err, usuarios) => {
            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Error al devolver los usuarios"
                });
            }

            if (!usuarios || usuarios.length == 0) {
                return res.status(404).send({
                    status: "error",
                    message: "No hay usuarios"
                });
            }

            return res.status(200).send({
                status: "success",
                usuarios
            });
        });
    },
    // Crear un nuevo usuario
    newUsuario: async (req, res) => {
        try {
            const { usuario, correo, password, nombre, apellidos, roles, direcciones } = req.body;
            
            const newUser = new Usuario({ usuario: usuario, password: await Usuario.encrypt(password), correo: correo, nombre: nombre, apellidos: apellidos, direcciones: direcciones });

            if (req.body.roles) {
                const foundRoles = await Role.find({ name: { $in: roles } });
                newUser.roles = foundRoles.map(role => role._id);
            } else {
                const role = await Role.findOne({ name: "usuario" });
                newUser.roles = role._id;
            }

            newUser.save((err, userAdd) =>{
                if(err) return res.status(500).send({status: "error", message: "Error al guardar el usuario"});

                return res.status(200).send({
                    status: "success",
                    userAdd
                });
            });
        } catch (error) {
            console.error(error)
        }
    },
    // Comprobar si un usuario es admin
    userAdmin: async (req, res) =>{
        var token = req.body.token;
        
        try {

            const decoded = jwt.verify(token, config.llave);

            const user = await Usuario.findOne({usuario: decoded.usuario }, {password: 0});
            if(!user) return res.status(400).send({status: "error", message: "No se ha encontrado el usuario"});

            const roles = await Role.find({_id: { $in: user.roles }});

            for(let i = 0; i < roles.length; i++){
                if(roles[i].name === "admin"){
                    // next();
                    return res.status(200).send({
                        status: "success",
                        message: "Eres admin"
                    });
                }
            }

            return res.status(403).send({
                status: "error",
                message: "No eres admin"
            })

        } catch (error) {
            console.log(error);
            return res.status(500).send({message: "No funciono"});
        }

    },
    updateUser: async (req, res)=>{
        try {

            var usuarioId = req.params.id;

            const updateUser = req.body;

            /* await Usuario.findOne({_id: usuarioId},async (err,usuario) =>{
                console.log(updateUser.password+ " primero");
                console.log("---------------- 1");
                if(updateUser.password != usuario.password){
                    updateUser.password = await Usuario.encrypt(updateUser.password);
                    console.log(updateUser.password);
                    console.log("---------------- Dentro");
                    exit;
                }
            }) */
            const usuario = await Usuario.findOne({_id: usuarioId});
            if(updateUser.password != usuario.password){
                updateUser.password = await Usuario.encrypt(updateUser.password);
            }

            // updateUser.password = await Usuario.encrypt(updateUser.password);

            Usuario.findByIdAndUpdate({ _id: usuarioId }, updateUser, (err, usuarioUpdate) => {
                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: 'Error al actualizar'
                    });
                }

                if (!usuarioUpdate) {
                    return res.status(404).send({
                        status: "error",
                        message: 'No existe ese usuario'
                    });
                }

                return res.status(200).send({
                    status: "success",
                    usuarioUpdate
                });
            });
            
        } catch (error) {
            console.error(error)
        }
    },
    deleteUser: (req,res) =>{
        
        let userId = req.params.id;

        Usuario.findOneAndRemove({_id : userId}, (err, deleteUser) =>{
            if(err){
                return res.status(500).send({
                    "status": "error",
                    "message": "Error al eliminar el usuario"
                });
            }

            return res.status(200).send({
                "status" : "success",
                "user" : deleteUser
            })
        });
        
    },
    newPedido: (req,res) =>{

        const body = req.body;

        let pedido = new Pedido();

        pedido.id_usuario = body.id_usuario;
        pedido.pedido = body.pedido;

        pedido.save((err,newPedido) => {
            if(err || !newPedido){
                res.status(500).send({
                    "status" : "error",
                    "message" : "Ha habido un error al crear el pedido"
                });
            }

            res.status(200).send({
                "status" : "success",
                "message" : newPedido
            })


        });
        
    },
    updatePedido: (req,res)=>{

        const pedidoId = req.params.id;

        const body = req.body;

        // let pedido = new Pedido();

        /* pedido.id_usuario = body.id_usuario;
        pedido.pedido = body.pedido; */

        Pedido.findByIdAndUpdate({_id: pedidoId},body, (err, updatePedido) => {
            if(err) {
                res.status(500).send({
                    "status" : "error",
                    "message" : "Hay un error al actualizar"
                });
            }

            if (!updatePedido) {
                return res.status(404).send({
                    status: "error",
                    message: "No existe ese producto"
                });
            }

            res.status(200).send({
                "status" : "success",
                "pedido" : updatePedido
            })
        })

    },
    getPedidos: (req,res) =>{

        const usuarioId = req.params.id;

        Pedido.find({"id_usuario" : usuarioId}, (err, pedidos) => {

            if(err){
                res.status(500).send({
                    "status" : "error",
                    "message" : "Error en la consulta"
                });
            }
            
            if(!pedidos){
                res.status(404).send({
                    "status" : "error",
                    "message" : "No hay pedidos para ese usuario"
                });
            }

            res.status(200).send({
                "status" : "success",
                "pedidos" : pedidos
            })

        })
        
    },
    getPedido: (req,res) =>{

        const pedidoId = req.params.id;

        Pedido.find({"_id" : pedidoId}, (err, pedidos) => {

            if(err || !pedidos){
                res.status(500).send({
                    "status" : "error",
                    "message" : "Error en la consulta"
                });
            }

            res.status(200).send({
                "status" : "success",
                "pedidos" : pedidos
            })

        })
        
    },
    deletePedido: (req,res) =>{
        const pedidoId = req.params.id;

        Pedido.findByIdAndRemove(pedidoId, (err, pedidoDelete) => {
            if(err){
                return res.status(500).send({
                    "status" : "error",
                    "message" : "No existe ese pedido"
                })
            }

            return res.status(200).send({
                "status" : "success",
                "message" : pedidoDelete
            })
        });
    }
}

module.exports = controller;