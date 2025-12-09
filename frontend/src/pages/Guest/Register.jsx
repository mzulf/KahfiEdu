import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';
import FormInput from '../../components/UI/FormInput';
import SocialButton from '../../components/UI/SocialButton';

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // PASSWORD STRENGTH
  useEffect(() => {
    const p = form.password;
    if (p.length < 1) return setPasswordStrength("");

    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[@$!%*?&]/.test(p)) score++;

    if (score <= 2) setPasswordStrength("weak");
    else if (score <= 4) setPasswordStrength("medium");
    else setPasswordStrength("strong");
  }, [form.password]);

  // VALIDATION
  const validate = () => {
    let newErrors = {};

    if (form.name.trim().length < 3) {
      newErrors.name = "Nama minimal 3 karakter.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      newErrors.email = "Format email tidak valid.";
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(form.password)) {
      newErrors.password =
        "Password minimal 8 karakter, harus ada huruf besar, huruf kecil, angka, dan simbol.";
    }

    if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Konfirmasi password tidak cocok.";
    }

    if (!form.agree) {
      newErrors.agree = "Anda harus menyetujui syarat & ketentuan.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    navigate("/otp");
  };

  // PASSWORD STRENGTH BADGE UI
  const renderStrength = () => {
    if (!passwordStrength) return null;
    const color = {
      weak: "bg-red-500",
      medium: "bg-yellow-500",
      strong: "bg-green-600",
    };
    const text = {
      weak: "Lemah",
      medium: "Sedang",
      strong: "Kuat",
    };

    return (
      <span className={`text-white px-2 py-1 text-xs rounded ${color[passwordStrength]}`}>
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
          <label className="block mb-2 text-sm font-medium">
            Name <span className="text-red-500">*</span>
          </label>
          <FormInput
            name="name"
            placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
            required
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* EMAIL */}
        <div>
          <label className="block mb-2 text-sm font-medium">
            Email <span className="text-red-500">*</span>
          </label>

          <FormInput
            type="text"  
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
          />

          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>



        {/* PASSWORD */}
        <div>
          <label className="block mb-2 text-sm font-medium">
            Password <span className="text-red-500">*</span> {renderStrength()}
          </label>
          <FormInput
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            showPasswordToggle={true}
            required
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        {/* CONFIRM PASSWORD */}
        <div>
          <label className="block mb-2 text-sm font-medium">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <FormInput
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div>

        {/* AGREE */}
        <div className="flex items-center gap-2">
          <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} />
          <label className="text-sm">
            Saya menyetujui <span className="text-kahf-green">Syarat & Ketentuan</span>.
            <span className="text-red-500">*</span>
          </label>
        </div>
        {errors.agree && <p className="text-red-500 text-sm">{errors.agree}</p>}

        <button
          type="submit"
          disabled={!form.name || !form.email || !form.password}
          className="w-full py-3 bg-kahf-green text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
        >
          Daftar
        </button>
      </form>

      <div className="mt-4 text-sm text-center">
        Sudah memiliki akun?{" "}
        <Link to="/login" className="text-kahf-green font-medium">
          Masuk
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Register;
