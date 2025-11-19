import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../../components/AuthLayout';
import FormInput from '../../../components/UI/FormInput';
import SocialButton from '../../../components/UI/SocialButton';
import useAlert from '../../../hooks/useAlert';
import { useAuth } from '../../../hooks/useAuth';
import { useState } from 'react';
import { Box, Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
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
    setLoading(true)
    try {
      const res = await AuthService.login(formData.email, formData.password)
      if (res.message && res.token && res.role) {
        login(res.token, res.role);
        showAlert(res.message, "succes")
        navigate("/siswa")
      }
    } catch (error) {
      showAlert(error.message, "error");
    } finally {
      setLoading(false)
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
      sidebarText="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>

      <form onSubmit={handleSubmit} className=" w-full">
        <div>
          <label className="block text-sm font-medium">Email<span className="text-red-500">*</span></label>
          <TextField
            fullWidth
            required
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
          <label className="block text-sm font-medium">Password<span className="text-red-500">*</span></label>
          <TextField
            fullWidth
            required
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

      <div className="mt-6 w-full">
        <SocialButton
          icon={<svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>}
          provider="Google"
        />
      </div>

      <div className="mt-4 text-sm text-center">
        Belum memiliki akun? <Link to="/register" className="text-kahf-green font-medium">Daftar</Link>
      </div>
    </AuthLayout>
  );
};

export default Login;
