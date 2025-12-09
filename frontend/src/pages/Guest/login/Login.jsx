import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../../components/AuthLayout';
import useAlert from '../../../hooks/useAlert';
import { useAuth } from '../../../hooks/useAuth';
import { useState } from 'react';
import { Box, Button, IconButton, InputAdornment, TextField } from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import AuthService from '../../../services/authService';

const Login = () => {
  const { showAlert } = useAlert();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    showPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await AuthService.login(formData.email, formData.password);
      if (res.message && res.token && res.role) {
        login(res.token, res.role);
        showAlert(res.message, "success");
        navigate("/siswa");
      }
    } catch (error) {
      showAlert(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTogglePassword = () => {
    setFormData({
      ...formData,
      showPassword: !formData.showPassword
    });
  };

  return (
    <AuthLayout
      greeting="Selamat Datang"
      sidebarText="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>

      <form onSubmit={handleSubmit} className="w-full">

        <div>
          <label className="block text-sm font-medium">
            Email <span className="text-red-500">*</span>
          </label>
          <TextField
            fullWidth
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Password <span className="text-red-500">*</span>
          </label>
          <TextField
            fullWidth
            name="password"
            type={formData.showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
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
        </div>

        <Box display="flex" justifyContent="flex-end" mt={1}>
          <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-kahf-green">
            forgot password?
          </Link>
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            py: 1.5,
            backgroundColor: '#0B7A75',
            '&:hover': { backgroundColor: '#08665F' }
          }}
          disabled={loading}
        >
          {loading ? "Waiting.." : "Masuk"}
        </Button>
      </form>

      <div className="mt-4 text-sm text-center">
        Belum memiliki akun?{" "}
        <Link to="/register" className="text-kahf-green font-medium">
          Daftar
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Login;
