const express = require('express');
const router = express.Router();
const passport = require('passport');
const { generateToken } = require('../helpers/jwtHelper');
const { validateRole } = require('../utils/validorUtil');

// Google OAuth login route
router.get('/google',
    validateRole,
    (req, res, next) => {
        passport.authenticate('google', {
            scope: ['profile', 'email'],
            state: req.query.role,
            prompt: 'select_account'
        })(req, res, next);
    }
);

// Google OAuth callback route
router.get('/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`
    }),
    async (req, res) => {
        try {
            // Generate JWT token
            const token = generateToken({
                userId: req.user.id,
                email: req.user.email,
                role: req.user.role.name
            });

            // Successful authentication
            res.redirect(`${process.env.FRONTEND_URL}/auth/callback?` +
                `token=${token}&` +
                `role=${req.user.role.name}&` +
                `email=${req.user.email}`
            );
        } catch (error) {
            console.error('Google auth callback error:', error);
            res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
        }
    }
);

module.exports = router;