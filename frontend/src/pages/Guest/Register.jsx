import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../libs/axiosInstance';
import AuthLayout from '../../components/AuthLayout';
import FormInput from '../../components/Ui/FormInput';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  useEffect(() => {
    const p = form.password;
    if (!p) {
      setPasswordStrength('');
      return;
    }

    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[@$!%*?&]/.test(p)) score++;

    if (score <= 2) setPasswordStrength('weak');
    else if (score <= 4) setPasswordStrength('medium');
    else setPasswordStrength('strong');
  }, [form.password]);

  const validate = () => {
    const newErrors = {};

    if (form.name.trim().length < 3) {
      newErrors.name = 'Nama minimal 3 karakter.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      newErrors.email = 'Format email tidak valid.';
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(form.password)) {
      newErrors.password =
        'Password minimal 8 karakter dan mengandung huruf besar, kecil, angka, serta simbol.';
    }

    if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = 'Konfirmasi password tidak cocok.';
    }

    if (!form.agree) {
      newErrors.agree = 'Anda harus menyetujui syarat & ketentuan.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axios.post(
        '/auth/register',
        {
          name: form.name,
          email: form.email,
          password: form.password,
          roleId: 2,
        },
        {
          headers: {
            'x-api-key': import.meta.env.VITE_API_KEY,
          },
        }
      );

      if (res.status === 201) {
        localStorage.setItem('email', form.email);
        localStorage.setItem('userId', res.data.userId);
        navigate('/otp');
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Terjadi kesalahan pada server.';

      setErrors({ general: message });
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
      <span
        className={`ml-2 px-2 py-1 text-xs text-white rounded ${color[passwordStrength]}`}
      >
        {text[passwordStrength]}
      </span>
    );
  };

  return (
    <AuthLayout greeting="Halo" sidebarText='Mari bersama "Mengaji Dari Hati"'>
      <div className="w-full max-w-md mx-auto px-2 sm:px-0 relative">
        {/* BUTTON KEMBALI */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="absolute -top-2 -left-2 text-kahf-green hover:opacity-80"
        >
          <ArrowBackIcon />
        </button>

        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">
          Register
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Name *</label>
            <FormInput name="name" value={form.name} onChange={handleChange} />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Email *</label>
            <FormInput name="email" value={form.email} onChange={handleChange} />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Password * {renderStrength()}
            </label>
            <FormInput
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              showPasswordToggle
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Confirm Password *
            </label>
            <FormInput
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
              className="mt-1"
            />
            <label className="text-sm leading-relaxed">
              Saya menyetujui Syarat & Ketentuan
            </label>
          </div>
          {errors.agree && (
            <p className="text-red-500 text-xs">{errors.agree}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-kahf-green text-white rounded-lg font-medium transition hover:bg-green-700"
          >
            Daftar
          </button>
        </form>

        {errors.general && (
          <p className="mt-4 text-red-500 text-sm text-center">
            {errors.general}
          </p>
        )}

        <div className="mt-6 text-sm text-center">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-kahf-green font-medium">
            Masuk
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;
