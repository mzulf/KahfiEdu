const session = require("express-session");
const express = require("express");
const passport = require('passport');
const { RedisStore } = require('connect-redis');

/**
 * Configure express middleware
 * @param {Express} app - Express application instance
 * @param {Object} redisClient - Redis client instance
 */
const configureMiddleware = (app, redisClient) => {
    // Session configuration
    app.use(session({
        store: new RedisStore({ client: redisClient }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        }
    }));

    // Basic middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Authentication
    app.use(passport.initialize());
    app.use(passport.session());
};

/**
 * Configure request logging
 * @param {Express} app - Express application instance
 */
const configureLogging = (app) => {
    app.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
        next();
    });
};

/**
 * Configure error handling
 * @param {Express} app - Express application instance
 */
const configureErrorHandling = (app) => {
    // Global error handler
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    });

    // 404 handler
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: "Route not found"
        });
    });
};

module.exports = {
    configureMiddleware,
    configureLogging,
    configureErrorHandling
};