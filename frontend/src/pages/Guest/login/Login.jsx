import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../../components/AuthLayout";
import useAlert from "../../../hooks/useAlert";
import { useAuth } from "../../../hooks/useAuth";
import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import AuthService from "../../../services/authService";

const Login = () => {
  const { showAlert } = useAlert();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    showPassword: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* ================= VALIDATION ================= */
  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await AuthService.login(
        formData.email,
        formData.password
      );

      if (res?.token && res?.role) {
        login(res.token, res.role);
        showAlert("Login berhasil", "success");
        navigate("/siswa");
      }
    } catch (error) {
      const status = error?.response?.status;

      // 🔥 Mapping error message
      if (status === 401) {
        showAlert("Email atau password salah", "error");
      } else if (status === 404) {
        showAlert("Akun tidak ditemukan", "error");
      } else if (status === 403) {
        showAlert("Akun Anda tidak aktif. Hubungi admin.", "error");
      } else {
        showAlert(
          "Terjadi kesalahan. Silakan coba lagi.",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= HANDLER ================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // clear error per field
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const handleTogglePassword = () => {
    setFormData({
      ...formData,
      showPassword: !formData.showPassword,
    });
  };

  return (
    <AuthLayout
      greeting="Selamat Datang"
      sidebarText="Silakan login menggunakan akun Anda untuk melanjutkan."
    >
      <h2 className="text-2xl font-bold mb-6 text-center">
        Log In
      </h2>

      <form onSubmit={handleSubmit} className="w-full">
        {/* ================= EMAIL ================= */}
        <label className="block text-sm font-medium">
          Email <span className="text-red-500">*</span>
        </label>
        <TextField
          fullWidth
          name="email"
          placeholder="Masukkan email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          error={Boolean(errors.email)}
          helperText={errors.email}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email />
              </InputAdornment>
            ),
          }}
        />

        {/* ================= PASSWORD ================= */}
        <label className="block text-sm font-medium mt-2">
          Password <span className="text-red-500">*</span>
        </label>
        <TextField
          fullWidth
          name="password"
          type={formData.showPassword ? "text" : "password"}
          placeholder="Masukkan password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          error={Boolean(errors.password)}
          helperText={errors.password}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleTogglePassword}
                  edge="end"
                >
                  {formData.showPassword ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box display="flex" justifyContent="flex-end" mt={1}>
          <Link
            to="/forgot-password"
            className="text-sm text-gray-600 hover:text-kahf-green"
          >
            Lupa password?
          </Link>
        </Box>

        {/* ================= BUTTON ================= */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            py: 1.5,
            backgroundColor: "#0B7A75",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#08665F",
            },
          }}
          disabled={loading}
        >
          {loading ? "Memproses..." : "Masuk"}
        </Button>
      </form>

      <div className="mt-4 text-sm text-center">
        Belum memiliki akun?{" "}
        <Link
          to="/register"
          className="text-kahf-green font-medium"
        >
          Daftar
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Login;
