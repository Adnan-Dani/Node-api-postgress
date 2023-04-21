const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Check if the token is provided
    const token = req.headers['token'];
    if (!token) {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }

        // Check if the token is expired
        const currentTimestamp = new Date().getTime() / 1000; // Divide by 1000 to convert to seconds
        if (decoded.exp < currentTimestamp) {
            return res.status(401).send({ auth: false, message: 'Token expired.' });
        }

        // Save the decoded user ID to the request object
        req.userId = decoded.id;
        next();
    });
}

module.exports = verifyToken;
