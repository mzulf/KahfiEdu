import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Invoice() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const dataInvoice = [
    { label: "Nama Lengkap", value: "Ahmad Fadli" },
    { label: "Email", value: "ahmad@gmail.com" },
    { label: "Nomor HP", value: "08123456789" },
    { label: "Kelas", value: "Tahfidz Online" },
    { label: "Total Pembayaran", value: "Rp 150.000" },
    { label: "Status", value: "Lunas" },
  ];

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 6 }}>
      {/* ================= INVOICE CARD ================= */}
      <Paper
        sx={{
          p: 4,
          borderRadius: 4,
          border: "2px solid #A7F3D0",
          boxShadow: "0 14px 35px rgba(0,0,0,0.15)",
        }}
      >
        <Typography variant="h4" fontWeight="bold" mb={0.5}>
          Invoice
        </Typography>
        <Typography color="text.secondary" mb={4}>
          INV/2025/05/00027
        </Typography>

        {/* ===== DATA VERTICAL ===== */}
        <Box display="flex" flexDirection="column" gap={2.5}>
          {dataInvoice.map((item) => (
            <Box key={item.label}>
              <Typography fontSize={13} color="text.secondary">
                {item.label}
              </Typography>
              <Typography fontWeight="bold" fontSize={16}>
                {item.value}
              </Typography>
              <Divider sx={{ mt: 1 }} />
            </Box>
          ))}
        </Box>

        {/* ===== BUTTON ===== */}
        <Button
          fullWidth
          sx={{
            mt: 5,
            bgcolor: "#047857",
            borderRadius: 3,
            py: 1.5,
            fontWeight: "bold",
            "&:hover": {
              bgcolor: "#065F46",
            },
          }}
          variant="contained"
          onClick={() => setOpen(true)}
        >
          Selesai
        </Button>
      </Paper>

      {/* ================= SUCCESS POPUP ================= */}
      <Dialog open={open} maxWidth="xs" fullWidth>
        <DialogContent sx={{ position: "relative", textAlign: "center", py: 5 }}>
          
          {/* CLOSE BUTTON */}
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", top: 8, left: 8 }}
          >
            <CloseIcon />
          </IconButton>

          <CheckCircleIcon
            sx={{ fontSize: 90, color: "#10B981", mb: 2 }}
          />

          <Typography variant="h5" fontWeight="bold" mb={1}>
            Pembayaran Berhasil
          </Typography>

          <Typography color="text.secondary" mb={4}>
            Terima kasih, pembayaran Anda telah kami terima.
          </Typography>

          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate("/siswa")}
            sx={{
              bgcolor: "#047857",
              py: 1.4,
              borderRadius: 3,
              fontWeight: "bold",
              "&:hover": {
                bgcolor: "#065F46",
              },
            }}
          >
            Kembali ke Beranda
          </Button>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
