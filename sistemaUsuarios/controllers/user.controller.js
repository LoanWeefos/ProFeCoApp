const UserService = require('../services/user.service');
const jwtConfig = require('../../config/jwt.config');
const bcryptUtil = require('../utils/bcrypt.util');
const jwtUtil = require('../utils/jwt.util');

exports.register = async (req, res) => {
    const isExist = await UserService.findUserByEmail(req.body.correo);
    if (isExist) {
        return res.status(400).json({
            message: 'El correo ya existe.'
        });
    }
    const hashedPassword = await bcryptUtil.createHash(req.body.contraseña);
    const userData = {
        correo: req.body.correo,
        contraseña: hashedPassword,
        tipo: req.body.tipo
    }
    let user;
    if (req.body.tipo === 'MERCADO') {
        user = await registerMercado(req, res, userData);
    } else if (req.body.tipo === 'CONSUMIDOR') {
        user = await registerConsumidor(req, res, userData);
    } else {
        user = await UserService.createUser(userData);
    }
    const token = await jwtUtil.createToken({ id: user.user.id });

    return res.json({
        data: user,
        access_token: token,
        token_type: 'Bearer',
        expires_in: jwtConfig.ttl,
        message: 'Usuario registrado correctamente.'
    });
}

exports.login = async (req, res) => {
    const user = await UserService.findUserByEmail(req.body.correo);
    if (user) {
        const isMatched = await bcryptUtil.compareHash(req.body.contraseña, user.contraseña);
        if (isMatched) {
            const token = await jwtUtil.createToken({ id: user.id });
            return res.json({
                data: user,
                access_token: token,
                token_type: 'Bearer',
                expires_in: jwtConfig.ttl
            });
        }
    }
    return res.status(400).json({ message: 'Correo o contraseña incorrectos.' });
}

exports.getUser = async (req, res) => {
    const user = await UserService.findUserById(req.user.id);
    return res.json({
        id: user.id,
        tipo: user.tipo,
        message: 'Logrado.'
    });
}

exports.logout = async (req, res) => {
    await UserService.logoutUser(req.token, req.user.exp);
    sessionStorage.clear;
    return res.json({ message: 'Cerrado sesión correctamente.' });
}

async function registerMercado(req, res, userData) {
    const user = await UserService.createUser(userData);
    const mercadoData = {
        nombre: req.body.nombre,
        tipo: req.body.tipoMercado,
        usuarioId: user.id
    };
    const mercado = await UserService.createMercado(mercadoData);

    return { user, mercado };
}

async function registerConsumidor(req, res, userData) {
    const user = await UserService.createUser(userData);
    const consumidorData = {
        nombre: req.body.nombre,
        apellido_paterno: req.body.apellido_paterno,
        apellido_materno: req.body.apellido_materno,
        usuarioId: user.id
    };
    const mercado = await UserService.createConsumidor(consumidorData);

    return { user, mercado };
}