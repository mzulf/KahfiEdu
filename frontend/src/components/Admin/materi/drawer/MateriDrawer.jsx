import {
  Box,
  Button,
  Drawer,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import useAlert from "../../../../hooks/useAlert";
import { useLoading } from "../../../../hooks/useLoading";
import materiService from "../../../../services/materiService";

/* ================== CONSTANT ================== */
const IMAGE_MAX = 2 * 1024 * 1024; // 2MB
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const TITLE_MIN = 5;
const TITLE_MAX = 100;
const DESC_MIN = 10;
const DESC_MAX = 255;
const DETAIL_MIN = 20;
const DETAIL_MAX = 2000;

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

  const fileInputRef = useRef(null);

  const { showAlert } = useAlert();
  const { showLoading, hideLoading } = useLoading();

  /* ================== INIT ================== */
  useEffect(() => {
    if (editMode && data) {
      setTitle(data.title || "");
      setDesc(data.description || "");
      setDetail(data.detail || "");
      setImage(null);
      setPreview(data.imageUrl || "");
    } else {
      resetForm();
    }
  }, [editMode, data, open]);

  const resetForm = () => {
    setTitle("");
    setDesc("");
    setDetail("");
    setImage(null);
    setPreview("");
  };

  /* ================== IMAGE ================== */
  const validateImage = (file) => {
    if (!IMAGE_TYPES.includes(file.type)) {
      showAlert("Format gambar harus JPG / PNG / WEBP", "warning");
      return false;
    }
    if (file.size > IMAGE_MAX) {
      showAlert("Ukuran gambar maksimal 2MB", "warning");
      return false;
    }
    return true;
  };

  const handleImageSelect = (file) => {
    if (!file) return;
    if (!validateImage(file)) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleFileChange = (e) => {
    handleImageSelect(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleImageSelect(e.dataTransfer.files[0]);
  };

  /* ================== SUBMIT ================== */
  const handleSubmit = async () => {
    // ===== VALIDATION =====
    if (title.length < TITLE_MIN || title.length > TITLE_MAX) {
      showAlert(`Judul ${TITLE_MIN}–${TITLE_MAX} karakter`, "warning");
      return;
    }

    if (desc.length < DESC_MIN || desc.length > DESC_MAX) {
      showAlert(`Deskripsi ${DESC_MIN}–${DESC_MAX} karakter`, "warning");
      return;
    }

    if (detail.length < DETAIL_MIN || detail.length > DETAIL_MAX) {
      showAlert(`Detail ${DETAIL_MIN}–${DETAIL_MAX} karakter`, "warning");
      return;
    }

    if (!editMode && !image) {
      showAlert("Gambar wajib diupload", "warning");
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
        resetForm();
      }
    } catch (e) {
      showAlert(e.message || "Gagal menyimpan materi", "error");
    } finally {
      hideLoading();
    }
  };

  /* ================== UI ================== */
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 420, p: 3 }}>
        <Typography variant="h6" mb={2}>
          {editMode ? "Edit Materi" : "Tambah Materi"}
        </Typography>

        {/* ================= IMAGE UPLOAD ================= */}
        <Box
          onClick={() => fileInputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          sx={{
            border: "2px dashed #cbd5e1",
            borderRadius: 2,
            p: 3,
            mb: 2,
            textAlign: "center",
            cursor: "pointer",
            bgcolor: "#fafafa",
          }}
        >
          {preview ? (
            <img
              src={preview}
              alt="preview"
              style={{
                width: "100%",
                maxHeight: 180,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          ) : (
            <>
              <Typography fontSize={40} color="text.secondary">
                +
              </Typography>
              <Typography>
                Click or drag image to upload avatar
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Image size max 2MB
              </Typography>
            </>
          )}

          <input
            ref={fileInputRef}
            hidden
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </Box>

        {/* ================= FORM ================= */}
        <TextField
          label="Judul"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          helperText={`${title.length}/${TITLE_MAX}`}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Deskripsi"
          fullWidth
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          helperText={`${desc.length}/${DESC_MAX}`}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Detail Materi"
          fullWidth
          multiline
          rows={5}
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          helperText={`${detail.length}/${DETAIL_MAX}`}
          sx={{ mb: 3 }}
        />

        {/* ================= ACTION ================= */}
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
