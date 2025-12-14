import {
  Box,
  Button,
  Drawer,
  TextField,
  Typography,
  Avatar,
} from "@mui/material";
import { useEffect, useState } from "react";
import useAlert from "../../../../hooks/useAlert";
import { useLoading } from "../../../../hooks/useLoading";
import materiService from "../../../../services/materiService";

const IMAGE_MAX = 5 * 1024 * 1024; // 5MB
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function MateriDrawer({
  open,
  onClose,
  data,
  editMode = false,
  onSuccess,
}) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [detail, setDetail] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const { showAlert } = useAlert();
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    if (editMode && data) {
      setTitle(data.title || "");
      setDesc(data.desc || "");
      setDetail(data.detail || "");
      setImage(null);
      setPreview(data.imageUrl || "");
    } else {
      setTitle("");
      setDesc("");
      setDetail("");
      setImage(null);
      setPreview("");
    }
  }, [editMode, data, open]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!IMAGE_TYPES.includes(file.type)) {
      showAlert("Format gambar harus JPG / PNG / WEBP", "warning");
      return;
    }

    if (file.size > IMAGE_MAX) {
      showAlert("Ukuran gambar maksimal 5MB", "warning");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!title || !desc || !detail) {
      showAlert("Semua field wajib diisi", "warning");
      return;
    }

    if (!editMode && !image) {
      showAlert("Gambar materi wajib diupload", "warning");
      return;
    }

    showLoading();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("desc", desc);
      formData.append("detail", detail);
      if (image) formData.append("image", image);

      const res = editMode
        ? await materiService.updateMateri(data.id, formData)
        : await materiService.createMateri(formData);

      if (res.success) {
        showAlert("Materi berhasil disimpan", "success");
        onSuccess();
      }
    } catch (e) {
      showAlert(e.message || "Gagal menyimpan materi", "error");
    } finally {
      hideLoading();
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 420, p: 3, height: "100%" }}>
        <Typography variant="h6" mb={2}>
          {editMode ? "Edit Materi" : "Tambah Materi"}
        </Typography>

        {/* IMAGE */}
        <Box textAlign="center" mb={2}>
          <Avatar
            src={preview}
            sx={{ width: 120, height: 120, mx: "auto", mb: 1 }}
          />
          <Button variant="outlined" component="label">
            Upload Gambar
            <input hidden type="file" accept="image/*" onChange={handleImageChange} />
          </Button>
        </Box>

        <TextField
          label="Judul"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Deskripsi"
          fullWidth
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Detail Materi"
          fullWidth
          multiline
          rows={5}
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Box display="flex" gap={2}>
          <Button fullWidth variant="outlined" onClick={onClose}>
            Batal
          </Button>
          <Button
            fullWidth
            variant="contained"
            sx={{ bgcolor: "#008B47" }}
            onClick={handleSubmit}
          >
            Simpan
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
