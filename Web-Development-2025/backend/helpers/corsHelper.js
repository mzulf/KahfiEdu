require("dotenv").config();
const cors = require('cors');

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'x-api-key',
        'Access-Control-Allow-Headers',
        'Origin',
        'Accept'
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: process.env.CORS_CREDENTIALS === 'true',
    maxAge: 86400 // 24 hours
};

const corsHelper = () => cors(corsOptions);

module.exports = corsHelper;