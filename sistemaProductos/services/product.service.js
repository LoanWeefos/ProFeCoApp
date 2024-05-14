const { Producto } = require('../../models');
const { Imagen } = require('../../models');
const { Categoria } = require('../../models');
const { ListaDeseos } = require('../../models');
const { Calificacion } = require('../../models');
const { Reporte } = require('../../models');
const { Usuario } = require('../../models');
const { Mercado } = require('../../models');
const { Op } = require('sequelize');

exports.getProduct = (productId) => {
    return Producto.findByPk(productId);
}

exports.getAllProducts = () => {
    return Producto.findAll();
}

exports.findProductsByQuery = async (query) => {
    try {
        const productsByName = await Producto.findAll({
            order: ["createdAt"],
            where: {
                nombre: {
                    [Op.like]: "%" + query + "%",
                },
            }
        });

        const categories = await Categoria.findAll({
            order: ["createdAt"],
            where: {
                nombre: {
                    [Op.like]: "%" + query + "%",
                },
            }
        });

        const productIdsFromCategories = categories.map(category => category.productoId);

        const productsByCategory = await Producto.findAll({
            where: {
                id: productIdsFromCategories
            }
        });

        const products = [...productsByName, ...productsByCategory];

        const uniqueProducts = Array.from(new Set(products.map(product => product.id))).map(id => {
            return products.find(product => product.id === id);
        });

        return uniqueProducts;
    } catch (error) {
        throw new Error('Error al buscar productos', error);
    }
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

exports.createList = (productList) => {
    return ListaDeseos.create(productList);
}

exports.getList = (productoId, usuarioId) => {
    return ListaDeseos.findOne({
        where: {
            usuarioId: usuarioId,
            productoId: productoId
        }
    });
}

exports.getAllList = (usuarioId) => {
    return ListaDeseos.findAll({
        where: {
            usuarioId: usuarioId
        }
    });
}

exports.getWishlist = async (usuarioIdMercado, desde, hasta, nombreProducto) => {
    try {
        const productos = await Producto.findAll({
            where: {
                usuarioId: usuarioIdMercado
            }
        });

        const productoIds = productos.map(producto => producto.id);

        let whereClause = {
            productoId: productoIds
        };

        if (nombreProducto) {
            whereClause.nombreProducto = {
                [Op.like]: `%${nombreProducto}%`
            };
        }

        if (desde) {
            whereClause.createdAt = {
                [Op.gte]: new Date(desde)
            };
        }

        if (hasta) {
            if (whereClause.createdAt) {
                whereClause.createdAt[Op.lte] = new Date(hasta);
            } else {
                whereClause.createdAt = {
                    [Op.lte]: new Date(hasta)
                };
            }
        }

        const list = await ListaDeseos.findAll({
            where: whereClause
        });

        return list;
    } catch (error) {
        console.error('Error al obtener los reportes del mercado:', error);
        throw error;
    }
};

exports.deleteFromList = (usuarioId, productoId) => {
    return ListaDeseos.destroy({
        where: {
            usuarioId: usuarioId,
            productoId: productoId
        }
    });
}

exports.createCalif = (calif) => {
    return Calificacion.create(calif);
}

exports.getCalif = (productoId, usuarioId) => {
    return Calificacion.findOne({
        where: {
            usuarioId: usuarioId,
            productoId: productoId
        }
    });
}

exports.getCalifMercado = async (usuarioIdMercado, desde, hasta, nombreProducto) => {
    try {
        const productos = await Producto.findAll({
            where: {
                usuarioId: usuarioIdMercado
            }
        });

        const productoIds = productos.map(producto => producto.id);

        let whereClause = {
            productoId: productoIds
        };

        if (nombreProducto) {
            whereClause.nombreProducto = {
                [Op.like]: `%${nombreProducto}%`
            };
        }


        if (desde) {
            whereClause.createdAt = {
                [Op.gte]: new Date(desde)
            };
        }

        if (hasta) {
            if (whereClause.createdAt) {
                whereClause.createdAt[Op.lte] = new Date(hasta);
            } else {
                whereClause.createdAt = {
                    [Op.lte]: new Date(hasta)
                };
            }
        }

        const calif = await Calificacion.findAll({
            where: whereClause
        });

        return calif;
    } catch (error) {
        console.error('Error al obtener los reportes del mercado:', error);
        throw error;
    }
};

exports.report = (reporte) => {
    return Reporte.create(reporte);
}

exports.getReport = (productoId) => {
    return Reporte.findAll({
        where: {
            productoId: productoId
        }
    });
}

exports.getReports = () => {
    return Reporte.findAll();
}

exports.getReportsTabla = (req, res) => {
    return Reporte.findAll({
        include: [
            {
                model: Producto,
                include: [
                    Usuario,
                    {
                        model: Usuario,
                        include: [Mercado]
                    }
                ]
            }
        ]
    });
}

exports.getInconsistencias = async (usuarioIdMercado, desde, hasta, nombreProducto) => {
    try {
        const productos = await Producto.findAll({
            where: {
                usuarioId: usuarioIdMercado
            }
        });

        const productoIds = productos.map(producto => producto.id);

        let whereClause = {
            productoId: productoIds
        };

        if (nombreProducto) {
            whereClause.nombreProducto = {
                [Op.like]: `%${nombreProducto}%`
            };
        }


        if (desde) {
            whereClause.createdAt = {
                [Op.gte]: new Date(desde)
            };
        }

        if (hasta) {
            if (whereClause.createdAt) {
                whereClause.createdAt[Op.lte] = new Date(hasta);
            } else {
                whereClause.createdAt = {
                    [Op.lte]: new Date(hasta)
                };
            }
        }

        const reportes = await Reporte.findAll({
            where: whereClause
        });

        return reportes;
    } catch (error) {
        console.error('Error al obtener los reportes del mercado:', error);
        throw error;
    }
};


exports.updateReport = async (id, estado) => {
    const reporte = await Reporte.findByPk(id);
    if (!reporte) {
        return res.status(404).json({ message: 'Reporte no encontrado' });
    }
    return reporte.update({ estado: estado });
}

