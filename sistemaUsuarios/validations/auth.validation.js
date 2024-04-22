const Joi = require('joi');
const passwordRegex = new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/);

const validatePassword = (value) => {  
    if(!passwordRegex.test(String(value))) { 
        throw new Error('La contraseña debe contener una minúscula, una mayúsculas y un digito.')
    }
}

module.exports = {
    register: Joi.object().keys({
        correo: Joi.string().email().required().messages({
            'string.email': 'El campo de correo electrónico debe ser una dirección de correo electrónico válida',
            'any.required': 'El campo de correo electrónico es obligatorio'
        }),
        contraseña: Joi.string().min(8).max(16).required().external(validatePassword),
        tipo: Joi.string().required()
    }),
    login: Joi.object().keys({
        correo: Joi.string().email().required().messages({
            'string.required': 'El campo de correo electrónico es obligatorio',
            'string.empty': 'El campo de correo electrónico no puede estar vacío',
            'string.email': 'El campo de correo electrónico debe ser una dirección de correo electrónico válida'
        }),
        contraseña: Joi.string().required()
    })
}