const { User, Otp, Role } = require('../../models');
const { v4: uuidv4 } = require("uuid");
const sendEmail = require('../../helpers/sendEmailHelper');
const { generateOtp } = require('../../utils/generateOtp');
const { generateToken, verifyToken } = require('../../helpers/jwtHelper');
const url = process.env.FRONTEND_URL || 'http://localhost:5173';
const { handleError, AppError } = require('../../helpers/helperFunction');

/* =====================================================
   REGISTER → KIRIM OTP SAJA (BELUM BUAT USER)
===================================================== */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new AppError('Nama, email, dan password wajib diisi!', 400);
    }

    if (password.length < 8) {
      throw new AppError('Password minimal 8 karakter!', 400);
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError('Email sudah terdaftar!', 400);
    }

    const studentRole = await Role.findOne({ where: { name: 'student' } });
    if (!studentRole) {
      throw new AppError('Role student tidak ditemukan!', 500);
    }

    // hapus OTP lama (kalau user spam register)
    await Otp.destroy({ where: { email } });

    const otp = generateOtp();

    await Otp.create({
      id: uuidv4(),
      code: otp,
      isVerified: false,
      email,
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
      `<h2>Kode OTP Anda</h2><h1>${otp}</h1>`
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
   CONFIRM OTP → BARU BUAT USER
===================================================== */
const confirmOtp = async (req, res) => {
  try {
    const { otp } = req.body;

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

    // Cek lagi apakah user sudah ada
    const existingUser = await User.findOne({ where: { email: tempData.email } });
    if (existingUser) {
      throw new AppError('Email sudah terdaftar!', 400);
    }

    // Buat user baru
    const newUser = await User.create({
      name: tempData.name,
      email: tempData.email,
      password: tempData.password,
      roleId: tempData.roleId,
      emailVerified: new Date()
    });

    // Update status OTP
    await otpRecord.update({ isVerified: true });

    // Generate token (opsional untuk auto-login setelah verifikasi)
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
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email dan password wajib diisi!', 400);
    }

    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, as: 'role', attributes: ['id', 'name'] }]
    });

    if (!user || user.deletedAt !== null) {
      throw new AppError('Akun dinonaktifkan!', 400);
    }

    const isMatch = await User.verifyPassword(password, user.password);
    if (!isMatch) {
      throw new AppError('Email atau password salah!', 400);
    }

    if (!user.emailVerified) {
      const otp = generateOtp();

      await Otp.destroy({ where: { email } });

      await Otp.create({
        id: uuidv4(),
        code: otp,
        isVerified: false,
        email,
        tempData: JSON.stringify({
          name: user.name,
          email: user.email,
          password: user.password,
          roleId: user.role.id
        })
      });

      await sendEmail(
        email,
        'Verifikasi Email',
        `<h2>Kode OTP Anda</h2><h1>${otp}</h1>`
      );

      throw new AppError(
        'Email belum diverifikasi. Kode OTP telah dikirim ulang.',
        401
      );
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
   ADMIN LOGIN
===================================================== */
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email dan password wajib diisi!', 400);
    }

    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, as: 'role', attributes: ['id', 'name'] }]
    });

    if (!user) throw new AppError('Akun tidak ditemukan!', 404);
    if (user.role.name !== 'admin') throw new AppError('Akun bukan admin!', 403);

    const isMatch = await User.verifyPassword(password, user.password);
    if (!isMatch) throw new AppError('Email atau password salah!', 400);

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: 'admin'
    });

    return res.status(200).json({
      success: true,
      message: 'Login admin berhasil!',
      token,
      role: 'admin'
    });
  } catch (error) {
    return handleError(error, res);
  }
};

/* =====================================================
   RESET PASSWORD
===================================================== */
const resetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) throw new AppError('Email wajib diisi!', 400);

    const user = await User.findOne({ where: { email } });
    if (!user) throw new AppError('Pengguna tidak ditemukan!', 404);
    if (!user.emailVerified) throw new AppError('Email belum diverifikasi!', 400);

    const token = generateToken({ userId: user.id }, true);
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

const changePassword = async (req, res) => {
  try {
    const { newPassword, token, userId } = req.body;

    if (!newPassword || !token || !userId) {
      throw new AppError('Data tidak lengkap!', 400);
    }

    const decoded = verifyToken(token);
    if (decoded.userId !== userId || !decoded.isPasswordReset) {
      throw new AppError('Token tidak valid!', 401);
    }

    const user = await User.findByPk(userId);
    if (!user) throw new AppError('User tidak ditemukan!', 404);

    await user.update({ password: newPassword });

    return res.status(200).json({
      success: true,
      message: 'Password berhasil diubah.'
    });
  } catch (error) {
    return handleError(error, res);
  }
};

/* =====================================================
   LOGOUT
===================================================== */
const logout = async (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ success: true, message: 'Logout berhasil' });
};

/* =====================================================
   GOOGLE LOGIN (AMAN)
===================================================== */
const loginWithGoogle = async (req, res) => {
  try {
    const { email, name } = req.body;

    const role = await Role.findOne({ where: { name: 'student' } });

    const [user] = await User.findOrCreate({
      where: { email },
      defaults: {
        name,
        emailVerified: new Date(),
        roleId: role.id
      }
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: 'student'
    });

    return res.status(200).json({
      success: true,
      token,
      role: 'student'
    });
  } catch (error) {
    return handleError(error, res);
  }
};

module.exports = {
  register,
  confirmOtp,
  login,
  adminLogin,
  resetPasswordRequest,
  changePassword,
  logout,
  loginWithGoogle
};
