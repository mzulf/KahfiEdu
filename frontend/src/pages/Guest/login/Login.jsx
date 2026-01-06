import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  ArrowBack,
} from "@mui/icons-material";

import AuthLayout from "../../../components/AuthLayout";
import useAlert from "../../../hooks/useAlert";
import { useAuth } from "../../../hooks/useAuth";
import AuthService from "../../../services/authService";

export default function Login() {
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

      if (status === 401) {
        showAlert("Email atau password salah", "error");
      } else if (status === 404) {
        showAlert("Akun tidak ditemukan", "error");
      } else if (status === 403) {
        showAlert("Akun Anda tidak aktif. Hubungi admin.", "error");
      } else {
        showAlert("Terjadi kesalahan. Silakan coba lagi.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleTogglePassword = () => {
    setFormData({ ...formData, showPassword: !formData.showPassword });
  };

  return (
    <AuthLayout
      greeting="Selamat Datang"
      sidebarText="Silakan login menggunakan akun Anda untuk melanjutkan."
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
          mx: "auto",
          position: "relative",
        }}
      >
        {/* BUTTON KEMBALI */}
        <IconButton
          onClick={() => navigate("/")}
          sx={{
            position: "absolute",
            top: -8,
            left: -8,
            color: "#0B7A75",
          }}
        >
          <ArrowBack />
        </IconButton>

        <Typography
          variant="h5"
          fontWeight={700}
          textAlign="center"
          mb={3}
        >
          Log In
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Typography fontSize={14} fontWeight={500}>
            Email <span style={{ color: "red" }}>*</span>
          </Typography>
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

          <Typography fontSize={14} fontWeight={500} mt={1}>
            Password <span style={{ color: "red" }}>*</span>
          </Typography>
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
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box textAlign="right" mt={1}>
            <Link
              to="/forgot-password"
              style={{
                fontSize: 14,
                color: "#666",
                textDecoration: "none",
              }}
            >
              Lupa password?
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 3,
              py: 1.4,
              bgcolor: "#0B7A75",
              fontWeight: 600,
              "&:hover": { bgcolor: "#08665F" },
            }}
          >
            {loading ? "Memproses..." : "Masuk"}
          </Button>
        </Box>

        <Typography fontSize={14} textAlign="center" mt={3}>
          Belum memiliki akun?{" "}
          <Link
            to="/register"
            style={{
              color: "#008B47",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Daftar
          </Link>
        </Typography>
      </Box>
    </AuthLayout>
  );
}
