const AuthService = require('../services/auth.service');
const jwtConfig = require('../../config/jwt.config');
const bcryptUtil = require('../utils/bcrypt.util');
const jwtUtil = require('../utils/jwt.util');

exports.register = async (req, res) => { 
    const isExist = await AuthService.findUserByEmail(req.body.correo);
    if(isExist) {
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
    const user = await AuthService.createUser(userData);
    return res.json({
        data: user,
        message: 'Usuario registrado correctamente.'
    });
}

exports.login = async (req, res) => { 
    const user = await AuthService.findUserByEmail(req.body.correo); 
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
    const user = await AuthService.findUserById(req.user.id);  
    return res.json({
        id: user.id,
        tipo: user.tipo,
        message: 'Logrado.'
    });
}

exports.logout = async (req, res) => {    
    await AuthService.logoutUser(req.token, req.user.exp);
    sessionStorage.clear;
    return res.json({ message: 'Cerrado sesión correctamente.' });
}