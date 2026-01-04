const { User, Otp, Role } = require('../../models');
const { v4: uuidv4 } = require("uuid");
const sendEmail = require('../../helpers/sendEmailHelper');
const { generateOtp } = require('../../utils/generateOtp');
const bcrypt = require('bcryptjs');
const { generateToken, verifyToken } = require('../../helpers/jwtHelper');
const url = process.env.FRONTEND_URL || 'http://localhost:5173';
const { handleError, AppError } = require('../../helpers/helperFunction');

/* ===============================
   PASSWORD RULE (SAMA DENGAN FRONTEND)
=============================== */
const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

/* =====================================================
   REGISTER → KIRIM OTP SAJA
===================================================== */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      throw new AppError('Nama, email, dan password wajib diisi!', 400);
    }

    if (!PASSWORD_REGEX.test(password)) {
      throw new AppError(
        'Password minimal 8 karakter, harus ada huruf besar, kecil, angka, dan simbol.',
        400
      );
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError('Email sudah terdaftar!', 400);
    }

    const studentRole = await Role.findOne({ where: { name: 'student' } });
    if (!studentRole) {
      throw new AppError('Role student tidak ditemukan!', 500);
    }

    // Hapus OTP lama
    await Otp.destroy({ where: { email } });

    const otp = generateOtp();

    // ⏱️ OTP EXPIRED 5 MENIT
    const expiredAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.create({
      id: uuidv4(),
      code: otp,
      email,
      expiredAt,          // 🔥 WAJIB
      isVerified: false,
      tempData: JSON.stringify({
        name,
        email,
        password,
        roleId: studentRole.id
      })
    });

    await sendEmail(
      email,
      'Verifikasi Email',
      `<h2>Kode OTP Anda</h2><h1>${otp}</h1><p>Berlaku 5 menit</p>`
    );

    return res.status(201).json({
      success: true,
      message: 'Kode OTP telah dikirim ke email Anda.'
    });
  } catch (error) {
    return handleError(error, res);
  }
};
/* =====================================================
   CONFIRM OTP
===================================================== */
const confirmOtp = async (req, res) => {
  try {
    const { otp } = req.body || {};

    if (!otp || otp.length !== 6) {
      throw new AppError('Kode OTP tidak valid!', 400);
    }

    const otpRecord = await Otp.findOne({
      where: { code: otp, isVerified: false },
      order: [['createdAt', 'DESC']]
    });

    if (!otpRecord) {
      throw new AppError('Kode OTP tidak ditemukan atau sudah digunakan!', 400);
    }

    const tempData = JSON.parse(otpRecord.tempData);

    // ✅ JANGAN HASH DI SINI
    const newUser = await User.create({
      name: tempData.name,
      email: tempData.email,
      password: tempData.password, // 🔥 PLAIN
      roleId: tempData.roleId,
      emailVerified: new Date()
    });

    await otpRecord.update({ isVerified: true });

    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: 'student'
    });

    return res.status(200).json({
      success: true,
      message: 'Email berhasil diverifikasi!',
      token,
      role: 'student'
    });
  } catch (error) {
    return handleError(error, res);
  }
};


/* =====================================================
   LOGIN
===================================================== */
const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      throw new AppError('Email dan password wajib diisi!', 400);
    }

    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, as: 'role', attributes: ['id', 'name'] }]
    });

    if (!user || user.deletedAt) {
      throw new AppError('Akun dinonaktifkan!', 400);
    }

    const isMatch = await User.verifyPassword(password, user.password);
    if (!isMatch) {
      throw new AppError('Email atau password salah!', 400);
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role.name
    });

    return res.status(200).json({
      success: true,
      message: 'Login berhasil!',
      token,
      role: user.role.name
    });
  } catch (error) {
    return handleError(error, res);
  }
};

/* =====================================================
   RESET PASSWORD (EMAIL)
===================================================== */
const resetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) throw new AppError('Email wajib diisi!', 400);

    const user = await User.findOne({ where: { email } });
    if (!user) throw new AppError('Email tidak terdaftar!', 404);

    const token = generateToken(
      { userId: user.id, isPasswordReset: true },
      true
    );

    const resetLink = `${url}/reset-password?token=${token}&userId=${user.id}`;

    await sendEmail(
      email,
      'Reset Password',
      `<p>Klik link berikut:</p><a href="${resetLink}">Reset Password</a>`
    );

    return res.status(200).json({
      success: true,
      message: 'Link reset password dikirim ke email.'
    });
  } catch (error) {
    return handleError(error, res);
  }
};

/* =====================================================
   CHANGE PASSWORD
===================================================== */
const changePassword = async (req, res) => {
  try {
    const { newPassword, token, userId } = req.body || {};

    if (!newPassword || !token || !userId) {
      throw new AppError('Data tidak lengkap!', 400);
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      throw new AppError(
        'Password minimal 8 karakter, harus ada huruf besar, kecil, angka, dan simbol.',
        400
      );
    }

    const decoded = verifyToken(token);

    // Pastikan tipe sama (kadang decoded.userId number/string)
    if (!decoded.isPasswordReset || String(decoded.userId) !== String(userId)) {
      throw new AppError('Token tidak valid!', 401);
    }

    const user = await User.findByPk(userId);
    if (!user) throw new AppError('User tidak ditemukan!', 404);

    // ✅ JANGAN HASH DI SINI. BIAR HOOK beforeUpdate yang hash.
    await user.update({ password: newPassword });

    return res.status(200).json({
      success: true,
      message: 'Password berhasil diubah. Silakan login kembali.'
    });
  } catch (error) {
    return handleError(error, res);
  }
};


/* =====================================================
   LOGOUT
===================================================== */
const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logout berhasil'
  });
};

module.exports = {
  register,
  confirmOtp,
  login,
  resetPasswordRequest,
  changePassword,
  logout
};