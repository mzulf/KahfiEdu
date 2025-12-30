const { User, Otp } = require("../../models");
const nodemailer = require("nodemailer");

// ✅ Helper: Generate OTP
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

// ✅ Email Sender
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

// ✅ Verifikasi OTP
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

    // ✅ Update Status
    user.isVerified = true;
    user.verifiedAt = new Date();
    user.emailVerified = new Date();
    await user.save();

    // ✅ Hapus OTP
    await existingOtp.destroy();

    res.json({ success: true, message: "Email berhasil terverifikasi!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Kirim ulang OTP
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email wajib diisi." });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan." });

    // Hapus OTP sebelumnya
    await Otp.destroy({ where: { userId: user.id } });

    // Buat OTP baru
    const otpCode = generateOTP();
    const expiredAt = new Date(Date.now() + 5 * 60 * 1000); // 5 menit

    await Otp.create({
      userId: user.id,
      code: otpCode,
      expiredAt,
    });

    // Kirim email OTP
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: "Kode OTP Verifikasi Ulang",
      text: `Kode OTP terbaru kamu adalah: ${otpCode}`,
    });

    res.json({ success: true, message: "OTP baru berhasil dikirim ke email." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
