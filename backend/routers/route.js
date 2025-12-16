// routers/route.js
const express = require('express');
const router = express.Router();
const { validateToken } = require('../middlewares/authMiddleware.js');
const validateDataUser = require('../helpers/validationDataUser.js');

// -------------------- Route imports --------------------
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

// ==================== MATERI ROUTE ====================
const materiRoute = require('./materiRoute'); // ⬅️ HARUS SESUAI NAMA FILE

// -------------------- PUBLIC ROUTES --------------------
// tanpa token
router.use('/auth', authRoute);
router.use(googleAuthRoute);

// public content
router.use([
    courseRoute,
    blogRoute,
    jobRoute,
]);

// ==================== MATERI PUBLIC ====================
// GET /api/v1/materi
// GET /api/v1/materi/:id
router.use('/materi', materiRoute);

// -------------------- TOKEN VALIDATION --------------------
router.use((req, res, next) => {
    validateToken(req, res, next);
});

// -------------------- USER VALIDATION --------------------
router.use('/validate/user', validateDataUser);

// -------------------- PROTECTED ROUTES --------------------
router.use([
    userRoute,
    roleRoute,
    revisionRoute
]);

router.use([
    paymentMethodRoute,
    bankRoute,
    paymentRoute
]);

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

router.use([
    regionRoute,
]);

router.use([
    importRoute,
    exportRoute
]);

// -------------------- DEV ONLY --------------------
if (process.env.NODE_ENV === 'development') {
    router.get('/debug/jwt', (req, res) => {
        const userId = req.user?.id;
        res.status(200).json({
            success: true,
            userId,
            message: userId
                ? 'User context is set correctly'
                : 'User context is not set!'
        });
    });
}

// -------------------- FALLBACK 404 --------------------
router.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

module.exports = router;
