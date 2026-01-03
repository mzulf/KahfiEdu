const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // WAJIB false
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
      }
    });

    await transporter.verify(); // 🔥 penting buat debug

    await transporter.sendMail({
      from: `"Kahfi Education" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      html: htmlContent
    });

    console.log('📨 Email terkirim ke:', to);
  } catch (error) {
    console.error('❌ Gagal kirim email:', error.message);
    throw error;
  }
};

module.exports = sendEmail;
