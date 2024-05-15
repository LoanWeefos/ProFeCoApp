const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();
var cors = require('cors');
var http = require('http');
const socketIO = require('socket.io');

const indexRouter = require('./routes/index');
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'views')));

app.use('/api', indexRouter);

const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

server.listen(3000);

io.on('connection', (socket) => {

    socket.on('upload', (product, callback) => {
        console.log('mensaje:', product);
        callback(product);
        io.emit('load-new', product);
    })
    socket.on('delete', (product, callback) => {
        console.log('mensaje:', product);
        callback(product);
        io.emit('delete-product', product);
    })
    socket.on('update', (product, callback) => {
        console.log('mensaje:', product);
        callback(product);
        io.emit('update-product', product);
    })
    socket.on('report', (product) => {
        console.log('mensaje:', product);
        io.emit('report-product', product);
    })
    socket.on('sancion', (product, callback) => {
        console.log('mensaje:', product);
        callback(product);
        io.emit('sancionar', product);
    })
});

module.exports = app;