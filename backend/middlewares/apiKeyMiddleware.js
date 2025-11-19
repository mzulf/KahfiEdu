const validateApiKey = require('../helpers/apiKeyHelper');

const apiKeyMiddleware = (req, res, next) => {
    // const apiKey = req.headers['x-api-key'] || req.query.apiKey || req.body.apiKey || req.cookies.apiKey; // Uncomment if you want to check cookies as well
    const apiKey = req.headers['x-api-key']

    if (!apiKey) {
        return res.status(403).json({ message: 'Forbidden Missing Key' });
    }

    if (!validateApiKey(apiKey)) {
        return res.status(403).json({ message: 'Forbidden Missing Key' });
    }

    req.apiKey = apiKey;

    next();
};

module.exports = apiKeyMiddleware;
