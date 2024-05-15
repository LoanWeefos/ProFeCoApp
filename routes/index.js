const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ storage });

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
router.get('/users', ErrorHandler(UserController.getAllUsers));
router.get('/user/:id', ErrorHandler(UserController.getUserById));
router.delete('/user/:id', ErrorHandler(UserController.deleteUser));
router.get('/mercado/:id', ErrorHandler(UserController.getMercado));
router.patch('/mercado/:id', ErrorHandler(UserController.updateMercado));
router.get('/consumidor/:id', ErrorHandler(UserController.getConsumidor));
router.post('/logout', AuthGuard, ErrorHandler(UserController.logout));

router.get('/product/:id', AuthGuard, ErrorHandler(ProductController.getProduct));
router.get('/products', AuthGuard, ErrorHandler(ProductController.getAllProducts));
router.post('/product', validate(schemaP.create), ErrorHandler(ProductController.createProduct));
router.put('/product/:id', validate(schemaP.update), ErrorHandler(ProductController.putProduct));
router.delete('/product/:id', ErrorHandler(ProductController.deleteProduct));
router.get('/products/:query', ErrorHandler(ProductController.queryProducts));

router.post('/category', validate(schemaP.category), ErrorHandler(ProductController.addCategory));
router.get('/category/:id', ErrorHandler(ProductController.getCategories));
router.delete('/category/:id', ErrorHandler(ProductController.deleteCategories));

router.post('/upload', upload.single('file'), (req, res) => {
    return ErrorHandler(ProductController.registerImg(req, res));
});
router.get('/img/:id', AuthGuard, ErrorHandler(ProductController.getImg));
router.delete('/img/:id', AuthGuard, ErrorHandler(ProductController.deleteImg));

router.post('/list', AuthGuard, ErrorHandler(ProductController.createList));
router.get('/list/:id', AuthGuard, ErrorHandler(ProductController.getList));
router.get('/lists', AuthGuard, ErrorHandler(ProductController.getAllList));
router.get('/wishlist', AuthGuard, ErrorHandler(ProductController.getWishlist));
router.delete('/list/:id', AuthGuard, ErrorHandler(ProductController.deleteFromList));

router.post('/calif', AuthGuard, ErrorHandler(ProductController.createCalif));
router.get('/calif/:id', AuthGuard, ErrorHandler(ProductController.getCalif));
router.get('/califMercado/', AuthGuard, ErrorHandler(ProductController.getCalifMercado));

router.post('/report', AuthGuard, ErrorHandler(ProductController.report));
router.get('/report/:id', AuthGuard, ErrorHandler(ProductController.getReport));
router.get('/reports', AuthGuard, ErrorHandler(ProductController.getReports));
router.get('/reportesTabla', AuthGuard, ErrorHandler(ProductController.getReportsTabla));
router.get('/inconsistencias', AuthGuard, ErrorHandler(ProductController.getInconsistencias));
router.patch('/report/:id', ErrorHandler(ProductController.updateReport));

router.post('/generateInconsistencias', AuthGuard, ErrorHandler(async (req, res) => {
    const data = await ProductController.getInconsistencias(req, res);
    
    const templatePath = path.join(__dirname, '../views/template.html');
    const templateHtml = fs.readFileSync(templatePath, 'utf8');

    const replacedHtml = templateHtml
        .replace('{{data}}', data)

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(replacedHtml);

    const pdfBuffer = await page.pdf({ format: 'Ledger' });

    await browser.close();

    res.contentType('application/pdf');
    res.send(pdfBuffer);
}));

router.post('/generateComentarios', AuthGuard, ErrorHandler(async (req, res) => {
    const data = await ProductController.getCalifMercado(req, res);
    
    const templatePath = path.join(__dirname, '../views/template.html');
    const templateHtml = fs.readFileSync(templatePath, 'utf8');

    const replacedHtml = templateHtml
        .replace('{{data}}', data)

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(replacedHtml);

    const pdfBuffer = await page.pdf({ format: 'Ledger' });

    await browser.close();

    res.contentType('application/pdf');
    res.send(pdfBuffer);
}));

router.post('/generateWishlist', AuthGuard, ErrorHandler(async (req, res) => {
    const data = await ProductController.getWishlist(req, res);
    
    const templatePath = path.join(__dirname, '../views/template.html');
    const templateHtml = fs.readFileSync(templatePath, 'utf8');

    const replacedHtml = templateHtml
        .replace('{{data}}', data)

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(replacedHtml);

    const pdfBuffer = await page.pdf({ format: 'Ledger' });

    await browser.close();

    res.contentType('application/pdf');
    res.send(pdfBuffer);
}));

router.all('*', (req, res) => res.status(400).json({ message: 'Bad Request.' }))

module.exports = router;
