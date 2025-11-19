// src/components/SocialButton.jsx
import React from 'react';

const SocialButton = ({ icon, provider, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
    >
      {icon}
      <span>{provider}</span>
    </button>
  );
};

export default SocialButton;