require('dotenv').config(); // WAJIB

const sendEmail = require('./helpers/sendEmailHelper');

const run = async () => {
  try {
    console.log("GMAIL_USER:", process.env.GMAIL_USER);
    console.log("GMAIL_PASS:", process.env.GMAIL_PASS ? "ADA ✅" : "KOSONG ❌");

    await sendEmail(
      'emailkamu@gmail.com',
      'Tes Kirim Email 🎯',
      `<h2>Halo!</h2><p>Email ini dari backend kamu.</p>`
    );

    console.log('✅ Email test sukses!');
  } catch (err) {
    console.error('❌ Email test gagal:', err.message);
  }
};

run();