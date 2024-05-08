const { Producto } = require('../../models');
const { Imagen } = require('../../models');

exports.getProduct = (productId) => {
    return Producto.findByPk(productId);
}

exports.getAllProducts = () => {
    return Producto.findAll();
}

exports.createProduct = (productData) => {
    return Producto.create(productData);
}

exports.registerImg = (img) => {
    return Imagen.create(img);
}