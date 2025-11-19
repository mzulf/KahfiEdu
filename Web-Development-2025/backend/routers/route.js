const express = require('express');
const router = express.Router();
const { validateToken } = require('../middlewares/authMiddleware.js');
const validateDataUser = require('../helpers/validationDataUser.js');

// Route imports
const {
    authRoute,
    importRoute,
    userRoute,
    roleRoute,
    paymentMethodRoute,
    bankRoute,
    categoryRoute,
    childrenRoute,
    revisionRoute,
    courseRoute,
    classRoute,
    classEnrollmentRoute,
    lessonRoute,
    attendanceRoute,
    regionRoute,
    blogRoute,
    assignmentRoute,
    submissionRoute,
    googleAuthRoute,
    paymentRoute,
    exportRoute,
    jobRoute,
} = require('./routeImports.js');

// Public routes
router.use('/auth', authRoute);
router.use(googleAuthRoute)
router.use([
    courseRoute,
    blogRoute,
    jobRoute
])
// Token validation middleware
router.use((req, res, next) => {
    validateToken(req, res, next);
});

// User validation route
router.use('/validate/user', validateDataUser);

// Protected routes - Core features
router.use([
    userRoute,
    roleRoute,
    revisionRoute
]);

// Protected routes - Payment related
router.use([
    paymentMethodRoute,
    bankRoute,
    paymentRoute
]);

// Protected routes - Educational features
router.use([
    childrenRoute,
    categoryRoute,
    classRoute,
    classEnrollmentRoute,
    lessonRoute,
    attendanceRoute,
    assignmentRoute,
    submissionRoute
]);

// Protected routes - Additional features
router.use([
    regionRoute,

]);

// Export Import functionality
router.use([
    importRoute,
    exportRoute
])

// Development only routes
if (process.env.NODE_ENV === 'development') {
    router.get('/debug/jwt', (req, res) => {
        const userId = req.user.id;
        res.status(200).json({
            success: true,
            userId,
            message: userId
                ? 'User context is set correctly'
                : 'User context is not set!'
        });
    });
}

module.exports = router;