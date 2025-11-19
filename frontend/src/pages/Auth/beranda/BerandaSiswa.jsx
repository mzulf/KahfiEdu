import {
  Container,
  Typography,
  Box,
  LinearProgress,
  Button,
  Dialog,
  DialogContent,
  Tabs,
  Tab,
  TextField
} from "@mui/material";

import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";

export default function BerandaSiswa() {
  const today = new Date();
  const tanggalHariIni = today.getDate();

  const namaBulan = today.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  const tanggalLengkap = today.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [openAbsensi, setOpenAbsensi] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const progressList = [
    { nama: "Tugas Menulis", persen: 70, waktu: "Hari ini" },
    { nama: "Tugas Belajar", persen: 40, waktu: "Besok" },
    { nama: "Tugas Mengaji", persen: 85, waktu: "Senin" },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 7, mb: 4 }}>

      {/* HEADER */}
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
        Selamat Pagi,
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        Siswa Kahfi
      </Typography>

      {/* KALENDER */}
      <Box
        sx={{
          mt: 5,
          p: 3,
          borderRadius: 2,
          border: "2px solid #ccc",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", textAlign: "center" }}
        >
          Kalender Per Minggu
        </Typography>

        <Typography sx={{ textAlign: "center", color: "gray" }}>
          {namaBulan}
        </Typography>

        {/* KALENDER RAPIH & LEBIH BESAR */}
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            overflowX: { xs: "auto", md: "hidden" },
            pb: 1,
            height: 170
          }}
        >
          {Array.from({ length: 7 }).map((_, i) => {
            const date = new Date();
            date.setDate(tanggalHariIni + i);

            const namaHari = date.toLocaleDateString("id-ID", { weekday: "short" });
            const tanggal = date.getDate();
            const isSelected = i === selectedIndex;

            return (
              <Box
                key={i}
                onClick={() => setSelectedIndex(i)}
                sx={{
                  cursor: "pointer",
                  width: 110,
                  height: "100%",
                  borderRadius: 2,
                  p: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  bgcolor: isSelected ? "#008B47" : "#C4F2D4",
                  color: isSelected ? "white" : "black",
                  transition: "0.3s",
                  flexShrink: 0,
                  boxShadow: isSelected ? "0 4px 10px rgba(0,0,0,0.2)" : "",
                }}
              >
                <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                  {namaHari}
                </Typography>

                <Typography sx={{ fontSize: 36, fontWeight: "bold" }}>
                  {tanggal}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* 2 KOLOM */}
      <Box sx={{ mt: 5, display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" } }}>
        
        {/* BOX PROGRESS — GRADIENT & ADA PERSEN */}
        <Box
          sx={{
            flex: 2,
            p: 3,
            borderRadius: 2,
            border: "2px solid #ccc",
            background: "linear-gradient(135deg, #B3F7C3 0%, #5AD68C 100%)",
            boxShadow: "0 4px 8px rgba(0,0,0,0.15)"
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Progress Tugas
          </Typography>

          {progressList.map((item, i) => (
            <Box key={i} sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontWeight: "bold" }}>{item.nama}</Typography>
                <Typography sx={{ fontWeight: "bold" }}>{item.persen}%</Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={item.persen}
                sx={{
                  height: 12,
                  borderRadius: 5,
                  my: 1,
                  backgroundColor: "#E8FFE9",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#008B47"
                  }
                }}
              />

              <Typography sx={{ fontSize: 14, color: "white", fontWeight: "bold" }}>
                {item.waktu}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* BOX JADWAL HARI INI — GRADIENT, DIPERKECIL */}
        <Box
          sx={{
            flex: 1,
            p: 3,
            borderRadius: 2,
            background: "linear-gradient(135deg, #E2FDEB 0%, #8BE2A5 100%)",
            border: "2px solid #ccc",
            height: "fit-content",
            boxShadow: "0 4px 8px rgba(0,0,0,0.15)"
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Jadwal Hari Ini
          </Typography>

          <Typography sx={{ color: "green", mb: 1 }}>{tanggalLengkap}</Typography>

          <Typography sx={{ fontWeight: "bold", fontSize: 18, mb: 2 }}>
            Tahfidz Juz 1
          </Typography>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#008B47",
              fontWeight: "bold",
              width: "100%",
              "&:hover": { backgroundColor: "#006633" }
            }}
            onClick={() => setOpenAbsensi(true)}
          >
            Attend
          </Button>
        </Box>
      </Box>

      {/* POPUP ABSENSI */}
      <Dialog open={openAbsensi} onClose={() => setOpenAbsensi(false)} fullWidth maxWidth="sm">
        <DialogContent>
          <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center", mb: 1 }}>
            Absensi Kelas
          </Typography>

          <Typography sx={{ textAlign: "center", fontWeight: "bold" }}>
            Kelas Tahfidz 1
          </Typography>

          <Typography sx={{ textAlign: "center", color: "gray", mb: 2 }}>
            Nama Guru: Ustadzah Mawaddah
          </Typography>

          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} centered sx={{ mb: 2 }}>
            <Tab label="Hadir" />
            <Tab label="Izin" />
            <Tab label="Sakit" />
          </Tabs>

          {/* HADIR */}
          {tabValue === 0 && (
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography sx={{ mb: 1, fontWeight: "bold" }}>Scan QR untuk Hadir</Typography>
              <QRCodeCanvas value="ABSEN_TAHFIDZ_1" size={200} />
            </Box>
          )}

          {/* IZIN */}
          {tabValue === 1 && (
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ fontWeight: "bold", mb: 1 }}>Alasan Izin:</Typography>
              <TextField fullWidth multiline rows={3} placeholder="Tulis alasan izin..." />
            </Box>
          )}

          {/* SAKIT */}
          {tabValue === 2 && (
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ fontWeight: "bold", mb: 1 }}>Upload Surat Dokter:</Typography>
              <Button variant="outlined" component="label" fullWidth>
                Upload File
                <input type="file" hidden />
              </Button>
            </Box>
          )}

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#008B47",
                "&:hover": { backgroundColor: "#006633" }
              }}
              onClick={() => setOpenAbsensi(false)}
            >
              Kirim
            </Button>
          </Box>

        </DialogContent>
      </Dialog>

    </Container>
  );
}
