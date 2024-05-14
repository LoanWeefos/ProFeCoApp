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

exports.queryProducts = async (req, res) => {
    try {
        const query = req.params.query;
        const products = await ProductService.findProductsByQuery(query);
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

exports.createList = async (req, res) => {
    try {
        const lista = await ProductService.createList(req.body);
        return res.json(lista);
    } catch (error) {
        const errorMessage = error.message;
        return res.status(500).json({ message: 'Error interno del servidor.', error: errorMessage });
    }
}

exports.getList = async (req, res) => {
    try {
        const lista = await ProductService.getList(req.params.id, req.user.id);
        return res.json(lista);
    } catch (error) {
        const errorMessage = error.message;
        return res.status(500).json({ message: 'Error interno del servidor.', error: errorMessage });
    }
}

exports.getAllList = async (req, res) => {
    try {
        const lista = await ProductService.getAllList(req.user.id);
        return res.json(lista);
    } catch (error) {
        const errorMessage = error.message;
        return res.status(500).json({ message: 'Error interno del servidor.', error: errorMessage });
    }
}

exports.getWishlist = async (req, res) => {
    try {
        const desde = req.body.desde || null;
        const hasta = req.body.hasta || null;
        const producto = req.body.nombreProducto || null;

        const lista = await ProductService.getWishlist(req.user.id, desde, hasta, producto);
        return JSON.stringify(lista);
    } catch (error) {
        const errorMessage = error.message;
        return res.status(500).json({ message: 'Error interno del servidor.', error: errorMessage });
    }
}

exports.deleteFromList = async (req, res) => {
    try {
        const product = await ProductService.deleteFromList(req.user.id, req.params.id);
        return res.json(product);
    } catch (error) {
        const errorMessage = error.message;
        return res.status(500).json({ message: 'Error interno del servidor.', error: errorMessage });
    }
}

exports.createCalif = async (req, res) => {
    try {
        const liked = req.body.liked;
        const comentario = req.body.comentario;
        const productoId = req.body.productoId;
        const usuarioId = req.user.id;
        const nombreProducto = req.body.nombreProducto;
        const lista = await ProductService.createCalif({ liked, comentario, productoId, usuarioId, nombreProducto });
        return res.json(lista);
    } catch (error) {
        const errorMessage = error.message;
        return res.status(500).json({ message: 'Error interno del servidor.', error: errorMessage });
    }
}

exports.getCalif = async (req, res) => {
    try {
        const calif = await ProductService.getCalif(req.params.id, req.user.id);
        return res.json(calif);
    } catch (error) {
        const errorMessage = error.message;
        return res.status(500).json({ message: 'Error interno del servidor.', error: errorMessage });
    }
}

exports.getCalifMercado = async (req, res) => {
    try {
        const desde = req.body.desde || null;
        const hasta = req.body.hasta || null;
        const producto = req.body.nombreProducto || null;

        const calif = await ProductService.getCalifMercado(req.user.id, desde, hasta, producto);
        return JSON.stringify(calif);
    } catch (error) {
        const errorMessage = error.message;
        return res.status(500).json({ message: 'Error interno del servidor.', error: errorMessage });
    }
}

exports.report = async (req, res) => {
    try {
        const descripcion = req.body.descripcion;
        const estado = req.body.estado;
        const productoId = req.body.productoId;
        const nombreProducto = req.body.nombreProducto;
        const reporte = await ProductService.report({ descripcion, estado, productoId, nombreProducto });
        return res.json(reporte);
    } catch (error) {
        const errorMessage = error.message;
        return res.status(500).json({ message: 'Error interno del servidor.', error: errorMessage });
    }
}

exports.getReport = async (req, res) => {
    try {
        const lista = await ProductService.getReport(req.params.id);
        return res.json(lista);
    } catch (error) {
        const errorMessage = error.message;
        return res.status(500).json({ message: 'Error interno del servidor.', error: errorMessage });
    }
}

exports.getReports = async (req, res) => {
    try {
        const lista = await ProductService.getReports();
        return res.json(lista);
    } catch (error) {
        const errorMessage = error.message;
        return res.status(500).json({ message: 'Error interno del servidor.', error: errorMessage });
    }
}

exports.getReportsTabla = async (req, res) => {
    try {
        const lista = await ProductService.getReportsTabla();
        return res.json(lista);
    } catch (error) {
        const errorMessage = error.message;
        return res.status(500).json({ message: 'Error interno del servidor.', error: errorMessage });
    }
}

exports.getInconsistencias = async (req, res) => {
    try {
        const desde = req.body.desde || null;
        const hasta = req.body.hasta || null;
        const producto = req.body.producto || null;

        const lista = await ProductService.getInconsistencias(req.user.id, desde, hasta, producto);
        return JSON.stringify(lista);
    } catch (error) {
        const errorMessage = error.message;
        return res.status(500).json({ message: 'Error interno del servidor.', error: errorMessage });
    }
}

exports.updateReport = async (req, res) => {
    try {
        const user = await ProductService.updateReport(req.params.id, req.body.estado);
        return res.json(user);
    } catch (error) {
        const errorMessage = error.message;
        return res.status(500).json({ message: 'Error interno del servidor.', error: errorMessage });
    }
}