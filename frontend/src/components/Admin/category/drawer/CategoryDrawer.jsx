import {
    Box,
    Button,
    Drawer,
    TextField,
    Typography,
    MenuItem,
    Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import useAlert from "../../../../hooks/useAlert";
import { useForm, Controller } from "react-hook-form";
import categoryService from "../../../../services/categoryService";

export default function CategoryDrawer({
    open,
    onClose,
    editMode,
    data,
    onSuccess,
}) {
    const [submitting, setSubmitting] = useState(false);
    const { showAlert } = useAlert();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: "",
            isActive: true,
        },
    });

    useEffect(() => {
        if (open) {
            if (editMode && data) {
                reset({
                    name: data.name,
                    isActive: data.isActive,
                });
            } else {
                reset({
                    name: "",
                    isActive: true,
                });
            }
        }
    }, [open, editMode, data, reset]);

    const onSubmit = async (formData) => {
        try {
            setSubmitting(true);

            const response = editMode
                ? await categoryService.updateCategory(data.id, formData)
                : await categoryService.createCategory(formData);

            if (response.success) {
                showAlert(response.message ?? "Kategori berhasil diproses", "success");
                onSuccess();
                onClose();
            } else {
                showAlert(response.message ?? "Terjadi kesalahan", "error");
            }
        } catch (error) {
            showAlert(error.message ?? "Gagal menyimpan kategori", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: 400, p: 3 }}>
                <Typography variant="h6" mb={2}>
                    {editMode ? "Edit Kategori" : "Tambah Kategori"}
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Stack spacing={2}>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: "Nama kategori wajib diisi" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Nama Kategori"
                                    fullWidth
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                            )}
                        />

                        <Controller
                            name="isActive"
                            control={control}
                            rules={{
                                validate: (value) =>
                                    typeof value === "boolean" || "Status aktif wajib dipilih",
                            }}
                            render={({ field }) => (
                                <TextField
                                    select
                                    label="Status Aktif"
                                    fullWidth
                                    error={!!errors.isActive}
                                    helperText={errors.isActive?.message}
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value === "true")}
                                >
                                    <MenuItem value="true">Aktif</MenuItem>
                                    <MenuItem value="false">Tidak Aktif</MenuItem>
                                </TextField>
                            )}
                        />

                        <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
                            <Button onClick={onClose} color="secondary">
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={submitting}
                                sx={{ bgcolor: "#008B47", "&:hover": { bgcolor: "#006f3d" } }}
                            >
                                {submitting ? "Menyimpan..." : "Simpan"}
                            </Button>
                        </Box>
                    </Stack>
                </form>
            </Box>
        </Drawer>
    );
}
