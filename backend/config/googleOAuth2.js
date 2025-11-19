const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User, Role } = require('../models');
require('dotenv').config();

// Verify required environment variables
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('Missing required Google OAuth credentials in environment variables');
}

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
            passReqToCallback: true
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                // Get role from query parameter or default to student
                const requestedRole = req.query.role || 'student';

                // Validate requested role
                if (!['student', 'parent'].includes(requestedRole)) {
                    return done(new Error('Invalid role requested'));
                }

                // Find existing user by Google ID or email
                let user = await User.findOne({
                    where: {
                        [Op.or]: [
                            { googleId: profile.id },
                            { email: profile.emails[0].value }
                        ]
                    },
                    include: [{
                        model: Role,
                        as: 'role',
                        attributes: ['id', 'name']
                    }]
                });

                if (!user) {
                    // Get requested role
                    const role = await Role.findOne({
                        where: { name: requestedRole }
                    });

                    if (!role) {
                        return done(new Error(`${requestedRole} role not found`));
                    }

                    // Create new user with requested role
                    user = await User.create({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        googleId: profile.id,
                        emailVerified: new Date(),
                        roleId: role.id
                    });

                    // Reload user with role
                    user = await User.findByPk(user.id, {
                        include: [{
                            model: Role,
                            as: 'role',
                            attributes: ['id', 'name']
                        }]
                    });
                } else if (!user.googleId) {
                    // Update existing email user with Google ID
                    user.googleId = profile.id;
                    await user.save();
                }

                return done(null, user);
            } catch (error) {
                console.error('Google OAuth Error:', error);
                return done(error, null);
            }
        }
    )
);

// Serialize user for the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id, {
            include: [{
                model: Role,
                as: 'role',
                attributes: ['id', 'name']
            }]
        });
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;