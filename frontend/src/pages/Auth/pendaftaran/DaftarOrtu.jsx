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

  const { program, kelas, kategori, formProgram, dataAnak } =
    location.state || {};

  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    namaAyahIbu: "",
    wilayahKabupaten: "",
    noWhatsapp: "",
    alamatLengkap: "",
    izinKontenSosmed: ""
  });

  const [errors, setErrors] = useState({});

  /* ===================== */
  /* Handlers */
  /* ===================== */
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleBack = () => {
    navigate("/siswa/pendaftaran/daftar-anak", {
      state: { program, kelas, kategori, formProgram }
    });
  };

  /* ===================== */
  /* Validation */
  /* ===================== */
  const isValidWhatsapp = (value) =>
    /^[0-9]{10,15}$/.test(value);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.namaAyahIbu)
      newErrors.namaAyahIbu = "Nama wajib diisi";

    if (!formData.wilayahKabupaten)
      newErrors.wilayahKabupaten = "Wilayah wajib diisi";

    if (!formData.noWhatsapp)
      newErrors.noWhatsapp = "No WhatsApp wajib diisi";
    else if (!isValidWhatsapp(formData.noWhatsapp))
      newErrors.noWhatsapp = "Gunakan angka (10–15 digit)";

    if (!formData.izinKontenSosmed)
      newErrors.izinKontenSosmed = "Pilih salah satu";

    if (!formData.alamatLengkap)
      newErrors.alamatLengkap = "Alamat wajib diisi";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const completeData = {
      program,
      kelas,
      kategori,
      ...formProgram,
      ...dataAnak,
      ...formData
    };

    console.log("Data lengkap:", completeData);

    await new Promise((r) => setTimeout(r, 800));
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate("/siswa/pembayaran", {
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

  return (
    <Box sx={{ backgroundColor: "#F5F5F5", minHeight: "100vh", pb: 4 }}>
      {/* Header */}
      <Box
        sx={{
          backgroundColor: "#A7F3D0",
          borderBottomLeftRadius: "50% 40px",
          borderBottomRightRadius: "50% 40px",
          pb: 5
        }}
      />

      <Container maxWidth="md" sx={{ mt: -3 }}>
        {/* Toggle */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <ToggleButtonGroup
            value="orang-tua"
            exclusive
            sx={{
              backgroundColor: "white",
              borderRadius: 999,
              p: 0.5
            }}
          >
            {["umum", "anak", "orang-tua"].map((item) => (
              <ToggleButton
                key={item}
                value={item}
                sx={{
                  px: 4,
                  py: 1,
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 500,
                  "&.Mui-selected": {
                    backgroundColor: "#10B981",
                    color: "white"
                  }
                }}
              >
                <CheckCircleIcon sx={{ mr: 1, fontSize: 18 }} />
                {item.replace("-", " ").toUpperCase()}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {/* Form */}
        <Card sx={{ borderRadius: 3, p: 4 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3
            }}
          >
            <TextField
              label="Nama Ayah / Ibu *"
              fullWidth
              value={formData.namaAyahIbu}
              onChange={(e) =>
                handleInputChange("namaAyahIbu", e.target.value)
              }
              error={Boolean(errors.namaAyahIbu)}
              helperText={errors.namaAyahIbu}
            />

            <TextField
              label="Wilayah Kabupaten / Kecamatan *"
              fullWidth
              value={formData.wilayahKabupaten}
              onChange={(e) =>
                handleInputChange("wilayahKabupaten", e.target.value)
              }
              error={Boolean(errors.wilayahKabupaten)}
              helperText={errors.wilayahKabupaten}
            />

            <TextField
              label="No WhatsApp *"
              fullWidth
              placeholder="08xxxxxxxxxx"
              value={formData.noWhatsapp}
              onChange={(e) =>
                handleInputChange("noWhatsapp", e.target.value)
              }
              error={Boolean(errors.noWhatsapp)}
              helperText={errors.noWhatsapp}
            />

            <FormControl fullWidth error={Boolean(errors.izinKontenSosmed)}>
              <Select
                value={formData.izinKontenSosmed}
                displayEmpty
                onChange={(e) =>
                  handleInputChange("izinKontenSosmed", e.target.value)
                }
              >
                <MenuItem value="" disabled>
                  Izin Konten Sosmed *
                </MenuItem>
                <MenuItem value="ya">Ya</MenuItem>
                <MenuItem value="tidak">Tidak</MenuItem>
                <MenuItem value="terbatas">Terbatas</MenuItem>
              </Select>
              {errors.izinKontenSosmed && (
                <Typography variant="caption" color="error">
                  {errors.izinKontenSosmed}
                </Typography>
              )}
            </FormControl>

            <TextField
              label="Alamat Lengkap *"
              multiline
              rows={3}
              fullWidth
              sx={{ gridColumn: "1 / -1" }}
              value={formData.alamatLengkap}
              onChange={(e) =>
                handleInputChange("alamatLengkap", e.target.value)
              }
              error={Boolean(errors.alamatLengkap)}
              helperText={errors.alamatLengkap}
            />
          </Box>
        </Card>

        {/* Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
          <Button
            onClick={handleBack}
            sx={{
              px: 5,
              py: 1.4,
              borderRadius: 999,
              backgroundColor: "#E5E7EB",
              color: "#374151",
              "&:hover": { backgroundColor: "#D1D5DB" }
            }}
          >
            Kembali
          </Button>

          <Button
            onClick={handleSubmit}
            sx={{
              px: 5,
              py: 1.4,
              borderRadius: 999,
              backgroundColor: "#10B981",
              color: "white",
              "&:hover": { backgroundColor: "#059669" }
            }}
          >
            Submit
          </Button>
        </Box>
      </Container>

      {/* Success Dialog */}
      <Dialog
        open={showSuccess}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <IconButton
          onClick={() => setShowSuccess(false)}
          sx={{ position: "absolute", left: 16, top: 16 }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent sx={{ textAlign: "center", py: 5 }}>
          <CheckCircleIcon sx={{ fontSize: 80, color: "#10B981", mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Pendaftaran Berhasil!
          </Typography>
          <Typography color="text.secondary" mb={4}>
            Tim kami akan menghubungi Anda melalui WhatsApp.
          </Typography>

          <Button
            onClick={handleSuccessClose}
            fullWidth
            sx={{
              py: 1.5,
              borderRadius: 999,
              backgroundColor: "#10B981",
              color: "white"
            }}
          >
            LANJUTKAN
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
