import {
  Box,
  Button,
  Drawer,
  TextField,
  Typography,
  Avatar,
  IconButton,
  Stack,
} from "@mui/material";
import { HiOutlineXCircle } from "react-icons/hi";
import { useEffect, useState } from "react";

export default function FieldDataGuru({
  open,
  onClose,
  editMode,
  data,
  onSave,
}) {
  const [form, setForm] = useState({
    id: null,
    nama: "",
    nomorTelepon: "",
    email: "",
    foto: "",
  });

  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});

  /* =======================
     INIT FORM
  ======================= */
  useEffect(() => {
    if (editMode && data) {
      setForm(data);
      setPreview(data.foto || "");
    } else {
      setForm({
        id: null,
        nama: "",
        nomorTelepon: "",
        email: "",
        foto: "",
      });
      setPreview("");
    }
    setErrors({});
  }, [editMode, data, open]);

  /* =======================
     HANDLE CHANGE
  ======================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

/* =======================
   FOTO UPLOAD (BASE64 + COMPRESS)
======================= */
const handleFotoSelect = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Validasi ukuran file ASLI (sebelum base64)
  if (file.size > 2 * 1024 * 1024) {
    alert("Ukuran file maksimal 2MB");
    return;
  }

  // Compress dan convert ke base64
  const reader = new FileReader();
  reader.onloadend = () => {
    const img = new Image();
    img.src = reader.result;
    
    img.onload = () => {
      // Create canvas untuk resize
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set max width/height
      const MAX_WIDTH = 400;
      const MAX_HEIGHT = 400;
      
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw resized image
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to base64 dengan quality 0.7 (70%)
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
      
      setPreview(compressedBase64);
      setForm({ ...form, foto: compressedBase64 });
      
      // Log ukuran untuk debugging
      const sizeInKB = (compressedBase64.length * 3/4) / 1024;
      console.log(`✅ Foto compressed: ${sizeInKB.toFixed(2)} KB`);
    };
  };
  
  reader.readAsDataURL(file);
};

  /* =======================
     VALIDASI
  ======================= */
  const validateForm = () => {
    const newErrors = {};

    if (!form.nama.trim()) {
      newErrors.nama = "Nama wajib diisi";
    }

    if (!form.nomorTelepon.trim()) {
      newErrors.nomorTelepon = "Nomor telepon wajib diisi";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* =======================
     SUBMIT
  ======================= */
  const handleSubmit = () => {
    if (!validateForm()) return;

    onSave(form);
    onClose();
  };

  const getInitial = (nama) =>
    nama ? nama.charAt(0).toUpperCase() : "?";

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 420 } }}>
      <Box p={3}>
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h6">
            {editMode ? "Edit Guru" : "Tambah Guru"}
          </Typography>
          <IconButton onClick={onClose}>
            <HiOutlineXCircle size={28} />
          </IconButton>
        </Box>

        {/* FOTO */}
        <Stack alignItems="center" spacing={2} mb={3}>
          <Avatar
            src={preview || undefined}
            sx={{ width: 96, height: 96, bgcolor: "#008B47", fontSize: 36 }}
          >
            {!preview && getInitial(form.nama)}
          </Avatar>

          <Button variant="outlined" component="label" size="small">
            Upload Foto
            <input type="file" hidden accept="image/*" onChange={handleFotoSelect} />
          </Button>
        </Stack>

        {/* FORM */}
        <TextField
          label="Nama Guru"
          name="nama"
          fullWidth
          margin="normal"
          value={form.nama}
          onChange={handleChange}
          error={!!errors.nama}
          helperText={errors.nama}
        />

        <TextField
          label="Nomor Telepon"
          name="nomorTelepon"
          fullWidth
          margin="normal"
          value={form.nomorTelepon}
          onChange={handleChange}
          error={!!errors.nomorTelepon}
          helperText={errors.nomorTelepon}
        />

        <TextField
          label="Email"
          name="email"
          fullWidth
          margin="normal"
          value={form.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />

        {/* ACTION */}
        <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
          <Button variant="outlined" onClick={onClose}>Batal</Button>
          <Button variant="contained" sx={{ bgcolor: "#008B47" }} onClick={handleSubmit}>
            Simpan
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
