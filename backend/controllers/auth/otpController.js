const { Otp } = require('../../models');
const sendEmail = require('../../helpers/sendEmailHelper');
const { generateOtp } = require('../../utils/generateOtp');
const { v4: uuidv4 } = require('uuid');
const { AppError, handleError } = require('../../helpers/helperFunction');

/* =====================================================
   VERIFY OTP (HANYA VALIDASI)
===================================================== */
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body || {};

    if (!email || !otp) {
      throw new AppError('Email dan OTP wajib diisi', 400);
    }

    const otpRecord = await Otp.findOne({
      where: {
        email,
        code: otp,
        isVerified: false,
      },
      order: [['createdAt', 'DESC']],
    });

    if (!otpRecord) {
      throw new AppError('Kode OTP tidak valid atau sudah digunakan', 400);
    }

    if (otpRecord.expiredAt && otpRecord.expiredAt < new Date()) {
      throw new AppError('Kode OTP telah kadaluarsa', 400);
    }

    otpRecord.isVerified = true;
    await otpRecord.save();

    await otpRecord.destroy();

    return res.status(200).json({
      success: true,
      message: 'OTP valid',
    });
  } catch (error) {
    return handleError(error, res);
  }
};

/* =====================================================
   RESEND OTP (PRE REGISTER)
===================================================== */
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!email) {
      throw new AppError('Email wajib diisi', 400);
    }

    await Otp.destroy({ where: { email } });

    const otp = generateOtp();
    const expiredAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.create({
      id: uuidv4(),
      email,
      code: otp,
      expiredAt,
      isVerified: false,
    });

    await sendEmail(
      email,
      'Kode OTP Verifikasi',
      `<h2>Kode OTP Anda</h2><h1>${otp}</h1>`
    );

    return res.status(200).json({
      success: true,
      message: 'OTP berhasil dikirim ulang',
    });
  } catch (error) {
    return handleError(error, res);
  }
};

module.exports = {
  verifyOtp,
  resendOtp,
};
