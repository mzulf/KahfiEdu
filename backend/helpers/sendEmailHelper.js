const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, htmlContent) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        });

        await transporter.sendMail({
            from: `"Kahfi Education" <${process.env.SMTP_EMAIL}>`,
            to,
            subject,
            html: htmlContent,
        });

        console.log('📨 Email terkirim ke:', to);
    } catch (error) {
        console.error('❌ Gagal kirim email:', error);
        throw error;
    }
};

module.exports = sendEmail;
