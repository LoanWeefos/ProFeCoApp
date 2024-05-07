const { Producto } = require('../../models');

exports.getProduct = (productId) => {
    return Producto.findByPk(productId);
}

exports.getAllProducts = () => {
    return Producto.findAll();
}

exports.createProduct = (productData) => {
    return Producto.create(productData);
}