import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KahfLogo from '../../components/KahfLogo';
import FormInput from '../../components/UI/FormInput';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Check your email for reset instructions');
    navigate('/reset-password');
  };

  return (
    <div className="flex min-h-screen bg-gray-100 items-center justify-center">
      <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 w-full max-w-md">
        <div className="flex justify-center mb-4">
          <KahfLogo className="h-6 md:h-8" />
        </div>
        <h2 className="text-xl font-bold mb-4 text-center">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Email</label>
            <FormInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="px-12 py-2.5 bg-kahf-green text-white rounded-full hover:bg-green-700 transition-colors"
            >
              Send Reset Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;