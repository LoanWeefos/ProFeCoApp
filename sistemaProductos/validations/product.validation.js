const Joi = require('joi');

module.exports = {
    create: Joi.object().keys({
        nombre: Joi.string().required(),
        precio: Joi.number().required(),
        descripcion: Joi.string().required(),
        imagen: Joi.any
    })
}