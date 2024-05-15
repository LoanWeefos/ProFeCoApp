const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.config');

exports.verifyToken = (token) => {
    try {
        return jwt.verify(token, jwtConfig.secret);
    } catch (error) {
        throw new Error('Token inválido o expirado');
    }
};

exports.createToken = (data) => {
    try {
        return jwt.sign(data, jwtConfig.secret, { expiresIn: jwtConfig.ttl });
    } catch (error) {
        throw new Error('Error al crear el token');
    }
};