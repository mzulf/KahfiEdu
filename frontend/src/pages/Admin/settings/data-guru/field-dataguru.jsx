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
    name: "",
    phone: "",
    email: "",
    avatar: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState("");

  /* =======================
     INIT FORM
  ======================= */
  useEffect(() => {
    if (editMode && data) {
      setForm(data);
      setPreview(data.avatar || "");
    } else {
      setForm({
        id: Date.now(),
        name: "",
        phone: "",
        email: "",
        avatar: "",
      });
      setPreview("");
      setAvatarFile(null);
    }
  }, [editMode, data, open]);

  /* =======================
     HANDLE CHANGE
  ======================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* =======================
     AVATAR UPLOAD
  ======================= */
  const handleAvatarSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  /* =======================
     SUBMIT
  ======================= */
  const handleSubmit = () => {
    onSave({
      ...form,
      avatar: preview,   // preview (testing)
      avatarFile,        // file untuk backend
    });
    onClose();
  };

  /* =======================
     INISIAL AVATAR
  ======================= */
  const getInitial = (name) =>
    name ? name.charAt(0).toUpperCase() : "?";

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 420 } }}
    >
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

        {/* AVATAR UPLOAD */}
        <Stack alignItems="center" spacing={2} mb={3}>
          <Avatar
            src={preview || undefined}
            sx={{
              width: 96,
              height: 96,
              bgcolor: "#008B47",
              fontSize: 36,
            }}
          >
            {!preview && getInitial(form.name)}
          </Avatar>

          <Button
            variant="outlined"
            component="label"
            size="small"
          >
            Upload Foto
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleAvatarSelect}
            />
          </Button>
        </Stack>

        {/* FORM */}
        <TextField
          label="Nama Guru"
          name="name"
          fullWidth
          margin="normal"
          value={form.name}
          onChange={handleChange}
        />

        <TextField
          label="Nomor Telepon"
          name="phone"
          fullWidth
          margin="normal"
          value={form.phone}
          onChange={handleChange}
        />

        <TextField
          label="Email"
          name="email"
          fullWidth
          margin="normal"
          value={form.email}
          onChange={handleChange}
        />

        {/* ACTION */}
        <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
          <Button variant="outlined" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#008B47",
              "&:hover": { bgcolor: "#006f3d" },
            }}
            onClick={handleSubmit}
          >
            Simpan
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
