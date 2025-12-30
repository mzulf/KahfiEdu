import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../libs/axiosInstance';
import AuthLayout from '../../components/AuthLayout';
import FormInput from '../../components/UI/FormInput';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // ================= PASSWORD STRENGTH =================
  useEffect(() => {
    const p = form.password;
    if (!p) return setPasswordStrength('');

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

  // ================= VALIDATION =================
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
        'Password minimal 8 karakter, harus ada huruf besar, kecil, angka, dan simbol.';
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

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axios.post(
        'auth/register',
        {
          name: form.name,
          email: form.email,
          password: form.password,
          roleId: 2, // ✅ STUDENT
        },
        {
          headers: {
            'x-api-key': import.meta.env.VITE_API_KEY,
          },
        }
      );

      if (res.status === 201 && res.data.success) {
        localStorage.setItem('email', form.email);
        localStorage.setItem('userId', res.data.userId);
        navigate('/otp');
      }
    } catch (err) {
      const message =
        err.response?.data?.message || 'Terjadi kesalahan saat register.';
      setErrors({ general: message });
      console.error('REGISTER ERROR:', err.response || err);
    }
  };

  // ================= PASSWORD BADGE =================
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
    <AuthLayout greeting="Halo" sidebarText='Mari bersama "Mengaji Dari Hati"'>
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        {/* NAME */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Name <span className="text-red-500">*</span>
          </label>
          <FormInput name="name" value={form.name} onChange={handleChange} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* EMAIL */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Email <span className="text-red-500">*</span>
          </label>
          <FormInput name="email" value={form.email} onChange={handleChange} />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        {/* PASSWORD */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Password <span className="text-red-500">*</span>
            {renderStrength()}
          </label>
          <FormInput
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            showPasswordToggle
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        {/* CONFIRM */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <FormInput
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div>

        {/* AGREE */}
        <div className="flex items-center gap-2">
          <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} />
          <label className="text-sm">
            Saya menyetujui <span className="text-kahf-green">Syarat & Ketentuan</span>
          </label>
        </div>
        {errors.agree && <p className="text-red-500 text-sm">{errors.agree}</p>}

        <button className="w-full py-3 bg-kahf-green text-white rounded-lg hover:bg-green-700">
          Daftar
        </button>
      </form>

      {errors.general && (
        <p className="mt-4 text-red-500 text-sm text-center">{errors.general}</p>
      )}

      <div className="mt-4 text-sm text-center">
        Sudah punya akun?{' '}
        <Link to="/login" className="text-kahf-green font-medium">
          Masuk
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Register;
