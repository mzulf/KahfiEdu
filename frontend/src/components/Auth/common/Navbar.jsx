import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
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

import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

// ⭐ UPDATED — Kita perlu Link untuk navigasi notif
import { Link, useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "../../../hooks/useAuth";

// Search Input
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  border: "1px solid #ccc",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": { backgroundColor: alpha(theme.palette.common.white, 0.25) },
  width: "100%",
  [theme.breakpoints.up("sm")]: { width: "auto" },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  },
}));

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Sidebar menu list
  const menuItems = [
    {
      name: "Dashboard",
      icon: <DashboardIcon color="success" />,
      path: "/siswa",
    },
    {
      name: "Jadwal",
      icon: <CalendarMonthIcon color="success" />,
      path: "/siswa/jadwal",
    },
    {
      name: "Data Guru",
      icon: <StorageIcon color="success" />,
      path: "/siswa/pengajar",
    },
    {
      name: "Materi",
      icon: <MenuBookIcon color="success" />,
      path: "/siswa/materi",
    },
    {
      name: "Program",
      icon: <AssignmentIcon color="success" />,
      path: "/siswa/program",
    },
    {
      name: "Profile",
      icon: <PersonIcon color="success" />,
      path: "/siswa/profile",
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* NAVBAR */}
      <AppBar position="static" elevation={0} sx={{ backgroundColor: "lightgreen", color: "black" }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

            {/* LEFT GROUP */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton onClick={toggleDrawer}>
                <MenuIcon />
              </IconButton>

              <img
                src="/img/logo/logo.png"
                alt="Logo"
                style={{ height: "45px" }}
              />
            </Box>

            {/* RIGHT SIDE (DESKTOP) */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>

              <Search sx={{ display: "flex", alignItems: "center" }}>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase placeholder="Search…" />
              </Search>

              
              <IconButton
                color="success"
                component={Link}            
                to="/siswa/notifikasi"      
              >
                <NotificationsIcon />
              </IconButton>

              <IconButton color="success" onClick={(e) => setAnchorEl(e.currentTarget)}>
                <AccountCircle />
              </IconButton>
            </Box>

          </Toolbar>
        </Container>
      </AppBar>

      {/* PROFILE MENU */}
      <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => navigate("/siswa/profile")}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>

      {/* DRAWER SIDEBAR */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 260, p: 2 }}>

          {/* HEADER DRAWER */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Kahfi Education
            </Typography>

            <IconButton onClick={toggleDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography sx={{ fontWeight: 600, mb: 2 }}>Menu</Typography>

          {/* LIST MENU */}
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.name} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={currentPath === item.path}
                  onClick={toggleDrawer}
                  sx={{ mb: 1, borderRadius: "12px" }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}

            {/* LOGOUT */}
            <ListItem disablePadding sx={{ mt: 2 }}>
              <ListItemButton onClick={handleLogout} sx={{ color: "red" }}>
                <ListItemIcon>
                  <LogoutIcon sx={{ color: "red" }} />
                </ListItemIcon>
                <ListItemText primary="Log out" />
              </ListItemButton>
            </ListItem>

          </List>

        </Box>
      </Drawer>
    </Box>
  );
}
