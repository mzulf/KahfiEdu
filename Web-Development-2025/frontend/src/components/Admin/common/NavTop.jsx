// NavTop.jsx
import { Box, Button, IconButton, InputAdornment, Menu, MenuItem, Stack, TextField } from "@mui/material";
import { HiBell, HiChat, HiClipboardList, HiCog, HiLogout, HiMenu, HiUser } from "react-icons/hi";
import { Search } from "@mui/icons-material";
import CustomeAvatar from "../../UI/CustomeAvatar";
import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import IconCard from "./IconCard";
import { useNavigate } from "react-router-dom";


function NavTop({ onOpenDrawer }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate()
    const open = Boolean(anchorEl);
    const { logout } = useAuth();

    const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);

    const handleLogout = () => {
        logout();
        handleCloseMenu();
        navigate("/")
    }

    return (
        <Box display="flex" justifyContent="space-between" alignItems="center" gap={1} flexWrap="wrap">
            <Box sx={{
                display: "flex",
                width: { xs: "auto", md: "30%" },
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1
            }}
            >
                <Box component="img" src="/img/logo/logo.png" alt="logo-kahf" sx={{ width: { xs: 60, md: 70 }, objectFit: "contain" }} />
                {/* Hamburger Menu (mobile only) */}
                <IconButton sx={{ display: { xs: 'inline-flex', md: 'none' } }} onClick={onOpenDrawer}>
                    <HiMenu size={24} />
                </IconButton>
                <Stack direction="row" gap={2} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
                    <IconCard icon={<HiClipboardList size={24} />} />
                    <IconCard icon={<HiChat size={24} />} />
                </Stack>
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
                <IconCard icon={<HiBell size={24} />} />

                <TextField
                    placeholder="search here ..."
                    size="small"
                    sx={{ minWidth: { xs: 0, sm: 200 }, display: { xs: 'none', md: 'flex' } }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />


                <Button onClick={handleOpenMenu} sx={{ minWidth: 0 }}>
                    <CustomeAvatar src="/img/avatar/avatar-1.png" alt="avatar" />
                </Button>

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleCloseMenu}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    PaperProps={{ sx: { px: 1, mt: 1 } }}
                >
                    <MenuItem onClick={handleCloseMenu} sx={menuItemStyle}>
                        <HiUser size={18} />
                        Profile
                    </MenuItem>
                    <MenuItem onClick={handleCloseMenu} sx={menuItemStyle}>
                        <HiCog size={18} />
                        Settings
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            handleLogout()
                        }}
                        sx={{
                            ...menuItemStyle,
                            '&:hover': { backgroundColor: '#ffecec', color: '#c62828' },
                        }}
                    >
                        <HiLogout size={18} />
                        Logout
                    </MenuItem>
                </Menu>
            </Box>
        </Box>
    );
}

const menuItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    '&:hover': { backgroundColor: '#f0f0f0' },
};

export default NavTop;
