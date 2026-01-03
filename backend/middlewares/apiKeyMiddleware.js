const validateApiKey = require('../helpers/apiKeyHelper');

const apiKeyMiddleware = (req, res, next) => {
    // ===============================
    // BYPASS API KEY UNTUK AUTH ROUTES
    // ===============================
    if (
        req.path.startsWith('/api/v1/auth') ||
        req.path.startsWith('/api/v1/otp')
    ) {
        return next();
    }

    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(403).json({ message: 'Forbidden Missing Key' });
    }

    if (!validateApiKey(apiKey)) {
        return res.status(403).json({ message: 'Forbidden Invalid Key' });
    }

    req.apiKey = apiKey;
    next();
};

module.exports = apiKeyMiddleware;
