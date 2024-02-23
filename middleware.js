const jwt = require('jsonwebtoken');
const httpStatus = require("http-status");

function verifyToken(req, res, next) {

    const token = req.header('Authorization');

    if (!token) return res.status(httpStatus.UNAUTHORIZED).json({ error: 'Access denied' });
    try {

        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        req.userId = decoded.userId;
        next();

    } catch (error) {
        res.status(httpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });
    }
};

module.exports = verifyToken;