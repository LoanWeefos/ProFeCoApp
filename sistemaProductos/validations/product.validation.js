const Joi = require('joi');

module.exports = {
    create: Joi.object().keys({
        nombre: Joi.string().required(),
        precio: Joi.number().required(),
        oferta: Joi.string().allow('', null),
        descripcion: Joi.string().required(),
        usuarioId: Joi.number().required()
    }),
    category: Joi.object().keys({
        nombre: Joi.string().required(),
        productoId: Joi.number().required()
    })
}