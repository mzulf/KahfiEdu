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
import jobService from "../../../../services/jobService";
import { capitalizeWords } from "../../../../utils/formatedFont";

const employmentTypes = ["full-time", "part-time", "contract", "internship"];

export default function JobDrawer({
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
            title: "",
            description: "",
            location: "",
            position: "",
            employmentType: "",
            urlLink: ""
        },
    });

    useEffect(() => {
        if (open) {
            if (editMode && data) {
                reset({
                    title: data.title,
                    description: data.description,
                    location: data.location,
                    position: data.position,
                    employmentType: data.employmentType,
                    urlLink: data.urlLink,
                });
            } else {
                reset({
                    title: "",
                    description: "",
                    location: "",
                    position: "",
                    employmentType: "",
                    urlLink: ""
                });
            }
        }
    }, [open, editMode, data, reset]);

    const onSubmit = async (formData) => {
        try {
            setSubmitting(true);

            const response = editMode
                ? await jobService.updateJob(data.id, formData)
                : await jobService.createJob(formData);

            if (response.success) {
                showAlert(response.message ?? "Job berhasil diproses", "success");
                onSuccess();
                onClose();
            } else {
                showAlert(response.message ?? "Terjadi kesalahan", "error");
            }
        } catch (error) {
            showAlert(error.message ?? "Gagal menyimpan job", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: 400, p: 3 }}>
                <Typography variant="h6" mb={2}>
                    {editMode ? "Edit Lowongan" : "Tambah Lowongan"}
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Stack spacing={2}>
                        <Controller
                            name="title"
                            control={control}
                            rules={{ required: "Judul wajib diisi" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Judul"
                                    fullWidth
                                    error={!!errors.title}
                                    helperText={errors.title?.message}
                                />
                            )}
                        />

                        <Controller
                            name="position"
                            control={control}
                            rules={{ required: "Posisi wajib diisi" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Posisi"
                                    fullWidth
                                    error={!!errors.position}
                                    helperText={errors.position?.message}
                                />
                            )}
                        />

                        <Controller
                            name="location"
                            control={control}
                            rules={{ required: "Lokasi wajib diisi" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Lokasi"
                                    fullWidth
                                    error={!!errors.location}
                                    helperText={errors.location?.message}
                                />
                            )}
                        />

                        <Controller
                            name="employmentType"
                            control={control}
                            rules={{ required: "Tipe pekerjaan wajib diisi" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Tipe Pekerjaan"
                                    select
                                    fullWidth
                                    error={!!errors.employmentType}
                                    helperText={errors.employmentType?.message}
                                >
                                    {employmentTypes.map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {capitalizeWords(type)}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />

                        <Controller
                            name="description"
                            control={control}
                            rules={{ required: "Deskripsi wajib diisi" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Deskripsi"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    error={!!errors.description}
                                    helperText={errors.description?.message}
                                />
                            )}
                        />

                        <Controller
                            name="urlLink"
                            control={control}
                            rules={{ required: "Link wajib diisi" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Link Form"
                                    fullWidth
                                    error={!!errors.title}
                                    helperText={errors.title?.message}
                                />
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
