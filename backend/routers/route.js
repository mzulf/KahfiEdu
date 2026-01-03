const express = require("express");
const router = express.Router();

const { validateToken } = require("../middlewares/authMiddleware.js");
const validateDataUser = require("../helpers/validationDataUser.js");

// ================== ROUTE IMPORTS ==================
const {
  authRoute,
  otpRoute,

  importRoute,
  exportRoute,

  userRoute,
  roleRoute,
  revisionRoute,

  paymentMethodRoute,
  bankRoute,
  paymentRoute,

  categoryRoute,
  childrenRoute,
  courseRoute,
  classRoute,
  classEnrollmentRoute,
  lessonRoute,
  attendanceRoute,
  assignmentRoute,
  submissionRoute,

  regionRoute,
  blogRoute,
  jobRoute,

  googleAuthRoute,
  materiRoute,
} = require("./routeImports.js");

// ================== EXTRA ==================
const guruRoute = require("./guruRoute");

// ================== PUBLIC ROUTES ==================
router.use("/auth", authRoute);
router.use("/auth", otpRoute); // ✅ PENTING: aktifkan otp route
router.use(googleAuthRoute);

router.use("/guru", guruRoute);
router.use(courseRoute);
router.use(blogRoute);
router.use(jobRoute);

// ================== PROTECTED ROUTES ==================
router.use(validateToken);

// ================== VALIDATION ==================
router.use("/validate/user", validateDataUser);

// ================== CORE ROUTES ==================
router.use(userRoute);
router.use(roleRoute);
router.use(revisionRoute);

// ================== PAYMENT ==================
router.use(paymentMethodRoute);
router.use(bankRoute);
router.use(paymentRoute);

// ================== EDUCATION ==================
router.use("/materi", materiRoute);
router.use(childrenRoute);
router.use(categoryRoute);
router.use(classRoute);
router.use(classEnrollmentRoute);
router.use(lessonRoute);
router.use(attendanceRoute);
router.use(assignmentRoute);
router.use(submissionRoute);

// ================== ADDITIONAL ==================
router.use(regionRoute);

// ================== IMPORT / EXPORT ==================
router.use(importRoute);
router.use(exportRoute);

// ================== DEV DEBUG ==================
if (process.env.NODE_ENV === "development") {
  router.get("/debug/jwt", (req, res) => {
    res.status(200).json({
      success: true,
      userId: req.user?.id || null,
      message: req.user?.id
        ? "User context is set correctly"
        : "User context is not set!",
    });
  });
}

module.exports = router;
