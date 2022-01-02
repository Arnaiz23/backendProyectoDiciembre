'use strict'

var validator = require("validator");
var fs = require("fs");
var path = require("path");

// const { validate, exists } = require("../models/producto");
var Producto = require("../models/producto");
var Usuario = require("../models/usuario");
var Pregunta = require("../models/preguntas-frecuentes");

var controller = {
    prueba: (req, res) =>{
        res.status(200).send({
            status: "success",
            message: "Prueba correcta"
        })
    },
    // Todos los productos
    getProductos: (req, res) =>{
        var query = Producto.find();

        query.exec((err, productos) =>{
            if(err){
                res.status(500).send({
                    status: "error",
                    message: "Error al devolver los productos"
                });
            }

            if(!productos){
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
    getDeporte: (req, res) =>{
        var deporte = req.params.deporte;

        Producto.find({deporte: deporte}, (err, productos) =>{
            if(err){
                return res.status(500).send({
                    status: "error",
                    message: "Error al devolver los productos de "+deporte
                });
            }

            if(!productos || productos.length == 0){
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
    getProducto: (req, res) =>{
        var productoId = req.params.id;

        if(!productoId || productoId == null){
            return res.status(404).send({
                status: "error",
                message: "No existe ese identificador !!!"
            });
        }

        Producto.findById(productoId, (err, producto) =>{
            if(!producto || err){
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
    // Añadir producto
    newProducto: (req, res) =>{
        var data = req.body;
        
        try{
            var validate_nombre = !validator.isEmpty(data.nombre);
            var validate_marca = !validator.isEmpty(data.marca);
            var validate_tipo = !validator.isEmpty(data.tipo);
            var validate_descripcionCorta = !validator.isEmpty(data.descripcionCorta);
            var validate_descripcion = !validator.isEmpty(data.descripcion);
            var validate_precio = !validator.isEmpty(data.precio);
            var validate_deporte = !validator.isEmpty(data.deporte);
            var validate_disponibilidad = !validator.isEmpty(data.disponibilidad);
            
        }catch(err){
            return res.status(200).send({
                status: "error",
                message: 'Faltan datos por enviar !!!'
            });
        }

        if(validate_nombre && validate_marca && validate_tipo && validate_descripcionCorta && validate_descripcion && validate_precio && validate_deporte && validate_disponibilidad){
            var producto = new Producto();

            producto.nombre = data.nombre;
            producto.marca = data.marca;
            producto.tipo = data.tipo;
            producto.descripcionCorta = data.descripcionCorta;
            producto.descripcion = data.descripcion;
            producto.precio = data.precio;
            producto.deporte = data.deporte;
            producto.disponibilidad = data.disponibilidad;

            if(data.image){
                producto.image = data.image;
            }else{
                producto.image = null;
            }

            producto.save((err, productoStored) =>{
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

        }else{
            return res.status(404).send({
                status: "error",
                message: 'Los datos no son validos'
            });
        }
    },
    // Eliminar un producto
    deleteProducto: (req, res) =>{
        var productoId = req.params.id;

        if(!productoId || productoId == null){
            return res.status(404).send({
                status: "error",
                message: "No existe ese identificador !!!"
            });
        }

        Producto.findOneAndDelete({_id: productoId}, (err, productoDelete) =>{
            if(err || !productoDelete){
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
    updateProducto: (req, res) =>{
        var productoId = req.params.id;
        var data = req.body;

        try{
            var validate_nombre = !validator.isEmpty(data.nombre);
            var validate_marca = !validator.isEmpty(data.marca);
            var validate_tipo = !validator.isEmpty(data.tipo);
            var validate_descripcionCorta = !validator.isEmpty(data.descripcionCorta);
            var validate_descripcion = !validator.isEmpty(data.descripcion);
            var validate_precio = !validator.isEmpty(data.precio);
            var validate_deporte = !validator.isEmpty(data.deporte);
            var validate_disponibilidad = !validator.isEmpty(data.disponibilidad);
            
        }catch(err){
            return res.status(200).send({
                status: "error",
                message: 'Faltan datos por enviar !!!'
            });
        }

        if(validate_nombre && validate_marca && validate_tipo && validate_descripcionCorta && validate_descripcion && validate_precio && validate_deporte && validate_disponibilidad){
            
            Producto.findByIdAndUpdate({_id: productoId}, data, (err, productoUpdate) =>{
                if(err){
                    return res.status(500).send({
                        status: "error",
                        message: "Error al actualizar"
                    });
                }

                if(!productoUpdate){
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

        }else{
            return res.status(404).send({
                status: "error",
                message: 'Los datos no son validos'
            });
        }
    },
    // Sacar una imagen
    getImage: (req, res) =>{
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
    // Sacar todas las preguntas
    getPreguntas: (req, res) =>{
        Pregunta.find((err, preguntas) =>{
            if(err){
                return res.status(500).send({
                    status: "error",
                    message: 'Error al devolver las preguntas'
                });
            }

            if(!preguntas){
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
    // Añadir una pregunta
    newPregunta: (req, res) =>{
        var data = req.body;
        var pregunta = new Pregunta();

        try{
            var validate_pregunta = !validator.isEmpty(data.pregunta);
            var validate_respuesta = !validator.isEmpty(data.respuesta);
        }catch(err){
            return res.status(200).send({
                status: "error",
                message: 'Faltan datos por enviar !!!'
            });
        }

        if(validate_pregunta && validate_respuesta){
            pregunta.pregunta = data.pregunta;
            pregunta.respuesta = data.respuesta;

            pregunta.save((err, preguntaNew) =>{
                if(err || !preguntaNew){
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

        }else{
            return res.status(404).send({
                status: "error",
                message: "Los datos no son validos!!!"
            });
        }
    },
    // Actualizar una pregunta
    updatePregunta: (req, res) =>{
        var preguntaId = req.params.id;
        var data = req.body;

        try{
            var validate_pregunta = !validator.isEmpty(data.pregunta);
            var validate_respuesta = !validator.isEmpty(data.respuesta);
        }catch(err){
            return res.status(200).send({
                status: "error",
                message: 'Faltan datos por enviar !!!'
            });
        }

        if(validate_respuesta && validate_pregunta){
            Pregunta.findByIdAndUpdate({_id: preguntaId}, data, (err, preguntaUpdate) =>{
                if(err){
                    return res.status(500).send({
                        status: "error",
                        message: 'Error al actualizar'
                    });
                }
    
                if(!preguntaUpdate){
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
    deletePregunta: (req, res) =>{
        var preguntaId = req.params.id;

        if(!preguntaId || preguntaId == null){
            return res.status(404).send({
                status: "error",
                message: "No existe ese identificador"
            });
        }

        Pregunta.findOneAndDelete({_id: preguntaId}, (err, preguntaDelete) =>{
            if(err || !preguntaDelete){
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
    }
}

module.exports = controller;