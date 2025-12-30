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
  ToggleButtonGroup,
  ToggleButton,
  Container
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function FormProgram() {
  const navigate = useNavigate();
  const location = useLocation();
  const { program, kelas } = location.state || {};

  const [kategori, setKategori] = useState("umum");
  const [formData, setFormData] = useState({
    email: "",
    privatUntuk: "",
    guruLaki: "",
    privatBerapa: ""
  });
  const [errors, setErrors] = useState({});

  /* ===================== */
  /* Handlers */
  /* ===================== */
  const handleKategoriChange = (_, newKategori) => {
    if (newKategori) setKategori(newKategori);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleBack = () => {
    navigate("/siswa/kelas/detail-pilih-program", {
      state: { program, kelas }
    });
  };

  /* ===================== */
  /* Validation */
  /* ===================== */
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email wajib diisi";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.privatUntuk) newErrors.privatUntuk = "Wajib dipilih";
    if (!formData.guruLaki) newErrors.guruLaki = "Wajib dipilih";
    if (!formData.privatBerapa) newErrors.privatBerapa = "Wajib dipilih";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLanjut = () => {
    if (!validateForm()) return;

    navigate("/siswa/pendaftaran/daftar-anak", {
      state: { program, kelas, kategori, formProgram: formData }
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
        <Typography variant="h5" fontWeight="bold" mb={4} textAlign="center">
          PENDAFTARAN PROGRAM PRIVAT VISIT HOME
        </Typography>

        {/* Toggle */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <ToggleButtonGroup
            value={kategori}
            exclusive
            onChange={handleKategoriChange}
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
                    color: "white",
                    "&:hover": { backgroundColor: "#059669" }
                  }
                }}
              >
                {item === "umum" && <CheckCircleIcon sx={{ mr: 1, fontSize: 18 }} />}
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
              label="Email *"
              fullWidth
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={Boolean(errors.email)}
              helperText={errors.email}
            />

            <SelectField
              label="Privat untuk berapa anak?"
              value={formData.privatUntuk}
              error={errors.privatUntuk}
              onChange={(v) => handleInputChange("privatUntuk", v)}
              options={[
                { value: "1", label: "1 Anak" },
                { value: "2", label: "2 Anak" },
                { value: "3", label: "3 Anak" },
                { value: "4+", label: "4+ Anak" }
              ]}
            />

            <SelectField
              label="Guru Laki-laki / Perempuan"
              value={formData.guruLaki}
              error={errors.guruLaki}
              onChange={(v) => handleInputChange("guruLaki", v)}
              options={[
                { value: "laki-laki", label: "Laki-laki" },
                { value: "perempuan", label: "Perempuan" },
                { value: "tidak-masalah", label: "Tidak Masalah" }
              ]}
            />

            <SelectField
              label="Privat berapa kali pertemuan?"
              value={formData.privatBerapa}
              error={errors.privatBerapa}
              onChange={(v) => handleInputChange("privatBerapa", v)}
              options={[
                { value: "1x", label: "1x Seminggu" },
                { value: "2x", label: "2x Seminggu" },
                { value: "3x", label: "3x Seminggu" },
                { value: "4x", label: "4x Seminggu" }
              ]}
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
            onClick={handleLanjut}
            sx={{
              px: 5,
              py: 1.4,
              borderRadius: 999,
              backgroundColor: "#10B981",
              color: "white",
              "&:hover": { backgroundColor: "#059669" }
            }}
          >
            Lanjut
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

/* ===================== */
/* Helper */
function SelectField({ label, value, onChange, options, error }) {
  return (
    <FormControl fullWidth error={Boolean(error)}>
      <Select value={value} displayEmpty onChange={(e) => onChange(e.target.value)}>
        <MenuItem value="" disabled>
          {label}
        </MenuItem>
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}
    </FormControl>
  );
}
