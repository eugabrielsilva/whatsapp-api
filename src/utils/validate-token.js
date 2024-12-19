require('dotenv').config();

function validateToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if(!authHeader) {
        return res.status(401).json({
            status: false,
            error: 'Missing auth token.'
        });
    }

    const token = authHeader.split(' ')[1];

    if(!token || token !== process.env.TOKEN) {
        return res.status(403).json({
            status: false,
            error: 'Invalid auth token.'
        });
    }

    next();
}

module.exports = validateToken;