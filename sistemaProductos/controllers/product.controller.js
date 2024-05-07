const ProductService = require('../services/product.service');

exports.getProduct = async (req, res) => {
    try {
        const product = await ProductService.getProduct(req.params.id);
        return res.json(product);
    } catch (error) {
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
}

exports.getAllProducts = async (req, res) => {
    try {
        const products = await ProductService.getAllProducts();
        return res.json(products);
    } catch (error) {
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
}

exports.createProduct = async (req, res) => {
    try {
        const product = await ProductService.create(req.body);
        return res.json(product);
    } catch (error) {
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
}
