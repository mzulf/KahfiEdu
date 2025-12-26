import { useState } from "react";
import { Box, Container, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";
import Ewallet from "./Ewallet";
import Transfer from "./Transfer";

export default function PaymentMethod() {
  const [method, setMethod] = useState("ewallet");

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: 4,
          p: 4,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
          Metode Pembayaran
        </Typography>

        {/* SELECT METHOD */}
        <ToggleButtonGroup
          value={method}
          exclusive
          fullWidth
          onChange={(e, v) => v && setMethod(v)}
          sx={{ mb: 4 }}
        >
          <ToggleButton value="ewallet">E-Wallet</ToggleButton>
          <ToggleButton value="transfer">Transfer Bank</ToggleButton>
        </ToggleButtonGroup>

        {method === "ewallet" ? <Ewallet /> : <Transfer />}
      </Box>
    </Container>
  );
}
