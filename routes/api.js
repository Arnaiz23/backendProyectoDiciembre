'use strict'

var express = require("express");
var apiController = require("../controllers/api");

var router = express.Router();

var multipart = require("connect-multiparty");
var md_upload = multipart({uploadDir: "./upload/productos"});

var autorizacion = require("../middleweare/authJWT");

// Usar middleweare para peticiones que solo haga admin, para editar, eliminar y añadir productos y tal
// router.post("/new-producto", middlewareNombre, apiController.newProducto);


// Rutas
router.get("/prueba", apiController.prueba); //Ruta de prueba
router.get("/productos", apiController.getProductos); //Todos los productos
router.get("/productos/:deporte", apiController.getDeporte); //Todos los productos de un deporte en concreto
router.get("/producto/:id", apiController.getProducto); //Un solo producto
router.post("/new-producto", [autorizacion.verifyToken, autorizacion.isAdmin], apiController.newProducto); //Añadir un producto
router.delete("/delete-producto/:id", [autorizacion.verifyToken, autorizacion.isAdmin], apiController.deleteProducto); //Eliminar un producto por id
router.put("/update-producto/:id", [autorizacion.verifyToken, autorizacion.isAdmin], apiController.updateProducto); //Actualizar un producto por id
router.get("/get-image/:image", apiController.getImage); //Devolver la imagen
router.get("/search-productos/:search", apiController.searchProductos); //Buscador de productos
router.get("/order-productos/:order/:deporte", apiController.orderProductos); //Ordenar productos
router.get("/preguntas", apiController.getPreguntas); //Sacar todas las preguntas
router.post("/new-pregunta", [autorizacion.verifyToken, autorizacion.isAdmin], apiController.newPregunta); //Añadir una nueva pregunta
router.put("/update-pregunta/:id", [autorizacion.verifyToken, autorizacion.isAdmin], apiController.updatePregunta); //Actualizar una pregunta
router.delete("/delete-pregunta/:id", [autorizacion.verifyToken, autorizacion.isAdmin], apiController.deletePregunta); //Eliminar una pregunta
router.post("/getUsuario", apiController.getUsuario); //Devolver datos de un usuario

router.post("/comprobar-usuario", apiController.comprobarUsuario); //Comprobar un usuario por clave y usuario
router.get("/usuarios", apiController.getUsuarios); //Devuelve todos los usuarios
router.post("/new-usuario", apiController.newUsuario); //Crear un nuevo usuario
router.post("/admin-user", apiController.userAdmin); //Comprobar si un usuario es admin
router.put("/updateUsuario/:id", apiController.updateUser); //Actualizar un usuario

module.exports = router;