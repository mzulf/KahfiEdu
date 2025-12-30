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
  IconButton,
  Chip,
  Fade
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";

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
  const [alasanIzin, setAlasanIzin] = useState("");
  const [fileSakit, setFileSakit] = useState(null);
  const [jamSekarang, setJamSekarang] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setJamSekarang(
        new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const progressList = [
    { nama: "Tugas Menulis", persen: 45, waktu: "Hari ini • 12:41" },
    { nama: "Tugas Belajar", persen: 100, waktu: "Kemarin • 10:00" },
    { nama: "Tugas Hafalan", persen: 0, waktu: "Jumat • 18:00" },
  ];

  const getStatus = (persen) => {
    if (persen === 0) return { label: "Belum Mulai", color: "default" };
    if (persen < 100) return { label: "Dalam Proses", color: "warning" };
    return { label: "Selesai", color: "success" };
  };

  const isSubmitDisabled = () => {
    if (tabValue === 0) return alasanIzin.trim() === "";
    if (tabValue === 1) return !fileSakit;
    return false;
  };

  return (
    <Box bgcolor="#F9FAFB" minHeight="100vh">
      {/* ===== BG HEADER ===== */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #047857, #34D399)",
          pt: 3,
          pb: 8,
          borderRadius: "0 0 48px 48px",
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="h4" fontWeight="bold" color="white">
            Selamat Datang,
          </Typography>
          <Typography variant="h5" fontWeight="bold" color="#ECFDF5">
            Siswa Kahfi
          </Typography>
        </Container>
      </Box>

      {/* ===== CONTENT ===== */}
      <Container maxWidth="xl" sx={{ mt: "-90px", mb: 5 }}>
        {/* KALENDER */}
        <Box
          sx={{
            mt: 5,
            p: 4,
            borderRadius: 4,
            bgcolor: "white",
            border: "2px solid #A7F3D0",
            boxShadow: "0 12px 32px rgba(0,0,0,.18)",
          }}
        >
          <Typography variant="h5" fontWeight="bold" textAlign="center">
            Kalender Per Minggu
          </Typography>
          <Typography textAlign="center" color="text.secondary">
            {namaBulan}
          </Typography>

          <Box
            sx={{
              mt: 4,
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(3, 1fr)",
                sm: "repeat(4, 1fr)",
                md: "repeat(6, 1fr)",
              },
              gap: 2.5,
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => {
              const date = new Date();
              date.setDate(tanggalHariIni + i);

              const namaHari = date.toLocaleDateString("id-ID", {
                weekday: "short",
              });
              const tanggal = date.getDate();
              const isSelected = selectedIndex === i;

              return (
                <Box
                  key={i}
                  onClick={() => setSelectedIndex(i)}
                  sx={{
                    cursor: "pointer",
                    height: 120,
                    borderRadius: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: isSelected ? "#047857" : "#ECFDF5",
                    color: isSelected ? "white" : "#064E3B",
                    boxShadow: isSelected
                      ? "0 10px 28px rgba(4,120,87,.45)"
                      : "0 6px 18px rgba(0,0,0,.15)",
                    transition: ".25s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <Typography fontWeight="bold">{namaHari}</Typography>
                  <Typography fontSize={34} fontWeight="bold">
                    {tanggal}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* TUGAS & JADWAL */}
        <Box
          mt={5}
          display="flex"
          gap={3}
          flexDirection={{ xs: "column", md: "row" }}
        >
          {/* TUGAS */}
          <Box
            flex={2}
            p={3}
            borderRadius={4}
            bgcolor="#ECFDF5"
            border="2px solid #A7F3D0"
            boxShadow="0 10px 26px rgba(0,0,0,.18)"
          >
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Tugas
            </Typography>

            {progressList.map((item, i) => {
              const status = getStatus(item.persen);
              return (
                <Box
                  key={i}
                  p={2.5}
                  mb={2}
                  bgcolor="white"
                  borderRadius={3}
                  boxShadow="0 6px 16px rgba(0,0,0,.15)"
                >
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontWeight="bold">{item.nama}</Typography>
                    <Chip size="small" label={status.label} color={status.color} />
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={item.persen}
                    sx={{
                      mt: 1,
                      height: 8,
                      borderRadius: 5,
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#047857",
                      },
                    }}
                  />

                  <Typography fontSize={13} color="text.secondary" mt={1}>
                    {item.waktu}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          {/* JADWAL */}
          <Box
            flex={1}
            p={2.5}
            borderRadius={4}
            bgcolor="#E0F2FE"
            border="2px solid #7DD3FC"
            boxShadow="0 8px 22px rgba(0,0,0,.16)"
            alignSelf="flex-start"
          >
            <Typography variant="h6" fontWeight="bold">
              Jadwal Hari Ini
            </Typography>

            <Typography fontSize={14} color="text.secondary" mb={1}>
              Today • {tanggalLengkap}
            </Typography>

            <Typography fontSize={18} fontWeight="bold" mb={2}>
              Tahfidz Juz 1
            </Typography>

            <Button
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "#047857",
                fontWeight: "bold",
                borderRadius: "999px",
                py: 1.2,
                fontSize: 14,
              }}
              onClick={() => setOpenAbsensi(true)}
            >
              Attend
            </Button>
          </Box>
        </Box>
      </Container>

      {/* POPUP ABSENSI (TETAP) */}
      <Dialog
        open={openAbsensi}
        fullWidth
        maxWidth="md"
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0 22px 60px rgba(0,0,0,.35)",
          },
        }}
      >
        <DialogContent>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <IconButton onClick={() => setOpenAbsensi(false)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" fontWeight="bold">
              Absensi Kelas
            </Typography>
          </Box>

          <Typography fontWeight="bold" fontSize={20}>
            Tahfidz Juz 1
          </Typography>
          <Typography color="text.secondary">
            {tanggalLengkap} • {jamSekarang}
          </Typography>

          <Tabs
            centered
            value={tabValue}
            onChange={(e, v) => setTabValue(v)}
            sx={{
              my: 3,
              "& .Mui-selected": { color: "#047857" },
              "& .MuiTabs-indicator": {
                height: 4,
                borderRadius: 2,
                backgroundColor: "#047857",
              },
            }}
          >
            <Tab label="Izin" />
            <Tab label="Sakit" />
            <Tab label="Hadir" />
          </Tabs>

          {tabValue === 0 && (
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Tuliskan alasan izin..."
              value={alasanIzin}
              onChange={(e) => setAlasanIzin(e.target.value)}
            />
          )}

          {tabValue === 1 && (
            <Box textAlign="center">
              <Button component="label" variant="outlined" sx={{ p: 3 }}>
                Upload Surat Dokter
                <input hidden type="file" />
              </Button>
            </Box>
          )}

          {tabValue === 2 && (
            <Box textAlign="center">
              <QRCodeCanvas value="ABSEN_TAHFIDZ_1" size={220} />
            </Box>
          )}

          <Box textAlign="center" mt={4}>
            <Button
              variant="contained"
              disabled={isSubmitDisabled()}
              sx={{
                backgroundColor: "#047857",
                fontWeight: "bold",
                px: 6,
                py: 1.4,
                borderRadius: "30px",
              }}
            >
              Kirim
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
