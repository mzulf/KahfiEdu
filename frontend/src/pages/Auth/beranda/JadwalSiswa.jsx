import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Divider,
  TextField,
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

  // Jumlah hari di bulan
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Hari pertama jatuh pada hari apa?
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
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 5 }}>
      <Box
        sx={{
          border: "2px solid #C7C7C7",
          borderRadius: 3,
          overflow: "hidden",
          background: "white",
        }}
      >
        {/* HEADER */}
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", fontSize: "1.6rem" }}
          >
            Jadwal - Kalender
          </Typography>
        </Box>

        <Divider />

        {/* MAIN GRID */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.3fr 1fr" },
            p: 3,
            gap: 3,
          }}
        >
          {/* ---- KALENDER ---- */}
          <Box>
            {/* BULAN NAV */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                mb: 2,
              }}
            >
              <IconButton
                onClick={handlePrevMonth}
                sx={{
                  backgroundColor: "#C4F5C9",
                  width: 40,
                  height: 40,
                  borderRadius: 5,
                }}
              >
                <ArrowBack />
              </IconButton>

              <Typography
                sx={{
                  backgroundColor: "#C4F5C9",
                  px: 3,
                  py: 1,
                  borderRadius: 5,
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
              >
                {namaBulan[currentMonth]} {currentYear}
              </Typography>

              <IconButton
                onClick={handleNextMonth}
                sx={{
                  backgroundColor: "#C4F5C9",
                  width: 40,
                  height: 40,
                  borderRadius: 5,
                }}
              >
                <ArrowForward />
              </IconButton>
            </Box>

            {/* HARI */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                textAlign: "center",
                mb: 1,
              }}
            >
              {hari.map((d) => (
                <Typography key={d} sx={{ fontWeight: "bold" }}>
                  {d}
                </Typography>
              ))}
            </Box>

            {/* TANGGAL */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 1.5,
                mt: 2,
              }}
            >
              {/* Space sebelum tanggal 1 */}
              {Array.from({ length: adjustedStartDay }).map((_, i) => (
                <Box key={i}></Box>
              ))}

              {/* Tanggal */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dateObj = new Date(currentYear, currentMonth, i + 1);
                const isSelected =
                  dateObj.toDateString() === selectedDate.toDateString();

                return (
                  <Box
                    key={i}
                    onClick={() => setSelectedDate(dateObj)}
                    sx={{
                      width: "45px",
                      height: "45px",
                      margin: "0 auto",
                      borderRadius: "50%",
                      backgroundColor: isSelected ? "#9BE7AF" : "transparent",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      fontWeight: "bold",
                      transition: "0.3s",
                      "&:hover": {
                        backgroundColor: "#BFF3CB",
                      },
                    }}
                  >
                    {i + 1}
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* ---- DETAIL JADWAL ---- */}
          <Box
            sx={{
              borderLeft: { md: "2px solid #C7C7C7" },
              pl: { md: 3 },
              pt: { xs: 2, md: 0 },
            }}
          >
            <Typography sx={{ fontWeight: "bold", mb: 1 }}>
              Waktu Mulai
            </Typography>

            <Box
              sx={{
                border: "1.5px solid #888",
                borderRadius: 3,
                display: "flex",
                justifyContent: "space-between",
                p: 1.2,
                mb: 3,
              }}
            >
              <Typography>2025-01-15</Typography>
              <Typography>09.00 Am</Typography>
            </Box>

            <Typography sx={{ fontWeight: "bold", mb: 1 }}>
              Waktu Selesai
            </Typography>

            <Box
              sx={{
                border: "1.5px solid #888",
                borderRadius: 3,
                display: "flex",
                justifyContent: "space-between",
                p: 1.2,
                mb: 3,
              }}
            >
              <Typography>2025-01-15</Typography>
              <Typography>11.00 Am</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ fontWeight: "bold", mb: 1 }}>
              Keterangan:
            </Typography>

            <Typography sx={{ lineHeight: 1.6 }}>
              Kelas Tahfidz, setoran 2 Juz.  
              Juz 11 – Juz 12
            </Typography>
          </Box>
        </Box>

        <Divider />

        {/* FOOTER TANGGAL */}
        <Box sx={{ p: 2 }}>
          <Typography sx={{ fontWeight: "bold" }}>{tanggalLengkap}</Typography>
        </Box>
      </Box>

      
    </Container>
  );
}
