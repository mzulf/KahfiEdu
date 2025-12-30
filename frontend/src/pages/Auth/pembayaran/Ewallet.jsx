import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Stack,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const MIN_AMOUNT = 10000;

const ewallets = [
  {
    id: "dana",
    name: "Dana",
    logo: "/img/dana.jpg",
  },
  {
    id: "ovo",
    name: "OVO",
    logo: "/img/ovo.jpg",
  },
  {
    id: "shopeepay",
    name: "ShopeePay",
    logo: "/img/Shopee-Pay-Logo-Small.png",
  },
];


const formatRupiah = (value) =>
  value
    ? "Rp " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    : "";

export default function Ewallet() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("dana");
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
        Pilih E-Wallet
      </Typography>

      {/* WALLET LIST */}
      <Stack direction="row" spacing={2} mb={3}>
        {ewallets.map((w) => (
          <Box
            key={w.id}
            onClick={() => setSelected(w.id)}
            sx={{
              flex: 1,
              p: 1.5,
              borderRadius: 3,
              border: selected === w.id ? "2px solid #10B981" : "1px solid #ddd",
              cursor: "pointer",
              textAlign: "center",
              transition: "0.2s",
            }}
          >
            <Avatar
              src={w.logo}
              alt={w.name}
              sx={{ width: 48, height: 48, mx: "auto", mb: 1 }}
            />
            <Typography fontSize={14} fontWeight="bold">
              {w.name}
            </Typography>
          </Box>
        ))}
      </Stack>

      {/* FORM */}
      <Stack spacing={2}>
        <TextField label="Nomor HP" fullWidth size="small" />
        <TextField label="Nama" fullWidth size="small" />

        <TextField
          label="Nominal"
          fullWidth
          size="small"
          value={formatRupiah(numericAmount)}
          onChange={(e) => {
            setError("");
            setAmount(e.target.value);
          }}
        />

        {error && <Alert severity="error">{error}</Alert>}

        <Button
          fullWidth
          onClick={handleSubmit}
          sx={{
            mt: 1,
            py: 1.3,
            borderRadius: 3,
            fontWeight: "bold",
            bgcolor: "#10B981",
            "&:hover": { bgcolor: "#059669" },
          }}
          variant="contained"
        >
          Bayar Sekarang
        </Button>
      </Stack>
    </Box>
  );
}
