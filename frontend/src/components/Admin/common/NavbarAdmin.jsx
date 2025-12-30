// NavbarAdmin.jsx
import { useState } from 'react';
import { Box } from '@mui/material';
import NavTop from './NavTop';
import NavMenu from './NavMenu';

function NavbarAdmin() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = (open) => () => setDrawerOpen(open);

    return (
        <Box
            sx={{
                px: { xs: 2, md: 7 },     // padding horizontal: 2 on mobile, 7 on desktop
                pt: { xs: 2 },
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <NavTop onOpenDrawer={toggleDrawer(true)} />
            <NavMenu drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />
        </Box>
    );
}

export default NavbarAdmin;
