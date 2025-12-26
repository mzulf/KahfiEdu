// src/pages/Auth/kelas/KelasSiswa.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Container,
} from "@mui/material";
import BookIcon from "@mui/icons-material/Book";
import ClassIcon from "@mui/icons-material/Class";

export default function KelasSiswa() {
  const navigate = useNavigate();
  const [periode, setPeriode] = useState("2025, Periode ganjil");

  const courses = [
    {
      id: 1,
      title: "Tahfidh (kelas membaca)",
      idKelas: "TMJF123260",
      kelas: "Kelas A",
      periode: "2025, Periode ganjil",
      status: "Aktif",
      metode: "Zoom meeting (online)",
      progress: 95,
      progressLabel: "Sudah Hifadzing",
    },
    {
      id: 2,
      title: "Tahfidh (kelas menghafal)",
      idKelas: "TMJF123261",
      kelas: "Kelas A",
      periode: "2025, Periode ganjil",
      status: "Aktif",
      metode: "Zoom meeting (online)",
      progress: 67,
      progressLabel: "Sudah Hifadzing",
    },
    {
      id: 3,
      title: "Tahfidh (kelas menulis)",
      idKelas: "TMJF123262",
      kelas: "Kelas A",
      periode: "2025, Periode ganjil",
      status: "Aktif",
      metode: "Zoom meeting (online)",
      progress: 45,
      progressLabel: "Sudah Hifadzing",
    },
    {
      id: 4,
      title: "Tahfidh (kelas 1 day 1 sheet)",
      idKelas: "TMJF123263",
      kelas: "Kelas A",
      periode: "2025, Periode ganjil",
      status: "Aktif",
      metode: "Zoom meeting (online)",
      progress: 92,
      progressLabel: "Sudah Hifadzing",
    },
  ];

  const handleCourseClick = (kelas) => {
    navigate("/siswa/kelas/detail", { state: { kelas } });
  };

  const handleDaftarProgram = () => {
    navigate("/siswa/kelas/pilih-program");
  };

  return (
    <Box minHeight="100vh" bgcolor="#F9FAFB">
      {/* ================= HEADER ================= */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #047857, #34D399)",
          pt: 5,
          pb: 10,
          borderRadius: "0 0 48px 48px",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h5"
            fontWeight={700}
            color="white"
            textAlign="center"
          >
            My Courses
          </Typography>
        </Container>
      </Box>

      {/* ================= CONTENT ================= */}
      <Container maxWidth="lg" sx={{ mt: "-70px", pb: 6 }}>
        {/* FILTER */}
        <Card
          sx={{
            mb: 4,
            borderRadius: 3,
            boxShadow: "0 18px 40px rgba(0,0,0,0.15)",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary" mb={0.5}>
                Periode
              </Typography>
              <Select
                value={periode}
                onChange={(e) => setPeriode(e.target.value)}
                sx={{
                  bgcolor: "#F9FAFB",
                  borderRadius: 2,
                  minWidth: 240,
                }}
              >
                <MenuItem value="2025, Periode ganjil">
                  2025, Periode ganjil
                </MenuItem>
                <MenuItem value="2025, Periode genap">
                  2025, Periode genap
                </MenuItem>
                <MenuItem value="2024, Periode ganjil">
                  2024, Periode ganjil
                </MenuItem>
              </Select>
            </Box>

            <Button
              onClick={handleDaftarProgram}
              variant="contained"
              sx={{
                bgcolor: "#047857",
                textTransform: "none",
                borderRadius: 3,
                px: 4,
                height: 44,
                fontWeight: 600,
                "&:hover": { bgcolor: "#065F46" },
              }}
            >
              + Daftar Program
            </Button>
          </CardContent>
        </Card>

        {/* ================= CARDS ================= */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
          }}
        >
          {courses.map((kelas) => (
            <Card
              key={kelas.id}
              onClick={() => handleCourseClick(kelas)}
              sx={{
                borderRadius: 3,
                border: "1px solid #E5E7EB",
                cursor: "pointer",
                transition: "all .25s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
                  borderColor: "#A7F3D0",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography fontWeight={700} mb={1.5}>
                  {kelas.title}
                </Typography>

                <InfoRow icon={<BookIcon fontSize="small" />} text={`ID Kelas ${kelas.idKelas}`} />
                <InfoRow icon={<ClassIcon fontSize="small" />} text={kelas.kelas} />

                <Typography variant="caption" color="text.secondary">
                  {kelas.metode}
                </Typography>

                {/* PROGRESS */}
                <Box sx={{ borderTop: "1px solid #E5E7EB", pt: 2, mt: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {kelas.progressLabel}
                    </Typography>
                    <Typography variant="caption" fontWeight={700}>
                      {kelas.progress}%
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={kelas.progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "#E5E7EB",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: "#10B981",
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

/* ================= HELPER ================= */
function InfoRow({ icon, text }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
      {icon}
      <Typography variant="body2" color="text.secondary">
        {text}
      </Typography>
    </Box>
  );
}
