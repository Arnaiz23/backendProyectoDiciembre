'use strict'

var express = require("express");
var apiController = require("../controllers/api");

var router = express.Router();

var multipart = require("connect-multiparty");
var md_upload = multipart({uploadDir: "./upload/productos"});

// Rutas
router.get("/prueba", apiController.prueba); //Ruta de prueba
router.get("/productos", apiController.getProductos); //Todos los productos
router.get("/productos/:deporte", apiController.getDeporte); //Todos los productos de un deporte en concreto
router.get("/producto/:id", apiController.getProducto); //Un solo producto
router.post("/new-producto", apiController.newProducto); //Añadir un producto
router.delete("/delete-producto/:id", apiController.deleteProducto); //Eliminar un producto por id
router.put("/update-producto/:id", apiController.updateProducto); //Actualizar un producto por id
router.get("/preguntas", apiController.getPreguntas); //Sacar todas las preguntas

module.exports = router;