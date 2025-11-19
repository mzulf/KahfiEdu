import React from "react";
import { Box, Typography, Link, Container } from "@mui/material";

function Footer() {
  return (
    <Box sx={{ backgroundColor: "#fff", color: "#000", pt: 6 }}>

      {/* Garis horizontal dan copyright */}
      <Container maxWidth="lg" sx={{ mb: 2 }} >
        <hr style={{ borderColor: "#ccc", opacity: 0.3 }} />
        <Typography
          variant="body2"
          align="center"
          sx={{ color: "#666", fontSize: 14, mt: 2 }}
        >
          © {new Date().getFullYear()} Kahfi Education. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
