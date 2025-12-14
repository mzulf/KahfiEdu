// src/pages/Auth/pendaftaran/DaftarAnak.jsx
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
  ToggleButtonGroup,
  ToggleButton,
  Container,
  InputAdornment,
  IconButton
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

export default function DaftarAnak() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Ambil data dari step sebelumnya
  const { program, kelas, kategori, formProgram } = location.state || {};

  // Form state
  const [formData, setFormData] = useState({
    namaLengkap: "",
    jenisKelamin: "",
    umur: "",
    tempatTanggalLahir: "",
    pilihanProgram: "",
    sistemPembelajaran: "",
    deskripsiAnak: ""
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBack = () => {
    navigate("/siswa/pendaftaran/form-program", {
      state: { program, kelas }
    });
  };

  const handleLanjut = () => {
    // Validasi
    if (!formData.namaLengkap || !formData.jenisKelamin || !formData.pilihanProgram || !formData.sistemPembelajaran) {
      alert("Mohon lengkapi field yang wajib diisi (*)");
      return;
    }

    // Lanjut ke step 3
    navigate("/siswa/pendaftaran/daftar-ortu", {
      state: {
        program,
        kelas,
        kategori,
        formProgram,
        dataAnak: formData
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
          {/* Logo/Title */}
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ mt: -2 }}>

        {/* Kategori Toggle Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <ToggleButtonGroup
            value="anak"
            exclusive
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
                  color: "white"
                }
              }}
            >
              <CheckCircleIcon sx={{ mr: 1, fontSize: 18 }} />
              Umum
            </ToggleButton>
            <ToggleButton 
              value="anak"
              selected
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
              Anak
            </ToggleButton>
            <ToggleButton 
              value="orang-tua"
              sx={{
                px: 3,
                py: 1,
                borderRadius: "25px !important",
                textTransform: "none"
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
            {/* Nama Lengkap Anak */}
            <Box>
              <Typography variant="body2" fontWeight="500" mb={1}>
                Nama Lengkap Anak<span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                placeholder="Masukkan nama lengkap"
                value={formData.namaLengkap}
                onChange={(e) => handleInputChange("namaLengkap", e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Box>

            {/* Pilihan Program */}
            <Box>
              <Typography variant="body2" fontWeight="500" mb={1}>
                Pilihan Program<span style={{ color: "red" }}>*</span>
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={formData.pilihanProgram}
                  onChange={(e) => handleInputChange("pilihanProgram", e.target.value)}
                  displayEmpty
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="" disabled>Pilih program</MenuItem>
                  <MenuItem value="tahsin">Tahsin</MenuItem>
                  <MenuItem value="tahfidz">Tahfidz</MenuItem>
                  <MenuItem value="tilawah">Tilawah</MenuItem>
                  <MenuItem value="iqro">Iqro</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Jenis Kelamin */}
            <Box>
              <Typography variant="body2" fontWeight="500" mb={1}>
                Jenis Kelamin<span style={{ color: "red" }}>*</span>
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={formData.jenisKelamin}
                  onChange={(e) => handleInputChange("jenisKelamin", e.target.value)}
                  displayEmpty
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="" disabled>Pilih jenis kelamin</MenuItem>
                  <MenuItem value="laki-laki">Laki-laki</MenuItem>
                  <MenuItem value="perempuan">Perempuan</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Sistem Pembelajaran */}
            <Box>
              <Typography variant="body2" fontWeight="500" mb={1}>
                Sistem Pembelajaran<span style={{ color: "red" }}>*</span>
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={formData.sistemPembelajaran}
                  onChange={(e) => handleInputChange("sistemPembelajaran", e.target.value)}
                  displayEmpty
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="" disabled>Pilih sistem</MenuItem>
                  <MenuItem value="online">Online</MenuItem>
                  <MenuItem value="offline">Offline (Visit Home)</MenuItem>
                  <MenuItem value="hybrid">Hybrid</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Umur */}
            <Box>
              <Typography variant="body2" fontWeight="500" mb={1}>
                Umur<span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                placeholder="Contoh: 7 tahun"
                value={formData.umur}
                onChange={(e) => handleInputChange("umur", e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Box>

            {/* Tempat, Tanggal Lahir */}
            <Box>
              <Typography variant="body2" fontWeight="500" mb={1}>
                Tempat, Tanggal Lahir<span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                placeholder="Jakarta, 01 Januari 2015"
                value={formData.tempatTanggalLahir}
                onChange={(e) => handleInputChange("tempatTanggalLahir", e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <CalendarTodayIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Box>

            {/* Deskripsi tentang Anak - Full Width */}
            <Box sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}>
              <Typography variant="body2" fontWeight="500" mb={1}>
                Deskripsi tentang Anak<span style={{ color: "red" }}>*</span>
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                (Mohon diisi mengenai minat belajar anak seperti: gaya belajar, metode belajar sehari-hari, 
                sesuatu yang disukai dan tidak disukai)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Tuliskan deskripsi..."
                value={formData.deskripsiAnak}
                onChange={(e) => handleInputChange("deskripsiAnak", e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Box>
          </Box>
        </Card>

        {/* Progress Indicator */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 3 }}>
          <Box sx={{ width: 80, height: 4, backgroundColor: "#10B981", borderRadius: 2 }} />
          <Box sx={{ width: 80, height: 4, backgroundColor: "#10B981", borderRadius: 2 }} />
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