import { useState, useEffect } from "react";
import useAlert from "../../../../hooks/useAlert";
import { useForm, Controller } from "react-hook-form";
import classService from "../../../../services/classService";
import {
    Box,
    Button,
    CircularProgress,
    Drawer,
    IconButton,
    MenuItem,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import { HiOutlineXCircle } from "react-icons/hi";
import AvatarUpload from "../../user/drawer/AvatarUpload";

function ClassDrawer({
    open,
    onClose,
    editMode,
    data,
    teachers = [],
    courses = [],
    onSuccess
}) {
    const [submitting, setSubmitting] = useState(false);
    const { showAlert } = useAlert();

    const { control, handleSubmit, reset, formState: { errors }, setValue } = useForm({
        defaultValues: {
            name: "",
            schedule: "",
            startDate: "",
            endDate: "",
            courseId: "",
            teacherId: "",
            status: "",
        }
    });

    useEffect(() => {
        if (open) {
            if (editMode && data) {
                reset({
                    name: data.name,
                    schedule: data.schedule,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    status: data.status,
                    courseId: data.courseId,
                    teacherId: data.teacherId,
                });
            } else {
                reset({
                    name: "",
                    schedule: "",
                    startDate: "",
                    endDate: "",
                    courseId: "",
                    teacherId: "",
                    status: "",
                });
            }
        }
    }, [open, editMode, data, reset]);

    const onSubmit = async (formData) => {
        try {
            setSubmitting(true);

            const response = editMode
                ? await classService.updateClass(data.id, formData)
                : await classService.createClass(formData);

            if (response.success) {
                showAlert(response.message ?? "Class berhasil diproses", "success");
                onSuccess();
                onClose();
            } else {
                showAlert(response.message ?? "Terjadi kesalahan", "error");
            }
        } catch (error) {
            showAlert(error.message ?? "Gagal menyimpan class", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{ sx: { width: { xs: "100%", sm: 400 } } }}
        >
            <Box sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6">{editMode ? "Edit Class" : "Add New Class"}</Typography>
                    <IconButton onClick={onClose} edge="end">
                        <HiOutlineXCircle size={32} className="text-red-500" />
                    </IconButton>
                </Box>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={2}>
                        <Controller
                            name="courseId"
                            control={control}
                            rules={{ required: "Course wajib dipilih" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Course"
                                    select
                                    fullWidth
                                    error={!!errors.courseId}
                                    helperText={errors.courseId?.message}
                                >
                                    {courses.map((course) => (
                                        <MenuItem key={course.id} value={course.id}>
                                            {course.title}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />

                        <Controller
                            name="teacherId"
                            control={control}
                            rules={{ required: "Guru wajib dipilih" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Teacher"
                                    select
                                    fullWidth
                                    error={!!errors.teacherId}
                                    helperText={errors.teacherId?.message}
                                >
                                    {teachers.map((teacher) => (
                                        <MenuItem key={teacher.id} value={teacher.id}>
                                            {teacher.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />

                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: "Nama kelas wajib diisi" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Nama Kelas"
                                    fullWidth
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                            )}
                        />

                        <Controller
                            name="schedule"
                            control={control}
                            rules={{ required: "Jadwal wajib diisi" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Jadwal"
                                    fullWidth
                                    error={!!errors.schedule}
                                    helperText={errors.schedule?.message}
                                />
                            )}
                        />

                        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                            <Controller
                                name="startDate"
                                control={control}
                                rules={{ required: "Tanggal mulai wajib diisi" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Tanggal Mulai"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                        error={!!errors.startDate}
                                        helperText={errors.startDate?.message}
                                    />
                                )}
                            />

                            <Controller
                                name="endDate"
                                control={control}
                                rules={{ required: "Tanggal selesai wajib diisi" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Tanggal Selesai"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                        error={!!errors.endDate}
                                        helperText={errors.endDate?.message}
                                    />
                                )}
                            />
                        </Box>

                        <Controller
                            name="status"
                            control={control}
                            rules={{ required: "Status wajib dipilih" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Status"
                                    select
                                    fullWidth
                                    error={!!errors.status}
                                    helperText={errors.status?.message}
                                >
                                    <MenuItem value="akan datang">Akan Datang</MenuItem>
                                    <MenuItem value="berjalan">Berjalan</MenuItem>
                                    <MenuItem value="selesai">Selesai</MenuItem>
                                </TextField>
                            )}
                        />
                    </Stack>

                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                        <Button onClick={onClose} variant="outlined" disabled={submitting}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                bgcolor: "#1B986E",
                                "&:hover": { bgcolor: "#157A58" }
                            }}
                            disabled={submitting}
                            startIcon={submitting ? <CircularProgress size={20} /> : null}
                        >
                            {submitting ? "Saving..." : editMode ? "Update" : "Create"}
                        </Button>
                    </Box>
                </form>
            </Box>
        </Drawer>
    );
}

export default ClassDrawer;
