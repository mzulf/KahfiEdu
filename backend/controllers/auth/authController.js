const { User, Otp, Role } = require('../../models');
const { v4: uuidv4 } = require('uuid');
const sendEmail = require('../../helpers/sendEmailHelper');
const { generateOtp } = require('../../utils/generateOtp');
const { generateToken, verifyToken } = require('../../helpers/jwtHelper');
const { handleError, AppError } = require('../../helpers/helperFunction');

const url = process.env.FRONTEND_URL || 'http://localhost:5173';

const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

/* =====================================================
   REGISTER → KIRIM OTP
===================================================== */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new AppError('Nama, email, dan password wajib diisi', 400);
    }

    if (!PASSWORD_REGEX.test(password)) {
      throw new AppError('Password tidak memenuhi aturan', 400);
    }

    const exist = await User.findOne({ where: { email } });
    if (exist) throw new AppError('Email sudah terdaftar', 400);

    const role = await Role.findOne({ where: { name: 'student' } });
    if (!role) throw new AppError('Role student tidak ditemukan', 500);

    await Otp.destroy({ where: { email } });

    const otp = generateOtp();
    const expiredAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.create({
      id: uuidv4(),
      email,
      code: otp,
      expiredAt,
      isVerified: false,
      tempData: JSON.stringify({
        name,
        email,
        password,
        roleId: role.id
      })
    });

    await sendEmail(
      email,
      'Verifikasi Email',
      `<h2>Kode OTP</h2><h1>${otp}</h1>`
    );

    res.status(201).json({
      success: true,
      message: 'OTP dikirim ke email'
    });
  } catch (e) {
    handleError(e, res);
  }
};

/* =====================================================
   CONFIRM OTP
===================================================== */
const confirmOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await Otp.findOne({
      where: { email, code: otp, isVerified: false },
      order: [['createdAt', 'DESC']]
    });

    if (!record) throw new AppError('OTP tidak valid', 400);
    if (record.expiredAt < new Date()) throw new AppError('OTP kadaluarsa', 400);

    const data = JSON.parse(record.tempData);

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      roleId: data.roleId,
      isVerified: true,
      verifiedAt: new Date(),
      emailVerified: new Date()
    });

    await record.destroy();

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: 'student'
    });

    res.json({
      success: true,
      token,
      role: 'student'
    });
  } catch (e) {
    handleError(e, res);
  }
};

/* =====================================================
   LOGIN
===================================================== */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, as: 'role' }]
    });

    if (!user) throw new AppError('Akun tidak ditemukan', 404);
    if (!user.isVerified) throw new AppError('Email belum diverifikasi', 403);

    const match = await User.verifyPassword(password, user.password);
    if (!match) throw new AppError('Password salah', 400);

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role.name
    });

    res.json({
      success: true,
      token,
      role: user.role.name
    });
  } catch (e) {
    handleError(e, res);
  }
};

/* =====================================================
   RESET PASSWORD (KIRIM LINK)
===================================================== */
const resetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) throw new AppError('Email wajib diisi', 400);

    const user = await User.findOne({ where: { email } });
    if (!user) throw new AppError('Email tidak terdaftar', 404);

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

    res.json({
      success: true,
      message: 'Link reset password dikirim'
    });
  } catch (e) {
    handleError(e, res);
  }
};

/* =====================================================
   CHANGE PASSWORD
===================================================== */
const changePassword = async (req, res) => {
  try {
    const { newPassword, token, userId } = req.body;

    if (!newPassword || !token || !userId) {
      throw new AppError('Data tidak lengkap', 400);
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      throw new AppError('Password tidak memenuhi aturan', 400);
    }

    const decoded = verifyToken(token);

    if (!decoded.isPasswordReset || String(decoded.userId) !== String(userId)) {
      throw new AppError('Token tidak valid', 401);
    }

    const user = await User.findByPk(userId);
    if (!user) throw new AppError('User tidak ditemukan', 404);

    await user.update({ password: newPassword });

    res.json({
      success: true,
      message: 'Password berhasil diubah'
    });
  } catch (e) {
    handleError(e, res);
  }
};

/* =====================================================
   LOGOUT
===================================================== */
const logout = async (req, res) => {
  res.json({
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
