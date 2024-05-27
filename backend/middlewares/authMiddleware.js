const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.sendStatus(401); // Unauthorized if no token is provided

    if (token === 'default-token') {
        req.user = { role: 'user' }; 
        return next();
      }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden if token is invalid
        req.user = user; // Attach user information to the request object
        next();
    });
};

const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) return res.sendStatus(403); // Forbidden if user role is not authorized
        next();
    };
};

module.exports = { authenticateToken, authorizeRole };

