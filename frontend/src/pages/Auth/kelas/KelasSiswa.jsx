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
  Container
} from "@mui/material";
import BookIcon from "@mui/icons-material/Book";
import ClassIcon from "@mui/icons-material/Class";

export default function KelasSiswa() {
  const navigate = useNavigate();
  const [periode, setPeriode] = useState("2025, Periode ganjil");

  // Data courses sesuai gambar
  const courses = [
    {
      id: 1,
      title: "Tahfidh (kelas membaca)",
      idKelas: "ID Kelas TMJF123260",
      kelas: "Kelas A",
      courseType: "Course type",
      status: "Zoom meeting (online)",
      progress: 95,
      progressLabel: "Sudah Hifadzing"
    },
    {
      id: 2,
      title: "Tahfidh (kelas menghafal)",
      idKelas: "ID Kelas TMJF123260",
      kelas: "Kelas A",
      courseType: "Course type",
      status: "Zoom meeting (online)",
      progress: 67,
      progressLabel: "Sudah Hifadzing"
    },
    {
      id: 3,
      title: "Tahfidh (kelas menulis)",
      idKelas: "ID Kelas TMJF123260",
      kelas: "Kelas A",
      courseType: "Course type",
      status: "Zoom meeting (online)",
      progress: 45,
      progressLabel: "Sudah Hifadzing"
    },
    {
      id: 4,
      title: "Tahfidh (kelas 1 day 1 sheet)",
      idKelas: "ID Kelas TMJF123260",
      kelas: "Kelas A",
      courseType: "Course type",
      status: "Zoom meeting (online)",
      progress: 92,
      progressLabel: "Sudah Hifadzing"
    }
  ];

  const handleCourseClick = (course) => {
    navigate("/siswa/kelas/detail", { state: { course } });
  };

  const handleDaftarProgram = () => {
    navigate("/siswa/kelas/pilih-program");
  };

  return (
    <Box sx={{ backgroundColor: "#F5F5F5", minHeight: "100vh", pb: 4 }}>
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        
        {/* Header Section */}
        <Typography variant="h5" fontWeight="bold" mb={2}>
          My Courses
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={1}>
          Periode
        </Typography>

        {/* Periode Selector & Button */}
        <Box sx={{ display: "flex", gap: 2, mb: 4, alignItems: "center" }}>
          <Select
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
              minWidth: 250,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#E0E0E0"
              }
            }}
          >
            <MenuItem value="2025, Periode ganjil">2025, Periode ganjil</MenuItem>
            <MenuItem value="2025, Periode genap">2025, Periode genap</MenuItem>
            <MenuItem value="2024, Periode ganjil">2024, Periode ganjil</MenuItem>
          </Select>

          <Button
            onClick={handleDaftarProgram}
            variant="contained"
            sx={{
              backgroundColor: "#10B981",
              color: "white",
              textTransform: "none",
              borderRadius: 2,
              px: 3,
              "&:hover": {
                backgroundColor: "#059669"
              }
            }}
          >
            Daftar program +
          </Button>
        </Box>

        {/* Course Cards Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3
          }}
        >
          {courses.map((course) => (
            <Card
              key={course.id}
              onClick={() => handleCourseClick(course)}
              sx={{
                borderRadius: 3,
                border: "1px solid #E0E0E0",
                cursor: "pointer",
                transition: "all 0.3s",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  transform: "translateY(-2px)"
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* Course Title */}
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  {course.title}
                </Typography>

                {/* ID Kelas */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <BookIcon sx={{ fontSize: 18, color: "#6B7280" }} />
                  <Typography variant="body2" color="text.secondary">
                    {course.idKelas}
                  </Typography>
                </Box>

                {/* Kelas */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <ClassIcon sx={{ fontSize: 18, color: "#6B7280" }} />
                  <Typography variant="body2" color="text.secondary">
                    {course.kelas}
                  </Typography>
                </Box>

                {/* Course Type */}
                <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                  {course.courseType}
                </Typography>

                {/* Status */}
                <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                  {course.status}
                </Typography>

                {/* Progress Bar */}
                <Box sx={{ borderTop: "1px solid #E0E0E0", pt: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      {course.progressLabel}
                    </Typography>
                    <Typography variant="caption" fontWeight="bold">
                      {course.progress}%
                    </Typography>
                  </Box>
                  
                  <LinearProgress
                    variant="determinate"
                    value={course.progress}
                    sx={{
                      height: 8,
                      borderRadius: 1,
                      backgroundColor: "#E5E7EB",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#10B981",
                        borderRadius: 1
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

      </Container>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: "#A7F3D0",
          textAlign: "center",
          py: 2,
          mt: 6
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Copyright © 2025 Kahfi Education, All rights Reserved | Bug report to Phone: +6289987167784
        </Typography>
      </Box>
    </Box>
  );
}