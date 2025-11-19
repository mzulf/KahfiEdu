import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { useAuth } from '../hooks/useAuth';
import { cookieService } from '../services/cookieService';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const token = cookieService.getAuthToken();
        const role = cookieService.getUserRole();

        if (!token || !role) {
            return setLoading(false);
        }

        if ((role === 'admin' && !location.pathname.startsWith('/admin')) ||
            (role === 'customer' && location.pathname.startsWith('/admin'))) {
            return window.location.replace('/');
        }

        setLoading(false);
    }, [location.pathname]);

    if (loading) return <LoadingOverlay />;
    return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
