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
  Container
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/id";

dayjs.locale("id");

export default function DaftarAnak() {
  const navigate = useNavigate();
  const location = useLocation();

  const { program, kelas, kategori, formProgram } = location.state || {};

  /* ===================== */
  /* State */
  /* ===================== */
  const [tempatLahir, setTempatLahir] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState(null);

  const [formData, setFormData] = useState({
    namaLengkap: "",
    jenisKelamin: "",
    umur: "",
    tempatTanggalLahir: "",
    pilihanProgram: "",
    sistemPembelajaran: "",
    deskripsiAnak: ""
  });

  const [errors, setErrors] = useState({});

  /* ===================== */
  /* Helpers */
  /* ===================== */
  const updateTTL = (tempat, tanggal) => {
    if (tempat && tanggal) {
      const formattedDate = dayjs(tanggal).format("DD MMMM YYYY");
      setFormData((prev) => ({
        ...prev,
        tempatTanggalLahir: `${tempat}, ${formattedDate}`
      }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleBack = () => {
    navigate("/siswa/pendaftaran/form-program", {
      state: { program, kelas }
    });
  };

  /* ===================== */
  /* Validation */
  /* ===================== */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.namaLengkap || formData.namaLengkap.length < 3)
      newErrors.namaLengkap = "Minimal 3 karakter";

    if (!formData.pilihanProgram)
      newErrors.pilihanProgram = "Pilih program";

    if (!formData.jenisKelamin)
      newErrors.jenisKelamin = "Pilih jenis kelamin";

    if (!formData.sistemPembelajaran)
      newErrors.sistemPembelajaran = "Pilih sistem pembelajaran";

    if (!formData.umur || !/^\d+$/.test(formData.umur))
      newErrors.umur = "Umur harus angka";
    else if (formData.umur < 3 || formData.umur > 18)
      newErrors.umur = "Umur 3–18 tahun";

    if (!tempatLahir)
      newErrors.tempatTanggalLahir = "Tempat lahir wajib diisi";

    if (!tanggalLahir)
      newErrors.tempatTanggalLahir = "Tanggal lahir wajib dipilih";

    if (!formData.deskripsiAnak || formData.deskripsiAnak.length < 10)
      newErrors.deskripsiAnak = "Minimal 10 karakter";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLanjut = () => {
    if (!validateForm()) return;

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

  /* ===================== */
  /* UI */
  /* ===================== */
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
            value="anak"
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
              label="Nama Lengkap Anak *"
              fullWidth
              value={formData.namaLengkap}
              onChange={(e) =>
                handleInputChange("namaLengkap", e.target.value)
              }
              error={Boolean(errors.namaLengkap)}
              helperText={errors.namaLengkap}
            />

            <SelectField
              label="Pilihan Program *"
              value={formData.pilihanProgram}
              error={errors.pilihanProgram}
              onChange={(v) => handleInputChange("pilihanProgram", v)}
              options={[
                { value: "tahsin", label: "Tahsin" },
                { value: "tahfidz", label: "Tahfidz" },
                { value: "tilawah", label: "Tilawah" },
                { value: "iqro", label: "Iqro" }
              ]}
            />

            <SelectField
              label="Jenis Kelamin *"
              value={formData.jenisKelamin}
              error={errors.jenisKelamin}
              onChange={(v) => handleInputChange("jenisKelamin", v)}
              options={[
                { value: "laki-laki", label: "Laki-laki" },
                { value: "perempuan", label: "Perempuan" }
              ]}
            />

            <SelectField
              label="Sistem Pembelajaran *"
              value={formData.sistemPembelajaran}
              error={errors.sistemPembelajaran}
              onChange={(v) =>
                handleInputChange("sistemPembelajaran", v)
              }
              options={[
                { value: "online", label: "Online" },
                { value: "offline", label: "Offline (Visit Home)" },
                { value: "hybrid", label: "Hybrid" }
              ]}
            />

            <TextField
              label="Umur *"
              fullWidth
              value={formData.umur}
              onChange={(e) => handleInputChange("umur", e.target.value)}
              error={Boolean(errors.umur)}
              helperText={errors.umur}
            />

            {/* Tempat + Kalender */}
            <Box>
              <TextField
                label="Tempat Lahir *"
                fullWidth
                value={tempatLahir}
                onChange={(e) => {
                  setTempatLahir(e.target.value);
                  updateTTL(e.target.value, tanggalLahir);
                }}
                error={Boolean(errors.tempatTanggalLahir)}
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Tanggal Lahir *"
                  value={tanggalLahir}
                  onChange={(newValue) => {
                    setTanggalLahir(newValue);
                    updateTTL(tempatLahir, newValue);
                  }}
                  disableFuture
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: { mt: 2 },
                      error: Boolean(errors.tempatTanggalLahir),
                      helperText: errors.tempatTanggalLahir
                    }
                  }}
                />
              </LocalizationProvider>
            </Box>

            <TextField
              label="Deskripsi tentang Anak *"
              multiline
              rows={4}
              fullWidth
              sx={{ gridColumn: "1 / -1" }}
              value={formData.deskripsiAnak}
              onChange={(e) =>
                handleInputChange("deskripsiAnak", e.target.value)
              }
              error={Boolean(errors.deskripsiAnak)}
              helperText={errors.deskripsiAnak}
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
      <Select
        value={value}
        displayEmpty
        onChange={(e) => onChange(e.target.value)}
      >
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
