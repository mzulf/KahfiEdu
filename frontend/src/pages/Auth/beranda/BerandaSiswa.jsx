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
  TextField,
  IconButton
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
    { nama: "Tugas Menulis", persen: 45, waktu: "Hari ini • 12:41" },
    { nama: "Tugas Belajar", persen: 100, waktu: "Kemarin • 10:00" },
    { nama: "Tugas Hafalan", persen: 100, waktu: "Jumat • 18:00" },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 7, mb: 4 }}>

      {/* HEADER */}
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
        Selamat Pagi,
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        Nama
      </Typography>

      {/* KALENDER */}
      <Box
        sx={{
          mt: 5,
          p: 3,
          borderRadius: 3,
          border: "1.5px solid #BEBEBE",
          bgcolor: "white",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>
          Kalender Per Minggu
        </Typography>

        <Typography sx={{ textAlign: "center", color: "gray" }}>
          {namaBulan}
        </Typography>

        {/* KALENDER */}
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            overflowX: "auto",
            paddingBottom: "10px",
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => {
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
                  height: 135,
                  borderRadius: 3,
                  p: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  bgcolor: isSelected ? "#008B47" : "#C4F2D4",
                  color: isSelected ? "white" : "black",
                  transition: "0.3s",
                  flexShrink: 0,
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

      {/* TUGAS + JADWAL */}
      <Box
        sx={{
          mt: 5,
          display: "flex",
          gap: 3,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* BOX TUGAS */}
        <Box
          sx={{
            flex: 2,
            p: 3,
            borderRadius: 3,
            background: "#C4F2D4",
            border: "1.5px solid #BEBEBE",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Tugas
          </Typography>

          {progressList.map((item, i) => (
            <Box key={i} sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: "bold" }}>{item.nama}</Typography>

              {/* Progress + Persen */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={item.persen}
                  sx={{
                    flex: 1,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: "#E8FFE9",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#008B47",
                    },
                  }}
                />

                <Typography sx={{ fontWeight: "bold", width: 40, textAlign: "right" }}>
                  {item.persen}%
                </Typography>
              </Box>

              <Typography sx={{ fontSize: 14, mt: 1 }}>
                {item.waktu}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* BOX JADWAL */}
        <Box
          sx={{
            flex: 1,
            p: 3,
            borderRadius: 3,
            background: "#C2F5FF",
            border: "1.5px solid #BEBEBE",
            height: "fit-content",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Jadwal Hari Ini
          </Typography>

          <Typography sx={{ fontSize: 15, mb: 1 }}>Today • {tanggalLengkap}</Typography>

          <Typography sx={{ fontWeight: "bold", fontSize: 20, mb: 3 }}>
            Tahfidz Juz 1
          </Typography>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#008B47",
              fontWeight: "bold",
              width: "100%",
              borderRadius: "30px",
              py: 1.3,
              "&:hover": { backgroundColor: "#006633" },
            }}
            onClick={() => setOpenAbsensi(true)}
          >
            Attend
          </Button>
        </Box>
      </Box>

      {/* POPUP ABSENSI */}
      <Dialog open={openAbsensi} onClose={() => setOpenAbsensi(false)} fullWidth maxWidth="md">
        <DialogContent>

          {/* BACK */}
          <IconButton onClick={() => setOpenAbsensi(false)}>
            <ArrowBackIcon />
          </IconButton>

          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            Jadwal Hari Ini
          </Typography>

          <Typography sx={{ fontSize: 22, fontWeight: "bold" }}>
            Kelas Tahfidz Juz 1
          </Typography>

          <Typography sx={{ mb: 3 }}>Nama guru: Ustadzah</Typography>

          {/* TAB */}
          <Tabs
            value={tabValue}
            onChange={(e, v) => setTabValue(v)}
            centered
            sx={{ mb: 3 }}
          >
            <Tab label="Izin" />
            <Tab label="Sakit" />
            <Tab label="Hadir" />
          </Tabs>

          {/* IZIN */}
          {tabValue === 0 && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <TextField
                multiline
                rows={3}
                placeholder="Berikan alasan izin"
                fullWidth
                sx={{ maxWidth: 400 }}
              />
            </Box>
          )}

          {/* SAKIT */}
          {tabValue === 1 && (
            <Box sx={{ textAlign: "center" }}>
              <Button
                variant="outlined"
                component="label"
                sx={{ p: 3, borderRadius: 3 }}
              >
                Upload bukti surat dokter
                <input hidden type="file" />
              </Button>
            </Box>
          )}

          {/* HADIR */}
          {tabValue === 2 && (
            <Box sx={{ textAlign: "center" }}>
              <QRCodeCanvas value="ABSEN_TAHFIDZ_1" size={200} />
              <Typography sx={{ mt: 1 }}>Scan untuk hadir</Typography>
            </Box>
          )}

          {/* TOMBOL KIRIM — ADA SEKARANG */}
          <Box sx={{ textAlign: "center", mt: 4, mb: 2 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#008B47",
                fontWeight: "bold",
                px: 5,
                py: 1.5,
                borderRadius: "25px",
                "&:hover": { backgroundColor: "#006633" }
              }}
              onClick={() => {
                console.log("Absensi terkirim");
                setOpenAbsensi(false);
              }}
            >
              Kirim
            </Button>
          </Box>

        </DialogContent>
      </Dialog>

    </Container>
  );
}
