const express = require('express');
const router = express.Router();

const UserController = require('../sistemaUsuarios/controllers/user.controller');
const ErrorHandler = require('../sistemaUsuarios/middleware/error.middleware');
const AuthGuard = require('../sistemaUsuarios/middleware/auth.middleware');
const schema = require('../sistemaUsuarios/validations/auth.validation');
const validate = require('../sistemaUsuarios/utils/validator.util'); 

router.post('/register', validate(schema.register), ErrorHandler(UserController.register));
router.post('/login',    validate(schema.login),    ErrorHandler(UserController.login));
router.get('/user',      AuthGuard,                 ErrorHandler(UserController.getUser));
router.get('/logout',    AuthGuard,                 ErrorHandler(UserController.logout));

router.all('*',  (req, res) => res.status(400).json({ message: 'Bad Request.'}))

module.exports = router;