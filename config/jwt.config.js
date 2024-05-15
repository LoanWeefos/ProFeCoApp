if (!process.env.JWT_SECRET) {
    throw new Error('La variable de entorno JWT_SECRET no está definida');
}

module.exports = { 
    secret: process.env.JWT_SECRET,
    ttl: 3600
}