// controllers/auth/otpController.js
const { User, Otp } = require("../../models");

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const existingOtp = await Otp.findOne({
      where: {
        userId: user.id,
        code: otp
      }
    });

    if (!existingOtp)
      return res.status(400).json({ message: "Kode OTP tidak valid" });

    if (existingOtp.expiredAt < new Date())
      return res.status(400).json({ message: "Kode OTP telah kadaluarsa" });

    user.emailVerified = new Date();
    await user.save();
    await existingOtp.destroy();

    res.json({ success: true, message: "Email berhasil terverifikasi!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

