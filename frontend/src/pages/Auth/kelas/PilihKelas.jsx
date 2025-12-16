// src/pages/Auth/kelas/PilihKelas.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Box, 
  Typography, 
  Card,
  Button,
  Container
} from "@mui/material";
import ClassIcon from "@mui/icons-material/Class";

export default function PilihKelas() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKelas, setSelectedKelas] = useState(null);

  // Ambil data program dari page sebelumnya
  const program = location.state?.program;

  // List kelas
  const kelasList = [
    { id: "A", name: "Kelas A" },
    { id: "B", name: "Kelas B" },
    { id: "C", name: "Kelas C" },
    { id: "D", name: "Kelas D" }
  ];

  const handleKelasClick = (kelas) => {
    setSelectedKelas(kelas.id);
  };

  const handleBack = () => {
    navigate("/siswa/kelas/pilih-program");
  };

  const handleLanjut = () => {
    if (!selectedKelas) {
      alert("Silakan pilih kelas terlebih dahulu");
      return;
    }
    
    // Kirim data program & kelas ke form pendaftaran
    const kelasData = kelasList.find(k => k.id === selectedKelas);
    
    navigate("/siswa/kelas/detail-pilih-program", { 
      state: { 
        program: program,
        kelas: kelasData
      } 
    });
  };

  return (
    <Box sx={{ backgroundColor: "#F5F5F5", minHeight: "100vh", pb: 4 }}>
      <Container maxWidth="md" sx={{ pt: 4 }}>
        
        {/* Card Container */}
        <Card
          sx={{
            borderRadius: 4,
            border: "1px solid #E0E0E0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            p: 6,
            mt: 4
          }}
        >
          {/* Title */}
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            textAlign="center" 
            mb={6}
          >
            Pilih Kelas
          </Typography>

          {/* Kelas Options Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 3,
              mb: 6
            }}
          >
            {kelasList.map((kelas) => (
              <Card
                key={kelas.id}
                onClick={() => handleKelasClick(kelas)}
                sx={{
                  border: selectedKelas === kelas.id 
                    ? "3px solid #10B981" 
                    : "2px solid #E0E0E0",
                  borderRadius: 3,
                  p: 3,
                  cursor: "pointer",
                  transition: "all 0.3s",
                  backgroundColor: selectedKelas === kelas.id 
                    ? "#F0FDF4" 
                    : "white",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    transform: "translateY(-2px)"
                  }
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    backgroundColor: "#10B981",
                    borderRadius: 2,
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <ClassIcon sx={{ color: "white", fontSize: 28 }} />
                </Box>

                {/* Kelas Name */}
                <Typography 
                  variant="h6" 
                  fontWeight="600"
                >
                  {kelas.name}
                </Typography>
              </Card>
            ))}
          </Box>

          {/* Buttons */}
          <Box 
            sx={{ 
              display: "flex", 
              justifyContent: "center", 
              gap: 2,
              mt: 4
            }}
          >
            <Button
              onClick={handleBack}
              variant="outlined"
              sx={{
                borderRadius: 8,
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontSize: "16px",
                borderColor: "#E0E0E0",
                color: "#374151",
                "&:hover": {
                  borderColor: "#9CA3AF",
                  backgroundColor: "#F9FAFB"
                }
              }}
            >
              Back
            </Button>

            <Button
              onClick={handleLanjut}
              variant="contained"
              disabled={!selectedKelas}
              sx={{
                borderRadius: 8,
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontSize: "16px",
                backgroundColor: "#10B981",
                "&:hover": {
                  backgroundColor: "#059669"
                },
                "&:disabled": {
                  backgroundColor: "#D1D5DB"
                }
              }}
            >
              Lanjut
            </Button>
          </Box>

        </Card>

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