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
        const product = await ProductService.createProduct(req.body);
        return res.json(product);
    } catch (error) {
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
}

exports.registerImg = async function (req, res) {
    const { originalname, path } = req.file;
    try {
        const img = await ProductService.registerImg({filename: originalname, path});
        return res.json(img);
    } catch (error) {
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
};
