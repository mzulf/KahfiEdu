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
    Button
} from "@mui/material";
import { useState } from "react";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import useAlert from '../../../hooks/useAlert';
import AuthService from "../../../services/authService";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const LoginAdmin = () => {
    const { showAlert } = useAlert();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        showPassword: false,
        rememberMe: true
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await AuthService.login(formData.email, formData.password);
            if (response.message && response.token && response.role) {
                if (response.role === "admin" || response.role === "teacher") {
                    login(response.token, response.role);
                    showAlert('Login berhasil', 'success');
                    navigate('/admin/dashboard');
                } else {
                    showAlert('Unauthorization', 'error');
                    return;
                }
            } else {
                showAlert("Login gagal. Data tidak valid.", 'error');
            }
        } catch (error) {
            console.error(error.message);
            showAlert(error.message || "Internal server error", 'error');
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

    const handleRememberMe = (e) => {
        setFormData({
            ...formData,
            rememberMe: e.target.checked
        });
    };

    return (
        <Box
            display="flex"
            minHeight="100vh"
            justifyContent="center"
            alignItems="center"
            sx={{ backgroundColor: '#f5f5f5', px: 2 }}
        >
            <Card
                sx={{
                    width: '100%',
                    maxWidth: 400,
                    boxShadow: 3,
                    py: { xs: 6, md: 8 },
                    px: { xs: 3, md: 4 },
                }}
            >
                <Stack alignItems="center" >
                    <CardMedia
                        component="img"
                        image="/img/logo/logo.png"
                        alt="Logo"
                        sx={{
                            width: 100,
                            height: 50,
                            objectFit: 'contain',
                        }}
                    />

                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" fontWeight={700}>
                            Masuk
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Enter your email and password to sign in
                        </Typography>
                    </Box>

                    <CardContent sx={{ width: '100%', pt: 1 }}>
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={2}>
                                <FormControl variant="outlined" fullWidth>
                                    <FormLabel>Email</FormLabel>
                                    <OutlinedInput
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </FormControl>

                                <FormControl variant="outlined" fullWidth>
                                    <FormLabel>Password</FormLabel>
                                    <OutlinedInput
                                        id="password"
                                        name="password"
                                        type={formData.showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        required
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleTogglePassword} edge="end">
                                                    {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formData.rememberMe}
                                                onChange={handleRememberMe}
                                                name="rememberMe"
                                                color="primary"
                                            />
                                        }
                                        label="Remember me"
                                    />
                                </FormControl>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    disabled={loading}
                                    sx={{
                                        backgroundColor: '#1B986E',
                                        '&:hover': {
                                            backgroundColor: '#007c73',
                                        },
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {loading ? 'Logging in...' : 'Login'}
                                </Button>
                            </Stack>
                        </form>
                    </CardContent>
                </Stack>
            </Card>
        </Box>
    );
};

export default LoginAdmin;
