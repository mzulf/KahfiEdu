// src/pages/Auth/kelas/PilihProgram.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Typography, 
  Card,
  Button,
  Container
} from "@mui/material";

export default function PilihProgram() {
  const navigate = useNavigate();
  const [selectedProgram, setSelectedProgram] = useState(null);

  // 4 opsi program
  const programs = [
    {
      id: 1,
      title: "Kelas privat mengaji",
      subtitle: "visit home offline",
      icon: "🏠",
      type: "offline"
    },
    {
      id: 2,
      title: "Kelas privat mengaji",
      subtitle: "visit home online",
      icon: "🏠📶",
      type: "online"
    },
    {
      id: 3,
      title: "Kelas tahsin full",
      subtitle: "online",
      icon: "📖",
      type: "tahsin-online"
    },
    {
      id: 4,
      title: "Kelas tahfidz full",
      subtitle: "online",
      icon: "📕",
      type: "tahfidz-online"
    }
  ];

  const handleProgramClick = (program) => {
    setSelectedProgram(program.id);
  };

  const handleBack = () => {
    navigate("/siswa/kelas");
  };

  const handleLanjut = () => {
    if (!selectedProgram) {
      alert("Silakan pilih program terlebih dahulu");
      return;
    }
    
    // Kirim data program yang dipilih ke halaman berikutnya
    const program = programs.find(p => p.id === selectedProgram);
    navigate("/siswa/kelas/pilih-kelas", { state: { program } });
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
            mb={2}
          >
            Pilih Program
          </Typography>

          {/* Subtitle */}
          <Typography 
            variant="body1" 
            color="text.secondary" 
            textAlign="center" 
            mb={4}
          >
            Yuk, pilih program belajar kamu sebelum daftar lebih lanjut!
          </Typography>

          {/* Program Options Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 3,
              mb: 4
            }}
          >
            {programs.map((program) => (
              <Card
                key={program.id}
                onClick={() => handleProgramClick(program)}
                sx={{
                  border: selectedProgram === program.id 
                    ? "3px solid #10B981" 
                    : "2px solid #E0E0E0",
                  borderRadius: 3,
                  p: 3,
                  cursor: "pointer",
                  transition: "all 0.3s",
                  backgroundColor: selectedProgram === program.id 
                    ? "#F0FDF4" 
                    : "white",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    transform: "translateY(-2px)"
                  }
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    fontSize: "60px",
                    textAlign: "center",
                    mb: 2
                  }}
                >
                  {program.icon}
                </Box>

                {/* Title */}
                <Typography 
                  variant="body1" 
                  fontWeight="600" 
                  textAlign="center"
                  mb={0.5}
                >
                  {program.title}
                </Typography>

                {/* Subtitle */}
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  textAlign="center"
                >
                  visit home <strong>{program.subtitle.includes('offline') ? 'offline' : 'online'}</strong>
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
              disabled={!selectedProgram}
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