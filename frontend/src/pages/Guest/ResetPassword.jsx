import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import KahfLogo from '../../components/KahfLogo';
import FormInput from '../../components/Ui/FormInput';
import axiosInstance from '../../libs/axiosInstance';

const ResetPassword = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get('token');
  const userId = params.get('userId');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  useEffect(() => {
    if (!newPassword) return setPasswordStrength('');

    let score = 0;
    if (newPassword.length >= 8) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[a-z]/.test(newPassword)) score++;
    if (/\d/.test(newPassword)) score++;
    if (/[@$!%*?&]/.test(newPassword)) score++;

    if (score <= 2) setPasswordStrength('weak');
    else if (score <= 4) setPasswordStrength('medium');
    else setPasswordStrength('strong');
  }, [newPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!token || !userId) {
      setErrorMsg('Link reset password tidak valid.');
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post('/auth/reset-password', {
        newPassword,
        token,
        userId
      });
      navigate('/login');
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Gagal reset password');
    } finally {
      setLoading(false);
    }
  };

  const renderStrength = () => {
    if (!passwordStrength) return null;
    const color = {
      weak: 'bg-red-500',
      medium: 'bg-yellow-500',
      strong: 'bg-green-600',
    };
    const text = {
      weak: 'Lemah',
      medium: 'Sedang',
      strong: 'Kuat',
    };
    return (
      <span className={`ml-2 px-2 py-1 text-xs text-white rounded ${color[passwordStrength]}`}>
        {text[passwordStrength]}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100 items-center justify-center px-2">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-md">
        <div className="flex justify-center mb-4">
          <KahfLogo className="h-6 sm:h-8" />
        </div>

        <h2 className="text-lg sm:text-xl font-bold mb-4 text-center">
          Set New Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">
              New Password {renderStrength()}
            </label>
            <FormInput
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Confirm Password
            </label>
            <FormInput
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {errorMsg && (
            <p className="text-red-500 text-sm text-center">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-kahf-green text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
