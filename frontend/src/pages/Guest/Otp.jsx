import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';
import axiosInstance from '../../libs/axiosInstance';

const Otp = () => {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    const code = otp.join('');
    if (code.length !== 6) {
      setError('OTP harus 6 digit.');
      return;
    }

    try {
      const res = await axiosInstance.post('/auth/otp-confirm', { otp: code });
      if (res.data.success) {
        localStorage.removeItem('email');
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verifikasi gagal.');
    }
  };

  return (
    <AuthLayout
      greeting="Verifikasi OTP"
      sidebarText="Masukkan kode OTP yang telah kami kirim ke email Anda."
    >
      <div className="w-full max-w-md mx-auto px-2 sm:px-0">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">
          Enter OTP
        </h2>

        {error && (
          <p className="text-red-600 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={verifyOtp} className="space-y-6">
          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-2xl border rounded-lg focus:ring-2 focus:ring-kahf-green"
              />
            ))}
          </div>

          <div className="text-center text-gray-600 text-sm">
            {timer > 0 ? (
              <>Resend code in <b>{timer}s</b></>
            ) : (
              <span>Silakan register ulang</span>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-kahf-green text-white rounded-lg font-medium hover:bg-green-700"
          >
            Verify
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <Link to="/login" className="text-gray-600 hover:text-kahf-green">
            Back to Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Otp;
