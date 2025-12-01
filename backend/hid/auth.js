const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtTitok = process.env.JWT_SECRET;

module.exports = function (req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Hiányzó vagy hibás auth fejlec' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, jwtTitok);
        req.user = { id: payload.id, felhasznalo: payload.felhasznalo, role: payload.role };
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token helytelen vagy lejárt' });
    }
};