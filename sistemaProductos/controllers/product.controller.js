const ProductService = require('../services/product.service');

exports.getProduct = async (req, res) => {
    try {
        const product = await ProductService.getProduct(req.params.id);
        return res.json(product);
    } catch (error) {
        const errorMessage = error.message;
        return res.status(500).json({ message: 'Error interno del servidor.', error: errorMessage });
    }
}

exports.getAllProducts = async (req, res) => {
    try {
        const products = await ProductService.getAllProducts();
        return res.json(products);
    } catch (error) {
        const errorMessage = error.message;
        return res.status(500).json({ message: 'Error interno del servidor.', error: errorMessage });
    }
}

exports.createProduct = async (req, res) => {
    try {
        const product = await ProductService.createProduct(req.body);
        return res.json(product);
    } catch (error) {
        const errorMessage = error.message;
        return res.status(500).json({ message: 'Error interno del servidor.', error: errorMessage });
    }
}

exports.putProduct = async (req, res) => {
    try {
        const updatedProduct = await ProductService.updateProduct(req.body, req.params.id);
        return res.json(updatedProduct);
    } catch (error) {
        const errorMessage = error.message;
        return res.status(500).json({ message: 'Error interno del servidor.', error: errorMessage });
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const product = await ProductService.deleteProduct(req.params.id);
        return res.json(product);
    } catch (error) {
        const errorMessage = error.message;
        return res.status(500).json({ message: 'Error interno del servidor.', error: errorMessage });
    }
}

exports.registerImg = async function (req, res) {
    const { originalname, path } = req.file;
    const productoId = req.body.productoId;
    try {
        const img = await ProductService.registerImg({ filename: originalname, path, productoId });
        return res.json(img);
    } catch (error) {
        const errorMessage = error.message;
        return res.status(500).json({ message: 'Error interno del servidor.', error: errorMessage, productId });
    }
}

exports.getImg = async (req, res) => {
    try {
        const img = await ProductService.getImg(req.params.id);
        return res.json(img);
    } catch (error) {
        const errorMessage = error.message;
        return res.status(500).json({ message: 'Error interno del servidor.', error: errorMessage });
    }
}

exports.deleteImg = async (req, res) => {
    try {
        const img = await ProductService.deleteImg(req.params.id);
        return res.json(img);
    } catch (error) {
        const errorMessage = error.message;
        return res.status(500).json({ message: 'Error interno del servidor.', error: errorMessage });
    }
}

exports.addCategory = async function (req, res) {
    try {
        const category = await ProductService.createCategory(req.body);
        return res.json(category);
    } catch (error) {
        const errorMessage = error.message;
        return res.status(500).json({ message: 'Error interno del servidor.', error: errorMessage });
    }
}

exports.getCategories = async (req, res) => {
    try {
        const categories = await ProductService.getCategories(req.params.id);
        return res.json(categories);
    } catch (error) {
        const errorMessage = error.message;
        return res.status(500).json({ message: 'Error interno del servidor.', error: errorMessage });
    }
}

exports.deleteCategories = async (req, res) => {
    try {
        const categories = await ProductService.deleteCategories(req.params.id);
        return res.json(categories);
    } catch (error) {
        const errorMessage = error.message;
        return res.status(500).json({ message: 'Error interno del servidor.', error: errorMessage });
    }
}
