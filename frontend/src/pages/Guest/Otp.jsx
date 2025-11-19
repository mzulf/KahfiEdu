import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';

const Otp = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const [timer, setTimer] = useState(60);

  const navigate = useNavigate();

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // If input is filled, move to next input
    if (value !== '' && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input when backspace is pressed and current input is empty
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();

    // Only proceed if the pasted content is a 4-digit number
    if (/^\d{4}$/.test(pastedData)) {
      const digits = pastedData.split('');
      const newOtp = [...otp];

      digits.forEach((digit, index) => {
        if (index < 4) {
          newOtp[index] = digit;
        }
      });

      setOtp(newOtp);
      inputRefs[3].current.focus();
    }
  };

  const resendOtp = () => {
    setTimer(60);
    // Logic for resending Otp would go here
  };

  const verifyOtp = (e) => {
    e.preventDefault();
    // Logic for verifying Otp would go here
    console.log('Verifying Otp:', otp.join(''));
    navigate('/blog');
  };

  return (
    <AuthLayout
      greeting="Verifikasi Otp"
      sidebarText="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Enter Otp</h2>

      <p className="text-center text-gray-600 mb-6">
        Kami telah mengirim code Otp verifikasi ke <br />
        <span className="font-medium">example@email.com</span>
      </p>

      <form onSubmit={verifyOtp} className="space-y-6 w-full">
        <div className="flex justify-center space-x-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : null}
              className="w-14 h-14 text-center text-2xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kahf-green"
            />
          ))}
        </div>

        <div className="text-center">
          {timer > 0 ? (
            <p className="text-gray-600">Resend code in <span className="font-medium">{timer}s</span></p>
          ) : (
            <button
              type="button"
              onClick={resendOtp}
              className="text-kahf-green font-medium hover:underline"
            >
              Resend Otp
            </button>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-kahf-green text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Verify
        </button>
      </form>

      <div className="mt-4 text-sm text-center">
        <Link to="/login" className="text-gray-600 hover:text-kahf-green">
          Back to Login
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Otp;