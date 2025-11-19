import React, { useState } from 'react';
import KahfLogo from '../../components/KahfLogo';
import FormInput from '../../components/UI/FormInput';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Password reset successful!');
  };

  return (
    <div className="flex min-h-screen bg-gray-100 items-center justify-center">
      <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 w-full max-w-md">
        <div className="flex justify-center mb-4">
          <KahfLogo className="h-6 md:h-8" />
        </div>
        <h2 className="text-xl font-bold mb-4 text-center">Set New Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">New Password</label>
            <FormInput
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            // optional: icon={<YourLockIcon />} 
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Confirm Password</label>
            <FormInput
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            // optional: icon={<YourLockIcon />} 
            />
          </div>
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="px-12 py-2.5 bg-kahf-green text-white rounded-full hover:bg-green-700 transition-colors"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
