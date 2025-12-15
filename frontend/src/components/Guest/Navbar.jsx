import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import { Link, useLocation } from "react-router-dom";

const pages = [
  { name: "Beranda", path: "/" },
  { name: "Tentang Kami", path: "/tentangkami" },
  { name: "Blog", path: "/blog" },
  { name: "Karir", path: "/karir" },
];

const Navbar = () => {
  const [openMobile, setOpenMobile] = React.useState(false);
  const location = useLocation();

  const handleToggleMobile = () => {
    setOpenMobile((prev) => !prev);
  };

  const handleClose = () => {
    setOpenMobile(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#fff",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 72 }}>
          {/* LOGO */}
          <Box sx={{ display: "flex", alignItems: "center", mr: 4 }}>
            <Link to="/">
              <img
                src="/img/logo/logo.png"
                alt="Logo"
                style={{ height: 48 }}
              />
            </Link>
          </Box>

          {/* MENU DESKTOP */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              gap: 2,
            }}
          >
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.path}
                onClick={handleClose}
                sx={{
                  fontSize: 15,
                  fontWeight: 500,
                  textTransform: "none",
                  color: isActive(page.path) ? "#008B47" : "#333",
                  borderBottom: isActive(page.path)
                    ? "2px solid #008B47"
                    : "2px solid transparent",
                  borderRadius: 0,
                  px: 1,
                  "&:hover": {
                    backgroundColor: "transparent",
                    color: "#008B47",
                  },
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* AUTH BUTTON DESKTOP */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              sx={{
                color: "#008B47",
                borderColor: "#008B47",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Masuk
            </Button>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              sx={{
                backgroundColor: "#008B47",
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "none",
                "&:hover": { backgroundColor: "#00753c" },
              }}
            >
              Daftar
            </Button>
          </Box>

          {/* MOBILE BUTTON */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton onClick={handleToggleMobile}>
              {openMobile ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* MOBILE MENU */}
      {openMobile && (
        <Box
          sx={{
            backgroundColor: "#fff",
            borderTop: "1px solid #e0e0e0",
          }}
        >
          {pages.map((page) => (
            <MenuItem
              key={page.name}
              component={Link}
              to={page.path}
              onClick={handleClose}
              sx={{
                justifyContent: "center",
                py: 1.5,
                color: isActive(page.path) ? "#008B47" : "#333",
                fontWeight: isActive(page.path) ? 600 : 400,
              }}
            >
              {page.name}
            </MenuItem>
          ))}

          <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              onClick={handleClose}
              sx={{
                borderColor: "#008B47",
                color: "#008B47",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Masuk
            </Button>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              onClick={handleClose}
              sx={{
                backgroundColor: "#008B47",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Daftar
            </Button>
          </Box>
        </Box>
      )}
    </AppBar>
  );
};

export default Navbar;
