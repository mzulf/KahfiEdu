import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  Switch,
  FormControlLabel,
  FormControl,
  FormLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useAlert from "../../../hooks/useAlert";
import AuthService from "../../../services/authService";
import { useAuth } from "../../../hooks/useAuth";

export default function LoginAdmin() {
  const { showAlert } = useAlert();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    showPassword: false,
    rememberMe: true,
  });

  const [loading, setLoading] = useState(false);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await AuthService.login(
        formData.email,
        formData.password
      );

      if (res?.token && res?.role) {
        if (res.role === "admin" || res.role === "teacher") {
          login(res.token, res.role);
          showAlert("Login berhasil", "success");
          navigate("/admin/dashboard");
        } else {
          showAlert("Tidak memiliki akses", "error");
        }
      } else {
        showAlert("Login gagal. Data tidak valid.", "error");
      }
    } catch (error) {
      showAlert(
        error?.message || "Terjadi kesalahan pada server",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= HANDLER ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTogglePassword = () => {
    setFormData({
      ...formData,
      showPassword: !formData.showPassword,
    });
  };

  const handleRememberMe = (e) => {
    setFormData({
      ...formData,
      rememberMe: e.target.checked,
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f7fa",
        px: 2,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 3,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <CardContent
          sx={{
            px: { xs: 3, sm: 4 },
            py: { xs: 4, sm: 5 },
          }}
        >
          <Stack spacing={3} alignItems="center">
            {/* LOGO */}
            <CardMedia
              component="img"
              image="/img/logo/logo.png"
              alt="Logo"
              sx={{
                width: 120,
                height: "auto",
                objectFit: "contain",
              }}
            />

            {/* TITLE */}
            <Box textAlign="center">
              <Typography variant="h5" fontWeight={700}>
                Masuk Admin
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                mt={0.5}
              >
                Silakan masuk menggunakan akun terdaftar
              </Typography>
            </Box>

            {/* FORM */}
            <Box component="form" onSubmit={handleSubmit} width="100%">
              <Stack spacing={2}>
                {/* EMAIL */}
                <FormControl fullWidth>
                  <FormLabel>Email</FormLabel>
                  <OutlinedInput
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Masukkan email"
                    required
                  />
                </FormControl>

                {/* PASSWORD */}
                <FormControl fullWidth>
                  <FormLabel>Password</FormLabel>
                  <OutlinedInput
                    name="password"
                    type={
                      formData.showPassword ? "text" : "password"
                    }
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Masukkan password"
                    required
                    endAdornment={
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
                    }
                  />
                </FormControl>

                {/* REMEMBER ME */}
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.rememberMe}
                      onChange={handleRememberMe}
                      color="primary"
                    />
                  }
                  label="Ingat saya"
                />

                {/* BUTTON */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    mt: 1,
                    py: 1.4,
                    bgcolor: "#1B986E",
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: "#157a58",
                    },
                  }}
                >
                  {loading ? "Memproses..." : "Masuk"}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
