import React from "react";
<<<<<<< Updated upstream
import { useLocation, useNavigate } from "react-router-dom";

export default function DetailKelas() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Jika user langsung akses URL tanpa memilih kelas
  if (!state?.kelas) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>Data kelas tidak ditemukan</h2>
        <button onClick={() => navigate("/siswa/kelas")}>Kembali</button>
      </div>
    );
  }

  const kelas = state.kelas; // kelas yang dipilih user

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>{kelas.nama}</h1>

        <p style={styles.desc}>
          Kelas ini dirancang untuk pemula yang ingin
          memperbaiki bacaan Al-Quran dengan metode Yanbu'a
        </p>

        <div style={styles.infoBox}>
          <div style={styles.infoItem}>Pengajar : Ustadzah Ulul Azmi</div>
          <div style={styles.infoItem}>
            Jadwal Kelas : Senin & Rabu, 19.00 – 20.30 WIB
          </div>
          <div style={styles.infoItem}>
            Lokasi : (offline) Kahfi Education, Denpasar
          </div>
          <div style={styles.infoItem}>Tanggal Mulai : 15 Juni 2025</div>
          <div style={styles.infoItem}>
            Kuota : 20 siswa, terdaftar : 15 siswa
          </div>
        </div>

        <div style={styles.buttonWrapper}>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            Back
          </button>

          <button
            style={styles.nextBtn}
            onClick={() => navigate("/siswa/kelas/pembayaran", { state: { kelas } })}
          >
            Daftar
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f7fdfb",
  },
  card: {
    width: "75%",
    background: "#fff",
    borderRadius: 20,
    padding: 40,
    border: "3px solid #d9d9d9",
    textAlign: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  desc: {
    fontSize: 15,
    color: "#444",
    marginTop: 10,
    marginBottom: 30,
  },
  infoBox: {
    border: "2px solid #ccc",
    borderRadius: 15,
    padding: 25,
  },
  infoItem: {
    background: "#f4f4f4",
    padding: 12,
    borderRadius: 15,
    marginBottom: 12,
    fontSize: 16,
    fontWeight: "500",
  },
  buttonWrapper: {
    marginTop: 30,
    display: "flex",
    justifyContent: "center",
    gap: 20,
  },
  backBtn: {
    padding: "10px 25px",
    borderRadius: 25,
    border: "2px solid black",
    background: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
  nextBtn: {
    padding: "10px 30px",
    borderRadius: 25,
    background: "#008b47",
    color: "white",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
=======
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
  const location = useLocation();

  const course = location.state?.course;

  const handleBack = () => {
    navigate("/siswa/kelas");
  };

  if (!course) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" mb={2}>
          Data kelas tidak ditemukan
        </Typography>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#F5F5F5", minHeight: "100vh", pb: 4 }}>
      <Container maxWidth="md" sx={{ pt: 4 }}>
        <IconButton
          onClick={handleBack}
          sx={{
            mb: 3,
            backgroundColor: "white",
            border: "1px solid #E0E0E0"
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h5" fontWeight="bold" mb={4}>
          {course.title}
        </Typography>

        <Card
          sx={{
            borderRadius: 3,
            border: "1px solid #E0E0E0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="body2" color="text.secondary" mb={0.5}>
              2025, Periode ganjil
            </Typography>

            <Box sx={{ display: "flex", gap: 1, mb: 4 }}>
              <Typography variant="body2" fontWeight="600">
                {course.kelas}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Aktif
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Progress Absen */}
              <ProgressItem
                icon={<CheckCircleIcon sx={{ color: "#10B981" }} />}
                label="Progress absen"
                value={50}
              />

              {/* Progress Tugas */}
              <ProgressItem
                icon={<AssignmentIcon sx={{ color: "#10B981" }} />}
                label="Progress tugas"
                value={50}
              />

              {/* Progress Hafalan */}
              <ProgressItem
                icon={<MenuBookIcon sx={{ color: "#10B981" }} />}
                label="Progress hafalan"
                value={50}
              />

              {/* Grade */}
              <Box
                sx={{
                  border: "1px solid #E0E0E0",
                  borderRadius: 2,
                  p: 2.5
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <GradeIcon sx={{ color: "#10B981" }} />
                    <Typography fontWeight="500">Grade</Typography>
                  </Box>
                  <Typography fontWeight="bold">A (85)</Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>

      <Box
        sx={{
          backgroundColor: "#A7F3D0",
          textAlign: "center",
          py: 2,
          mt: 6
        }}
      >
        <Typography variant="caption" color="text.secondary">
          © 2025 Kahfi Education. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}

function ProgressItem({ icon, label, value }) {
  return (
    <Box
      sx={{
        border: "1px solid #E0E0E0",
        borderRadius: 2,
        p: 2.5
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {icon}
          <Typography fontWeight="500">{label}</Typography>
        </Box>
        <Typography fontWeight="bold">{value}%</Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: 8,
          borderRadius: 1,
          backgroundColor: "#E5E7EB",
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#10B981"
          }
        }}
      />
    </Box>
  );
}
>>>>>>> Stashed changes
