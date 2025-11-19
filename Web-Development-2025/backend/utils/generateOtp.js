
const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

module.exports = { generateOtp };