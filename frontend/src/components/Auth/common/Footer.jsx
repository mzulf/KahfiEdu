import React from "react";
import { Box, Typography, Container } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: "#047857", 
        mt: 6,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="body2"
          align="center"
          sx={{
            color: "#ECFDF5", 
            fontSize: 14,
            py: 3,
            fontWeight: 500,
            letterSpacing: 0.3,
          }}
        >
          © 2025 Kahfi Education. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
