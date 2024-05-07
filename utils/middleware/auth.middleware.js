const cacheUtil = require('../../utils/cache.util');
const jwtUtil = require('../../utils/jwt.util');

module.exports = async (req, res, next) => {
    
    let token = req.headers.authorization;
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if (token) {
        try {
            token = token.trim();
            const isBlackListed = await cacheUtil.get(token);
            if (isBlackListed) {
                return res.status(401).json({ message: 'No autorizado' });
            }
            
            const decoded = await jwtUtil.verifyToken(token);
            req.user = decoded;
            req.token = token;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'No autorizado' });
        }
    } else {
        return res.status(400).json({ message: 'Header de autorización faltante.' })
    }
}