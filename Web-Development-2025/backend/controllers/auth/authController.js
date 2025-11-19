const { User, Otp, Role } = require('../../models');
const { v4: uuidv4 } = require("uuid");
const sendEmail = require('../../helpers/sendEmailHelper');
const { generateOtp } = require('../../utils/generateOtp');
const { generateToken, verifyToken } = require('../../helpers/jwtHelper');
const url = process.env.FRONTEND_URL || 'http://localhost:5173';
const jwt = require('jsonwebtoken');
const { handleError, AppError } = require('../../helpers/helperFunction');

// Fungsi Registrasi
const register = async (req, res) => {
    try {
        const { name, email, password, roleId } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            throw new AppError('Nama, email, dan password wajib diisi!', 400);
        }

        if (password.length < 8) {
            throw new AppError('Password minimal 8 karakter!', 400);
        }

        if (!roleId) {
            throw new AppError('Role ID wajib diisi!', 400);
        }

        // Check existing user
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new AppError('Email sudah terdaftar!', 400);
        }

        // Validate role
        const existingRole = await Role.findOne({ where: { id: roleId } });
        if (!existingRole) {
            throw new AppError('Id role tidak ada', 404);
        }

        if (existingRole.name === 'admin' ||
            (existingRole.name !== 'student' && existingRole.name !== 'parent')) {
            throw new AppError('Role tidak sesuai', 400);
        }

        // Create user
        const newUser = await User.create({
            name,
            email,
            password,
            roleId,
            emailVerified: null,
        });

        // Generate and send OTP
        const otp = generateOtp();
        await Otp.create({
            id: uuidv4(),
            userId: newUser.id,
            code: otp,
            isVerified: false
        });

        await sendEmail(
            email,
            'Verifikasi Email',
            `<h2>Kode OTP Anda</h2><p>${otp}</p>`
        );

        return res.status(201).json({
            success: true,
            message: 'Kode OTP telah dikirim ke email Anda.',
            userId: newUser.id,
        });
    } catch (error) {
        return handleError(error, res);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new AppError('Email dan password wajib diisi!', 400);
        }

        // Find user with role
        const user = await User.findOne({
            where: { email },
            include: [{
                model: Role,
                as: 'role',
                attributes: ['id', 'name']
            }]
        });

        // Check user exists and is not deleted
        if (!user || user.deletedAt !== null) {
            throw new AppError('Akun dinonaktifkan!', 400);
        }

        // Verify password
        const isMatch = await User.verifyPassword(password, user.password);

        if (!isMatch) {
            throw new AppError('Email atau password salah!', 400);
        }

        // Handle unverified email
        if (!user.emailVerified) {
            const otp = generateOtp();
            await Otp.upsert({
                userId: user.id,
                code: otp,
                isVerified: false
            });

            await sendEmail(
                email,
                'Verifikasi Email',
                `<h2>Kode OTP Anda</h2><p>${otp}</p>`
            );

            throw new AppError('Email belum diverifikasi! Kode OTP telah dikirim ulang.', 401, {
                userId: user.id
            });
        }

        // Generate token
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

// Fungsi Konfirmasi OTP
const confirmOtp = async (req, res) => {
    const { otp, userId } = req.body;

    if (!otp || otp.length !== 6) {
        return res.status(400).json({ message: 'Kode OTP tidak valid!' });
    }

    try {
        const otpRecord = await Otp.findOne({
            where: {
                code: otp,
                userId,
                isVerified: false
            },
        });
        if (!otpRecord || otpRecord.isVerified) {
            return res.status(400).json({ message: 'Kode OTP tidak valid atau sudah digunakan!' });
        }



        const user = await User.findOne({
            where: { id: userId },
            include: [{
                model: Role,
                as: 'role',
                attributes: ['id', 'name']
            }],
        });

        if (!user) return res.status(404).json({
            success: false,
            message: 'Pengguna tidak ditemukan!'
        });

        if (user.emailVerified) {
            return res.status(400).json({
                success: false,
                message: 'Email sudah diverifikasi!'
            });
        }

        await otpRecord.update({ isVerified: true });

        user.emailVerified = new Date();
        await user.save();

        const token = generateToken({ userId: user.id, email: user.email, role: user.role.name });
        return res.status(200).json({ message: 'Email berhasil diverifikasi!', token, role: user.role.name });
    } catch (error) {
        console.error('Error saat konfirmasi OTP:', error);
        return res.status(500).json({ message: 'Terjadi kesalahan server.' });
    }
};

// Fungsi Reset Password Request
const resetPasswordRequest = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            throw new AppError('Email wajib diisi!', 400);
        }

        const user = await User.findOne({
            where: { email },
            include: [{
                model: Role,
                as: 'role',
                attributes: ['id', 'name']
            }]
        });

        if (!user) {
            throw new AppError('Pengguna tidak ditemukan!', 404);
        }

        if (!user.emailVerified) {
            throw new AppError('Email belum diverifikasi!', 400);
        }

        // Generate password reset token
        const token = generateToken({ userId: user.id }, true);

        const resetLink = `${url}/reset-password?token=${token}&userId=${user.id}`;

        await sendEmail(
            email,
            'Reset Password',
            `<h2>Reset Password</h2>
            <p>Anda telah meminta untuk mereset password akun Anda.</p>
            <p>Klik link berikut untuk mereset password:</p>
            <a href="${resetLink}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
                Reset Password
            </a>
            <p>Link ini akan kadaluarsa dalam 1 jam.</p>
            <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>`
        );

        return res.status(200).json({
            success: true,
            message: 'Link password reset telah dikirim ke email Anda.',
        });
    } catch (error) {
        return handleError(error, res);
    }
};

// Fungsi Ubah Password
const changePassword = async (req, res) => {
    try {
        const { newPassword, token, userId } = req.body;

        if (!newPassword || !token || !userId) {
            throw new AppError('Password baru dan token wajib diisi!', 400);
        }

        if (newPassword.length < 8) {
            throw new AppError('Password minimal 8 karakter!', 400);
        }

        try {
            const decoded = verifyToken(token);

            if (decoded.userId !== userId) {
                throw new AppError('Token tidak valid!', 401);
            }

            if (!decoded.isPasswordReset) {
                throw new AppError('Token bukan untuk reset password!', 401);
            }
        } catch (jwtError) {
            throw new AppError('Token tidak valid atau kadaluarsa!', 401);
        }

        const user = await User.findByPk(userId);
        if (!user) {
            throw new AppError('Pengguna tidak ditemukan!', 404);
        }

        await user.update({
            password: newPassword
        }, {
            userId: userId // For revision tracking
        });

        return res.status(200).json({
            success: true,
            message: 'Password berhasil diubah.'
        });
    } catch (error) {
        return handleError(error, res);
    }
};

const logout = async (req, res) => {
    try {
        // Clear cookie if you're using cookie-based tokens
        res.clearCookie('token');

        return res.status(200).json({
            success: true,
            message: "Berhasil logout"
        });
    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat logout"
        });
    }
};

const loginWithGoogle = async (req, res) => {
    const { googleToken } = req.body;

    try {
        // Verify token with Google
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const { email, name, sub: googleId } = ticket.getPayload();

        // Find or create user
        const [user, created] = await User.findOrCreate({
            where: { email },
            defaults: {
                name,
                googleId,
                emailVerified: new Date(),
                roleId: await Role.findOne({ where: { name: 'student' } }).then(role => role.id)
            },
            include: [{
                model: Role,
                as: 'role',
                attributes: ['id', 'name']
            }]
        });

        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role.name
        });

        return res.status(200).json({
            message: 'Login berhasil!',
            token,
            role: user.role.name
        });

    } catch (error) {
        console.error('Error during Google login:', error);
        return res.status(500).json({ message: 'Terjadi kesalahan server.' });
    }
};


module.exports = {
    register,
    login,
    confirmOtp,
    resetPasswordRequest,
    changePassword,
    logout,
    loginWithGoogle
};