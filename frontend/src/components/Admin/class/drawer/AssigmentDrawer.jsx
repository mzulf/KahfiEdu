import {
    Drawer,
    Box,
    Typography,
    IconButton,
    TextField,
    Button,
    Divider,
    CircularProgress
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import assignmentService from "../../../../services/assigmentService";

export default function AssigmentDrawer({
    open,
    classId,
    className,
    onClose,
    editMode,
    data,
    onSuccess,
    showAlert
}) {
    const [submitting, setSubmitting] = useState(false);
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: "",
            classId: classId,
            description: "",
            dueDate: "",
        }
    });

    useEffect(() => {
        if (open) {
            if (editMode && data) {
                reset({
                    title: data.title,
                    classId: data.classId,
                    description: data.description,
                    dueDate: data.dueDate, // potong waktu jika ISO format
                });
            } else {
                reset({
                    title: "",
                    classId: classId,
                    description: "",
                    dueDate: "",
                });
            }
        }
    }, [open, editMode, data, classId, reset]);

    const onSubmit = async (formData) => {
        try {
            setSubmitting(true);

            const response = editMode
                ? await assignmentService.updateAssignment(data.id, formData)
                : await assignmentService.createAssignment(formData);

            if (response.success) {
                showAlert(response.message ?? "Tugas berhasil disimpan", "success");
                onSuccess?.();
                onClose();
            } else {
                showAlert(response.message ?? "Terjadi kesalahan", "error");
            }
        } catch (error) {
            showAlert(error.message ?? "Gagal menyimpan tugas", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: 400, p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight="bold">
                        {editMode ? "Edit Tugas" : "Tambah Tugas"}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Typography variant="body2" mb={2} color="text.secondary">
                    {className && `Kelas: ${className}`}
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Controller
                        name="classId"
                        control={control}
                        render={({ field }) => (
                            <input type="hidden" {...field} />
                        )}
                    />
                    <Controller
                        name="title"
                        control={control}
                        rules={{ required: "Judul tugas wajib diisi" }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Judul Tugas"
                                fullWidth
                                margin="normal"
                                error={!!errors.title}
                                helperText={errors.title?.message}
                            />
                        )}
                    />

                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Deskripsi"
                                fullWidth
                                multiline
                                rows={4}
                                margin="normal"
                            />
                        )}
                    />

                    <Controller
                        name="dueDate"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Batas Pengumpulan"
                                type="date"
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        )}
                    />

                    <Divider sx={{ my: 2 }} />

                    <Box display="flex" justifyContent="flex-end" gap={1}>
                        <Button onClick={onClose} disabled={submitting}>
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={submitting}
                            startIcon={submitting && <CircularProgress size={20} />}
                        >
                            Simpan
                        </Button>
                    </Box>
                </form>
            </Box>
        </Drawer>
    );
}
