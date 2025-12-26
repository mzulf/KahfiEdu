import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
  Typography,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import StorageIcon from "@mui/icons-material/Storage";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

/* ================= SEARCH ================= */
const Search = styled("div")({
  position: "relative",
  borderRadius: 14,
  backgroundColor: "#ffffff",
  border: "1px solid #E5E7EB",
  width: 260,
});

const SearchIconWrapper = styled("div")({
  padding: "0 16px",
  height: "100%",
  position: "absolute",
  display: "flex",
  alignItems: "center",
  color: "#9CA3AF",
});

const StyledInputBase = styled(InputBase)({
  width: "100%",
  "& .MuiInputBase-input": {
    padding: "9px 8px 9px 0",
    paddingLeft: "48px",
    fontSize: 14,
  },
});

/* ================= COMPONENT ================= */
export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { name: "Dashboard", icon: <DashboardIcon />, path: "/siswa" },
    { name: "Jadwal", icon: <CalendarMonthIcon />, path: "/siswa/jadwal" },
    { name: "Data Guru", icon: <StorageIcon />, path: "/siswa/pengajar" },
    { name: "Materi", icon: <MenuBookIcon />, path: "/siswa/materi" },
    { name: "Program", icon: <AssignmentIcon />, path: "/siswa/kelas" },
    { name: "Profile", icon: <PersonIcon />, path: "/siswa/profile" },
  ];

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #047857, #34D399)",
          zIndex: 1300,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ minHeight: 72, justifyContent: "space-between" }}>
            {/* LEFT */}
            <Box display="flex" alignItems="center" gap={1.5}>
              <IconButton
                onClick={() => setDrawerOpen(true)}
                sx={{ color: "#fff" }}
              >
                <MenuIcon />
              </IconButton>

              <Box
                sx={{
                  backgroundColor: "white",
                  borderRadius: 150,
                  px: 1.2,
                  py: 0.5,
                }}
              >
                <img
                  src="/img/logo/logo.png"
                  alt="logo"
                  style={{ height: 34 }}
                />
              </Box>
            </Box>

            {/* RIGHT */}
            <Box
              display={{ xs: "none", md: "flex" }}
              alignItems="center"
              gap={2}
            >
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase placeholder="Search..." />
              </Search>

              {/* 🔔 NOTIFIKASI — FIX */}
              <IconButton
                sx={{ color: "white" }}
                onClick={() => navigate("/siswa/notifikasi")}
              >
                <NotificationsIcon />
              </IconButton>

              <IconButton
                sx={{ color: "white" }}
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                <AccountCircle />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* SPACER RESMI MUI (ANTI GAP PUTIH) */}
      <Toolbar />

      {/* ================= PROFILE MENU ================= */}
     <Drawer
  anchor="left"
  open={drawerOpen}
  onClose={() => setDrawerOpen(false)}
  ModalProps={{
    keepMounted: true,
  }}
  BackdropProps={{
    invisible: false,
  }}
>
  <Box
    sx={{
      width: 280,
      bgcolor: "#F0FDF4",
      p: 2,
    }}
  >
    {/* HEADER */}
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
      <Typography fontWeight={700}>Menu</Typography>
      <IconButton onClick={() => setDrawerOpen(false)}>
        <CloseIcon />
      </IconButton>
    </Box>

    <List disablePadding>
      {menuItems.map((item) => {
        const active = location.pathname === item.path;

        return (
          <ListItem key={item.name} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={() => setDrawerOpen(false)}
              sx={{
                borderRadius: 2,
                bgcolor: active ? "#D1FAE5" : "transparent",
                "&:hover": { bgcolor: "#ECFDF5" },
              }}
            >
              <ListItemIcon sx={{ color: "#047857" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        );
      })}

      <ListItem disablePadding sx={{ mt: 1 }}>
        <ListItemButton
          onClick={() => {
            setDrawerOpen(false);
            logout();
          }}
        >
          <ListItemIcon sx={{ color: "#DC2626" }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </ListItem>
    </List>
  </Box>
</Drawer>



    </>
  );
}
