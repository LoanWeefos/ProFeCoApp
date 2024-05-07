const express = require('express');
const router = express.Router();

const UserController = require('../sistemaUsuarios/controllers/user.controller');
const ProductController = require('../sistemaProductos/controllers/product.controller');

const schema = require('../sistemaUsuarios/validations/auth.validation');
const schemaP = require('../sistemaProductos/validations/product.validation');

const validate = require('../utils/validator.util');
const AuthGuard = require('../utils/middleware/auth.middleware');
const ErrorHandler = require('../utils/middleware/error.middleware');

router.post('/register', validate(schema.register), ErrorHandler(UserController.register));
router.post('/login', validate(schema.login), ErrorHandler(UserController.login));
router.get('/user', AuthGuard, ErrorHandler(UserController.getUser));
router.post('/logout', AuthGuard, ErrorHandler(UserController.logout));
router.get('/product/:id', AuthGuard, ErrorHandler(ProductController.getProduct));
router.get('/products', AuthGuard, ErrorHandler(ProductController.getAllProducts));
router.post('/product', validate(schemaP.create), ErrorHandler(ProductController.create));

router.all('*', (req, res) => res.status(400).json({ message: 'Bad Request.' }))

module.exports = router;