import React from "react";
import { Box, Typography, Container } from "@mui/material";

function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: "#e9f7ef",
        borderTop: "1px solid #d4edda",
        mt: 6,
      }}
    >
      <Container maxWidth="lg">
        {/* Divider */}
        <Box
          sx={{
            height: 1,
            backgroundColor: "#cce5d3",
            opacity: 0.8,
            my: 3,
          }}
        />

        {/* Copyright */}
        <Typography
          variant="body2"
          align="center"
          sx={{
            color: "#555",
            fontSize: 14,
            pb: 3,
          }}
        >
          © {new Date().getFullYear()}{" "}
          <strong>Kahfi Education</strong>. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
