import { Outlet, useLocation } from 'react-router-dom';
import { Box, Container, useMediaQuery } from '@mui/material';

import routeTitleMap from '../utils/routeTitleMap';
import NavbarAdmin from '../components/Admin/common/NavbarAdmin';
import FooterAdmin from '../components/Admin/common/FooterAdmin';
import CustomeBreadcrumb from '../components/Ui/CustomeBreadcrumb';

export default function AdminLayout() {
    const location = useLocation();
    const isLoginPage = location.pathname === '/admin/login';
    const title = routeTitleMap[location.pathname] || 'Dashboard';

    // Media query untuk padding atau layout berbeda di mobile
    const isMobile = useMediaQuery('(max-width:768px)');

    return (
        <Box
            display="flex"
            flexDirection="column"
            minHeight="100vh"
            bgcolor="#F4F4F4"
        >
            {!isLoginPage && <NavbarAdmin />}

            <Box component="main" minHeight="80vh" flexGrow={1} px={isMobile ? 2 : 4}>
                {!isLoginPage && <CustomeBreadcrumb title={title} />}
                <Container
                    disableGutters={isMobile}
                    maxWidth={false} // <--- Tambahkan ini
                    sx={{ width: '100%' }}
                >
                    <Outlet />
                </Container>
            </Box>

            {!isLoginPage && <FooterAdmin />}
        </Box>
    );
}
