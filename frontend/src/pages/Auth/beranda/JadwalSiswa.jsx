import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Divider,
  Chip,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

export default function JadwalSiswa() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const namaBulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  const hari = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Ming"];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDay = new Date(currentYear, currentMonth, 1).getDay();
  const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;

  const tanggalLengkap = selectedDate.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else setCurrentMonth(currentMonth - 1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else setCurrentMonth(currentMonth + 1);
  };

  return (
    <Box bgcolor="#F9FAFB" minHeight="100vh">
      {/* ===== BG HEADER ===== */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #047857, #34D399)",
          pt: 3,
          pb: 14,
          borderRadius: "0 0 48px 48px",
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight="bold" color="white">
            Jadwal Siswa
          </Typography>
          <Typography color="#ECFDF5">
            Lihat jadwal kelas dan kegiatan belajar
          </Typography>
        </Container>
      </Box>

      {/* ===== CONTENT ===== */}
      <Container maxWidth="lg" sx={{ mt: "-100px", mb: 6 }}>
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 4,
            border: "2px solid #D1FAE5",
            boxShadow: "0 18px 45px rgba(0,0,0,0.18)",
            overflow: "hidden",
          }}
        >
          {/* HEADER CARD */}
          <Box sx={{ p: 3, backgroundColor: "#ECFDF5" }}>
            <Typography variant="h6" fontWeight="bold" color="#047857">
              Kalender & Detail Jadwal
            </Typography>
          </Box>

          <Divider />

          {/* MAIN CONTENT */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.4fr 1fr" },
              gap: 3,
              p: 3,
            }}
          >
            {/* ================= KALENDER ================= */}
            <Box
              sx={{
                backgroundColor: "#F0FDF4",
                borderRadius: 4,
                p: 3,
                boxShadow: "0 10px 30px rgba(0,0,0,.15)",
              }}
            >
              {/* BULAN NAV */}
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={2}
                mb={3}
              >
                <IconButton
                  onClick={handlePrevMonth}
                  sx={{
                    bgcolor: "#047857",
                    color: "white",
                    "&:hover": { bgcolor: "#065F46" },
                  }}
                >
                  <ArrowBack />
                </IconButton>

                <Typography
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 999,
                    backgroundColor: "#047857",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {namaBulan[currentMonth]} {currentYear}
                </Typography>

                <IconButton
                  onClick={handleNextMonth}
                  sx={{
                    bgcolor: "#047857",
                    color: "white",
                    "&:hover": { bgcolor: "#065F46" },
                  }}
                >
                  <ArrowForward />
                </IconButton>
              </Box>

              {/* HARI */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7,1fr)",
                  textAlign: "center",
                  mb: 1,
                }}
              >
                {hari.map((d) => (
                  <Typography key={d} fontWeight={600} fontSize={14}>
                    {d}
                  </Typography>
                ))}
              </Box>

              {/* TANGGAL */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7,1fr)",
                  gap: 1.5,
                  mt: 2,
                }}
              >
                {Array.from({ length: adjustedStartDay }).map((_, i) => (
                  <Box key={i} />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dateObj = new Date(currentYear, currentMonth, i + 1);
                  const isSelected =
                    dateObj.toDateString() === selectedDate.toDateString();

                  return (
                    <Box
                      key={i}
                      onClick={() => setSelectedDate(dateObj)}
                      sx={{
                        width: 46,
                        height: 46,
                        mx: "auto",
                        borderRadius: "50%",
                        bgcolor: isSelected ? "#047857" : "transparent",
                        color: isSelected ? "white" : "#111",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontWeight: "bold",
                        transition: "0.25s",
                        "&:hover": {
                          bgcolor: isSelected ? "#065F46" : "#D1FAE5",
                        },
                      }}
                    >
                      {i + 1}
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* ================= DETAIL JADWAL ================= */}
            <Box
              sx={{
                backgroundColor: "#ECFDF5",
                borderRadius: 4,
                p: 3,
                boxShadow: "0 10px 30px rgba(0,0,0,.15)",
              }}
            >
              <Typography fontWeight="bold" mb={2}>
                Detail Jadwal
              </Typography>

              <Box mb={2}>
                <Typography fontSize={13} color="text.secondary">
                  Waktu Mulai
                </Typography>
                <Chip label="15 Jan 2025 • 09.00" color="success" />
              </Box>

              <Box mb={2}>
                <Typography fontSize={13} color="text.secondary">
                  Waktu Selesai
                </Typography>
                <Chip label="15 Jan 2025 • 11.00" color="success" />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography fontSize={13} color="text.secondary" mb={1}>
                Keterangan
              </Typography>
              <Typography lineHeight={1.6}>
                Kelas Tahfidz  
                <br />
                Setoran Juz 11 – Juz 12
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* FOOTER */}
          <Box sx={{ p: 2, backgroundColor: "#F0FDF4" }}>
            <Typography fontWeight="bold" color="#047857">
              {tanggalLengkap}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
