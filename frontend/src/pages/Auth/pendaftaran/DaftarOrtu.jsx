// src/pages/Auth/pendaftaran/DaftarOrtu.jsx
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
  Dialog,
  DialogContent,
  IconButton
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";

export default function DaftarOrtu() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Ambil semua data dari step sebelumnya
  const { program, kelas, kategori, formProgram, dataAnak } = location.state || {};

  // Dialog success
  const [showSuccess, setShowSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    namaAyahIbu: "",
    wilayahKabupaten: "",
    noWhatsapp: "",
    alamatLengkap: "",
    izinKontenSosmed: ""
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBack = () => {
    navigate("/siswa/pendaftaran/daftar-anak", {
      state: { program, kelas, kategori, formProgram }
    });
  };

  const handleSubmit = async () => {
    if (!formData.namaAyahIbu || !formData.wilayahKabupaten || !formData.noWhatsapp || !formData.alamatLengkap) {
      alert("Mohon lengkapi semua field yang wajib (*)");
      return;
    }

    const completeData = {
      program,
      kelas,
      kategori,
      ...formProgram,
      ...dataAnak,
      ...formData
    };

    console.log("Data lengkap pendaftaran:", completeData);

    await new Promise(resolve => setTimeout(resolve, 1000));

    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
  setShowSuccess(false);

  navigate("/siswa/pembayaran/", {
    state: {
      program,
      kelas,
      kategori,
      formProgram,
      dataAnak,
      orangTua: formData,
      success: true
    }
  });
};


  const handleCloseStayOnPage = () => {
    setShowSuccess(false);
  };

  return (
    <Box sx={{ backgroundColor: "#F5F5F5", minHeight: "100vh", pb: 4 }}>

      {/* Header Wave */}
      <Box
        sx={{
          backgroundColor: "#A7F3D0",
          borderBottomLeftRadius: "50% 30px",
          borderBottomRightRadius: "50% 30px",
          pb: 4,
          pt: 2
        }}
      >
        <Container maxWidth="lg"></Container>
      </Box>

      <Container maxWidth="md" sx={{ mt: -2 }}>

        {/* Kategori Step */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <ToggleButtonGroup
            value="orang-tua"
            exclusive
            sx={{ backgroundColor: "white", borderRadius: 8 }}
          >
            <ToggleButton value="umum">
              <CheckCircleIcon sx={{ mr: 1, fontSize: 18 }} />
              Umum
            </ToggleButton>

            <ToggleButton value="anak">
              <CheckCircleIcon sx={{ mr: 1, fontSize: 18 }} />
              Anak
            </ToggleButton>

            <ToggleButton
              value="orang-tua"
              selected
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "#10B981",
                  color: "white"
                }
              }}
            >
              <CheckCircleIcon sx={{ mr: 1, fontSize: 18 }} />
              Orang Tua
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Form */}
        <Card sx={{ p: 4, mb: 3 }}>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3
            }}
          >
            {/* Nama Ayah/Ibu */}
            <Box>
              <Typography fontWeight="500" mb={1}>
                Nama Ayah/Ibu*
              </Typography>
              <TextField
                fullWidth
                placeholder="Masukkan nama"
                value={formData.namaAyahIbu}
                onChange={(e) => handleInputChange("namaAyahIbu", e.target.value)}
              />
            </Box>

            {/* Wilayah */}
            <Box>
              <Typography fontWeight="500" mb={1}>
                Wilayah Kabupaten/Kecamatan*
              </Typography>
              <TextField
                fullWidth
                placeholder="Contoh: Jakarta Selatan"
                value={formData.wilayahKabupaten}
                onChange={(e) => handleInputChange("wilayahKabupaten", e.target.value)}
              />
            </Box>

            {/* No WA */}
            <Box>
              <Typography fontWeight="500" mb={1}>
                No Whatsapp*
              </Typography>
              <TextField
                fullWidth
                placeholder="08xxxxxxxxxx"
                value={formData.noWhatsapp}
                onChange={(e) => handleInputChange("noWhatsapp", e.target.value)}
              />
            </Box>

            {/* Izin Sosmed */}
            <Box>
              <Typography fontWeight="500" mb={1}>
                Izin Konten Sosmed*
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={formData.izinKontenSosmed}
                  onChange={(e) => handleInputChange("izinKontenSosmed", e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="" disabled>Pilih jawaban</MenuItem>
                  <MenuItem value="ya">Ya</MenuItem>
                  <MenuItem value="tidak">Tidak</MenuItem>
                  <MenuItem value="terbatas">Terbatas</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Alamat */}
            <Box sx={{ gridColumn: "1 / -1" }}>
              <Typography fontWeight="500" mb={1}>
                Alamat Lengkap*
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Masukkan alamat lengkap..."
                value={formData.alamatLengkap}
                onChange={(e) => handleInputChange("alamatLengkap", e.target.value)}
              />
            </Box>

          </Box>
        </Card>

        {/* Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button variant="outlined" onClick={handleBack}>
            Kembali
          </Button>

          <Button variant="contained" sx={{ backgroundColor: "#10B981" }} onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Container>

      {/* Success Dialog */}
      <Dialog 
        open={showSuccess} 
        onClose={handleCloseStayOnPage}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {/* Tombol X */}
        <IconButton
          onClick={handleCloseStayOnPage}
          sx={{
            position: "absolute",
            left: 16,
            top: 16,
            color: "#6B7280"
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent sx={{ textAlign: "center", py: 5, px: 4 }}>
          <CheckCircleIcon sx={{ fontSize: 80, color: "#10B981", mb: 2 }} />

          <Typography variant="h5" fontWeight="bold" mb={2}>
            Pendaftaran Berhasil!
          </Typography>

          <Typography variant="body1" color="text.secondary" mb={4}>
            Terima kasih telah mendaftar program {program?.title} - Kelas {kelas?.name}.
            Tim kami akan segera menghubungi Anda melalui WhatsApp.
          </Typography>

          <Button
            onClick={handleSuccessClose}
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#10B981",
              py: 1.5,
              borderRadius: 2
            }}
          >
            LANJUTKAN
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
