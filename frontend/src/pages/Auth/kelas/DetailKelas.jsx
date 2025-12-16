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
        <Typography variant="h6" mb={2}>
          Data kelas tidak ditemukan
        </Typography>
        <IconButton onClick={() => navigate("/siswa/kelas")}>
          <ArrowBackIcon />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#F5F5F5", minHeight: "100vh", pb: 4 }}>
      <Container maxWidth="md" sx={{ pt: 4 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ mb: 3, backgroundColor: "white", border: "1px solid #E0E0E0" }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h5" fontWeight="bold" mb={4}>
          {kelas.nama}
        </Typography>

        <Card sx={{ borderRadius: 3, border: "1px solid #E0E0E0" }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              {kelas.level || "Pemula"} • Aktif
            </Typography>

            <ProgressItem icon={<CheckCircleIcon />} label="Progress absen" value={50} />
            <ProgressItem icon={<AssignmentIcon />} label="Progress tugas" value={50} />
            <ProgressItem icon={<MenuBookIcon />} label="Progress hafalan" value={50} />

            <Box sx={{ border: "1px solid #E0E0E0", borderRadius: 2, p: 2.5, mt: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <GradeIcon color="success" />
                  <Typography fontWeight="500">Grade</Typography>
                </Box>
                <Typography fontWeight="bold">A</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

function ProgressItem({ icon, label, value }) {
  return (
    <Box sx={{ border: "1px solid #E0E0E0", borderRadius: 2, p: 2.5, mb: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          {icon}
          <Typography>{label}</Typography>
        </Box>
        <Typography fontWeight="bold">{value}%</Typography>
      </Box>
      <LinearProgress variant="determinate" value={value} />
    </Box>
  );
}
