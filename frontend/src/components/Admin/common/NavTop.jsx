// NavTop.jsx
import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    TextField
} from "@mui/material";
import {
    HiLogout,
    HiMenu
} from "react-icons/hi";
import { Search } from "@mui/icons-material";
import CustomeAvatar from "../../UI/CustomeAvatar";
import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function NavTop({ onOpenDrawer }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const open = Boolean(anchorEl);
    const { logout } = useAuth();

    const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);

    const handleLogout = () => {
        logout();
        handleCloseMenu();
        navigate("/");
    };

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            gap={1}
            flexWrap="wrap"
        >
            {/* LEFT */}
            <Box
                sx={{
                    display: "flex",
                    width: { xs: "auto", md: "30%" },
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                <Box
                    component="img"
                    src="/img/logo/logo.png"
                    alt="logo-kahf"
                    sx={{ width: { xs: 60, md: 70 }, objectFit: "contain" }}
                />

                {/* Hamburger Menu (mobile) */}
                <IconButton
                    sx={{ display: { xs: "inline-flex", md: "none" } }}
                    onClick={onOpenDrawer}
                >
                    <HiMenu size={24} />
                </IconButton>
            </Box>

            {/* RIGHT */}
            <Box display="flex" alignItems="center" gap={2}>
                <TextField
                    placeholder="search here ..."
                    size="small"
                    sx={{
                        minWidth: { xs: 0, sm: 200 },
                        display: { xs: "none", md: "flex" },
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />

                <Button onClick={handleOpenMenu} sx={{ minWidth: 0 }}>
                    <CustomeAvatar
                        src="/img/avatar/avatar-1.png"
                        alt="avatar"
                    />
                </Button>

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleCloseMenu}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    PaperProps={{ sx: { px: 1, mt: 1 } }}
                >
                    <MenuItem
                        onClick={handleLogout}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            "&:hover": {
                                backgroundColor: "#ffecec",
                                color: "#c62828",
                            },
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

export default NavTop;
