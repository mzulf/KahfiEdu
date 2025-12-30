import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Container,
  IconButton
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import GradeIcon from "@mui/icons-material/Grade";

export default function DetailKelas() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const kelas = state?.kelas;

  if (!kelas) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography mb={2}>Data kelas tidak ditemukan</Typography>
        <IconButton onClick={() => navigate("/siswa/kelas")}>
          <ArrowBackIcon />
        </IconButton>
      </Box>
    );
  }

  // 🔧 Default progress (nanti bisa dari API)
  const progress = {
    absen: 50,
    tugas: 50,
    hafalan: 50,
    score: 85,
    grade: "A"
  };

  return (
    <Box sx={{ backgroundColor: "#F7F7F7", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        {/* Back */}
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            mb: 3,
            border: "1px solid #D1D5DB",
            backgroundColor: "white"
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        {/* Title */}
        <Typography fontSize={22} fontWeight="bold" mb={3}>
          {kelas.title}
        </Typography>

        {/* Main Card */}
        <Card
          sx={{
            borderRadius: 3,
            border: "1px solid #D1D5DB"
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Info */}
            <Typography fontSize={14} color="text.secondary" mb={1}>
              2025, Periode ganjil
            </Typography>

            <Typography fontSize={14} mb={3}>
              {kelas.kelas} •{" "}
              <Box component="span" sx={{ color: "#16A34A", fontWeight: 500 }}>
                Aktif
              </Box>
            </Typography>

            {/* Progress */}
            <ProgressItem
              icon={<CheckCircleIcon sx={{ color: "#16A34A" }} />}
              label="Progress absen"
              value={progress.absen}
            />

            <ProgressItem
              icon={<AssignmentIcon sx={{ color: "#16A34A" }} />}
              label="Progress tugas"
              value={progress.tugas}
            />

            <ProgressItem
              icon={<MenuBookIcon sx={{ color: "#16A34A" }} />}
              label="Progress hafalan"
              value={progress.hafalan}
            />

            {/* Grade */}
            <Box
              sx={{
                border: "1px solid #D1D5DB",
                borderRadius: 2,
                px: 3,
                py: 2.5,
                mt: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <GradeIcon sx={{ color: "#16A34A" }} />
                <Typography fontWeight={500}>Grade</Typography>
              </Box>

              <Typography fontWeight="bold">
                Score: {progress.score} &nbsp; Grade: {progress.grade}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

/* ===================== */
/* Reusable Progress Row */
/* ===================== */
function ProgressItem({ icon, label, value }) {
  return (
    <Box
      sx={{
        border: "1px solid #D1D5DB",
        borderRadius: 2,
        px: 3,
        py: 2,
        mb: 2
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {icon}
          <Typography fontSize={14}>{label}</Typography>
        </Box>
        <Typography fontSize={14} fontWeight="bold">
          {value}%
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: 6,
          borderRadius: 5,
          backgroundColor: "#DCFCE7",
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#16A34A",
            borderRadius: 5
          }
        }}
      />
    </Box>
  );
}
