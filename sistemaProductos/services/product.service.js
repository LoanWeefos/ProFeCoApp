const { Producto } = require('../../models');
const { Imagen } = require('../../models');
const { Categoria } = require('../../models');

exports.getProduct = (productId) => {
    return Producto.findByPk(productId);
}

exports.getAllProducts = () => {
    return Producto.findAll();
}

exports.createProduct = (productData) => {
    return Producto.create(productData);
}

exports.deleteProduct = async (productId) => {
    const fs = require('fs');
    const path = require('path');
    const producto = Producto.findByPk(productId);
    let pathI;
    let pathParts;
    const img = await Imagen.findOne({
        where: {
            productoId: productId
        }
    });

    if (img) {
        pathI = img.path;
        pathParts = pathI.split('\\');
    }

    const filePath = path.join(__dirname, "../../" + pathParts[0], pathParts[1]);
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('El archivo no existe o no se puede acceder.');
            return;
        }

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error al eliminar el archivo:', err);
                return;
            }
            console.log('El archivo ha sido eliminado correctamente.');
        });
    });
    Producto.destroy({
        where: {
            id: productId
        }
    });
    return producto;
}

exports.registerImg = (img) => {
    return Imagen.create(img);
}

exports.getImg = (productId) => {
    return Imagen.findOne({
        where: {
            productoId: productId
        }
    });
}

exports.deleteImg = (productId) => {
    return Imagen.destroy({
        where: {
            productoId: productId
        }
    });
}

exports.updateProduct = async (product, id) => {
    try {
        const producto = await Producto.findByPk(id);

        if (!producto) {
            throw new Error('El producto no existe.');
        }
        return producto.update(product);
    } catch (error) {
        return product;
    }
}

exports.createCategory = (categoryData) => {
    return Categoria.create(categoryData);
}

exports.getCategories = (productId) => {
    return Categoria.findAll({
        where: {
            productoId: productId
        }
    });
}

exports.deleteCategories = async (productId) => {
    try {
        const deletedCategories = await Categoria.destroy({
            where: {
                productoId: productId
            }
        });
        return deletedCategories;
    } catch (error) {
        throw new Error('Error al eliminar las categorías asociadas al producto.');
    }
}