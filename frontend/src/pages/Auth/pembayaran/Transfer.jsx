import { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Stack,
  Alert,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const MIN_AMOUNT = 10000;

const formatRupiah = (value) =>
  value
    ? "Rp " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    : "";

export default function Transfer() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const numericAmount = Number(amount.replace(/\D/g, ""));

  const handleSubmit = () => {
    if (numericAmount < MIN_AMOUNT) {
      setError(`Minimal pembayaran ${formatRupiah(MIN_AMOUNT)}`);
      return;
    }
    navigate("/siswa/pembayaran/invoice");
  };

  return (
    <Box>
      <Typography fontWeight="bold" mb={2}>
        Transfer Bank
      </Typography>

      <Stack spacing={2}>
        <TextField select label="Pilih Bank" size="small">
          <MenuItem value="BCA">BCA</MenuItem>
          <MenuItem value="BNI">BNI</MenuItem>
          <MenuItem value="BRI">BRI</MenuItem>
          <MenuItem value="Mandiri">Mandiri</MenuItem>
        </TextField>

        <TextField label="Nomor Rekening" size="small" />
        <TextField label="Nama" size="small" />

        <TextField
          label="Nominal"
          size="small"
          value={formatRupiah(numericAmount)}
          onChange={(e) => {
            setError("");
            setAmount(e.target.value);
          }}
        />

        {error && <Alert severity="error">{error}</Alert>}

        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            py: 1.3,
            borderRadius: 3,
            fontWeight: "bold",
            bgcolor: "#10B981",
            "&:hover": { bgcolor: "#059669" },
          }}
        >
          Bayar Sekarang
        </Button>
      </Stack>
    </Box>
  );
}
