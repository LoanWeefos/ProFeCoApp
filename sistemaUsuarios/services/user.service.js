const { Usuario } = require('../../models');
const { Mercado } = require('../../models');
const { Consumidor } = require('../../models');
const cacheUtil = require('../utils/cache.util');

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

exports.findUserById = (id) => {
    return Usuario.findByPk(id);
}

exports.logoutUser = (token, exp) => {
    const now = new Date();
    const expire = new Date(exp * 1000);
    const milliseconds = expire.getTime() - now.getTime();
    return cacheUtil.set(token, token, milliseconds);
}