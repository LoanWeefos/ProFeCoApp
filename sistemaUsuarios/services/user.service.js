const { Usuario } = require('../../models');
const { Mercado } = require('../../models');
const { Consumidor } = require('../../models');
const cacheUtil = require('../../utils/cache.util');

exports.createUser = (user) => {
    return Usuario.create(user);
}

exports.createMercado = (mercado) => {
    return Mercado.create(mercado);
}

exports.createConsumidor = (consumidor) => {
    return Consumidor.create(consumidor);
}

exports.findUserByEmail = (correo) => {
    return Usuario.findOne({
        where: {
            correo: correo
        }
    })
}

exports.findUserById = async (id) => {
    return Usuario.findByPk(id);
}

exports.deleteUser = async (id) => {
    return Usuario.destroy({
        where: {
            id: id
        }
    });
}

exports.findAllUsers = async () => {
    const usuarios = await Usuario.findAll({
        include: [
            {
                model: Mercado,
                required: false
            },
            {
                model: Consumidor,
                required: false
            }
        ]
    });
    return usuarios;
}

exports.findMercadoById = (id) => {
    return Mercado.findOne({
        where: {
            usuarioId: id
        }
    })
}

exports.updateMercado = async (id, estado) => {
    const mercado = await Mercado.findOne({
        where: {
            usuarioId: id
        }
    });
    if (!mercado) {
        return res.status(404).json({ message: 'Mercado no encontrado' });
    }
    return mercado.update({ estado: estado });
}

exports.findConsumidorById = (id) => {
    return Consumidor.findOne({
        where: {
            usuarioId: id
        }
    })
}

exports.logoutUser = (token, exp) => {
    const now = new Date();
    const expire = new Date(exp * 1000);
    const milliseconds = expire.getTime() - now.getTime();
    return cacheUtil.set(token, token, milliseconds);
}