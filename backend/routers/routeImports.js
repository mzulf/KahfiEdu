module.exports = {
    authRoute: require('./auth/authRoute.js'),
    otpRoute: require('./auth/otpRoute.js'), // ✅ Tambahan route verifikasi OTP

    importRoute: require('./import/importRoute.js'),
    exportRoute: require('./export/exportRoute.js'),

    userRoute: require('./userRouter.js'),
    roleRoute: require('./roleRouter.js'),

    paymentMethodRoute: require('./paymentMethodRoute.js'),
    bankRoute: require('./bankRoute.js'),
    paymentRoute: require('./paymentRoute.js'),

    categoryRoute: require('./categoryRoute.js'),
    childrenRoute: require('./childrenRoute.js'),
    revisionRoute: require('./revisionRoute.js'),

    courseRoute: require('./courseRoute.js'),
    classRoute: require('./classRoute.js'),
    classEnrollmentRoute: require('./classEnrollmentRoute.js'),
    lessonRoute: require('./lessonRoute.js'),
    attendanceRoute: require('./attendanceRoute.js'),

    regionRoute: require('./regionRoute.js'),
    blogRoute: require('./blogRoute.js'),
    assignmentRoute: require('./assignmentRoute.js'),
    submissionRoute: require('./submissionRoute.js'),

    googleAuthRoute: require('./googleAuthRoute'),
    jobRoute: require('./jobRoute.js'),
};
