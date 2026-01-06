import { useState } from 'react';
import KahfLogo from '../../components/KahfLogo';
import FormInput from '../../components/Ui/FormInput';
import axiosInstance from '../../libs/axiosInstance';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email) {
      setErrorMsg('Email wajib diisi!');
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post('/auth/forgot-password', { email });
      alert('Silakan cek email Anda untuk reset password');
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || 'Gagal mengirim email reset password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 items-center justify-center px-2">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-md">
        <div className="flex justify-center mb-4">
          <KahfLogo className="h-6 sm:h-8" />
        </div>

        <h2 className="text-lg sm:text-xl font-bold mb-4 text-center">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <FormInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
