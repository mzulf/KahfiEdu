// src/pages/Auth/pendaftaran/FormProgram.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Box, 
  Typography, 
  Card,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButtonGroup,
  ToggleButton,
  Container
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function FormProgram() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Ambil data dari page sebelumnya
  const { program, kelas } = location.state || {};

  // Form state
  const [kategori, setKategori] = useState("umum"); // umum, anak, orang-tua
  const [formData, setFormData] = useState({
    email: "",
    privatUntuk: "",
    guruLaki: "",
    privatBerapa: ""
  });

  const handleKategoriChange = (event, newKategori) => {
    if (newKategori !== null) {
      setKategori(newKategori);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBack = () => {
    navigate("/siswa/pilih-kelas", { state: { program } });
  };

  const handleLanjut = () => {
    // Validasi
    if (!formData.email || !formData.privatUntuk || !formData.guruLaki || !formData.privatBerapa) {
      alert("Mohon lengkapi semua field");
      return;
    }

    // Simpan data & lanjut ke step berikutnya
    navigate("/siswa/pendaftaran/daftar-anak", {
      state: {
        program,
        kelas,
        kategori,
        formProgram: formData
      }
    });
  };

  return (
    <Box sx={{ backgroundColor: "#F5F5F5", minHeight: "100vh", pb: 4 }}>
      
      {/* Header dengan Wave */}
      <Box
        sx={{
          backgroundColor: "#A7F3D0",
          borderBottomLeftRadius: "50% 30px",
          borderBottomRightRadius: "50% 30px",
          pb: 4,
          pt: 2
        }}
      >
        <Container maxWidth="lg">
          {/* Logo/Title bisa ditambahkan di sini */}
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ mt: -2 }}>
        
        <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
          PENDAFTARAN PROGRAM PRIVAT VISIT HOME
        </Typography>

        {/* Kategori Toggle Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <ToggleButtonGroup
            value={kategori}
            exclusive
            onChange={handleKategoriChange}
            sx={{ backgroundColor: "white", borderRadius: 8 }}
          >
            <ToggleButton 
              value="umum"
              sx={{
                px: 3,
                py: 1,
                borderRadius: "25px !important",
                textTransform: "none",
                "&.Mui-selected": {
                  backgroundColor: "#10B981",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#059669"
                  }
                }
              }}
            >
              <CheckCircleIcon sx={{ mr: 1, fontSize: 18 }} />
              Umum
            </ToggleButton>
            <ToggleButton 
              value="anak"
              sx={{
                px: 3,
                py: 1,
                borderRadius: "25px !important",
                textTransform: "none",
                "&.Mui-selected": {
                  backgroundColor: "#10B981",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#059669"
                  }
                }
              }}
            >
              Anak
            </ToggleButton>
            <ToggleButton 
              value="orang-tua"
              sx={{
                px: 3,
                py: 1,
                borderRadius: "25px !important",
                textTransform: "none",
                "&.Mui-selected": {
                  backgroundColor: "#10B981",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#059669"
                  }
                }
              }}
            >
              Orang Tua
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Form Card */}
        <Card
          sx={{
            borderRadius: 3,
            border: "1px solid #E0E0E0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            p: 4,
            mb: 3
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3
            }}
          >
            {/* Email */}
            <Box>
              <Typography variant="body2" fontWeight="500" mb={1}>
                Email<span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                placeholder="Masukkan email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2
                  }
                }}
              />
            </Box>

            {/* Privat untuk berapa anak */}
            <Box>
              <Typography variant="body2" fontWeight="500" mb={1}>
                Privat untuk berapa anak?<span style={{ color: "red" }}>*</span>
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={formData.privatUntuk}
                  onChange={(e) => handleInputChange("privatUntuk", e.target.value)}
                  displayEmpty
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="" disabled>Pilih jumlah</MenuItem>
                  <MenuItem value="1">1 Anak</MenuItem>
                  <MenuItem value="2">2 Anak</MenuItem>
                  <MenuItem value="3">3 Anak</MenuItem>
                  <MenuItem value="4+">4+ Anak</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Guru Laki-laki atau perempuan */}
            <Box>
              <Typography variant="body2" fontWeight="500" mb={1}>
                Guru Laki-laki atau perempuan<span style={{ color: "red" }}>*</span>
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={formData.guruLaki}
                  onChange={(e) => handleInputChange("guruLaki", e.target.value)}
                  displayEmpty
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="" disabled>Pilih gender guru</MenuItem>
                  <MenuItem value="laki-laki">Laki-laki</MenuItem>
                  <MenuItem value="perempuan">Perempuan</MenuItem>
                  <MenuItem value="tidak-masalah">Tidak Masalah</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Privat berapa kali pertemuan */}
            <Box>
              <Typography variant="body2" fontWeight="500" mb={1}>
                Privat berapa kali pertemuan?<span style={{ color: "red" }}>*</span>
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={formData.privatBerapa}
                  onChange={(e) => handleInputChange("privatBerapa", e.target.value)}
                  displayEmpty
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="" disabled>Pilih jumlah pertemuan</MenuItem>
                  <MenuItem value="1x">1x Seminggu</MenuItem>
                  <MenuItem value="2x">2x Seminggu</MenuItem>
                  <MenuItem value="3x">3x Seminggu</MenuItem>
                  <MenuItem value="4x">4x Seminggu</MenuItem>
                  <MenuItem value="5x">5x Seminggu</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Card>

        {/* Progress Indicator */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 3 }}>
          <Box sx={{ width: 80, height: 4, backgroundColor: "#10B981", borderRadius: 2 }} />
          <Box sx={{ width: 80, height: 4, backgroundColor: "#D1D5DB", borderRadius: 2 }} />
          <Box sx={{ width: 80, height: 4, backgroundColor: "#D1D5DB", borderRadius: 2 }} />
        </Box>

        {/* Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
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
            Kembali
          </Button>

          <Button
            onClick={handleLanjut}
            variant="contained"
            sx={{
              borderRadius: 8,
              px: 4,
              py: 1.5,
              textTransform: "none",
              fontSize: "16px",
              backgroundColor: "#10B981",
              "&:hover": {
                backgroundColor: "#059669"
              }
            }}
          >
            Lanjut
          </Button>
        </Box>

      </Container>
    </Box>
  );
}