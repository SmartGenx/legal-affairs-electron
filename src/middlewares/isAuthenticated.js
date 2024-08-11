const jwt = require('jsonwebtoken');
const{JWT_SECRET}=require('../secrets');

const isAuthenticated = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, JWT_SECRET || 'your_secret_key', (err, user) => {
            if (err) {
                return res.status(403).json({
                    message: "User is Forbidden"
                });
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({
            message: "User need to login"
        });
    }
};

module.exports = isAuthenticated;
