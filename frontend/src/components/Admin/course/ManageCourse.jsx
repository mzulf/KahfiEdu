import { Box, Button, CircularProgress, Grid, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import useAlert from "../../../hooks/useAlert";
import { HiReply } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import courseService from "../../../services/courseService";
import ThumbnailCard from "./ThumbnailCard";
import GeneralInfoCard from "./GeneralInfoCard";
import SettingsCard from "./SettingCard";
import CategoryLevelCard from "./CategoryLevelCard";
import { useForm } from "react-hook-form";

export default function ManageCourse({ editMode, course, categories }) {
    const [submitting, setSubmitting] = useState(false);
    const { showAlert } = useAlert();
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (thumbnailFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setThumbnailPreview(e.target.result);
            };
            reader.readAsDataURL(thumbnailFile);
        }
    }, [thumbnailFile]);

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: "",
            description: "",
            categoryId: "",
            level: "",
            isPublish: false,
            isFeatured: false,
        },
    });

    useEffect(() => {
        resetForm();
    }, [editMode, course]);

    const resetForm = () => {
        if (editMode && course) {
            reset({
                title: course.title || "",
                description: course.description || "",
                categoryId: course.categoryId || "",
                level: course.level || "",
                isPublish: course.isPublish || false,
                isFeatured: course.isFeatured || false,
            });
            setThumbnailFile(null);
            setThumbnailPreview(course.thumbnail)
        } else {
            reset({
                title: "",
                description: "",
                categoryId: "",
                level: "",
                isPublish: false,
                isFeatured: false,
            });
            setThumbnailFile(null);
            setThumbnailPreview(null)
        }
    };

    const onSubmit = async (data) => {
        try {
            setSubmitting(true);

            const response = editMode
                ? await courseService.updateCourse(course.id, data, thumbnailFile)
                : await courseService.createCourse(data, thumbnailFile);

            if (response.success) {
                showAlert(response.message, "success");
                navigate(`/admin/course/detail?courseId=${response.course.id}`)
            }
        } catch (error) {
            showAlert(error.message, "error");
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                <Grid size={12} display="flex" justifyContent="space-between" gap={2}>
                    <Button startIcon={<HiReply />} variant="contained" color="inherit" onClick={() => { navigate(-1); window.scrollTo(0, 0) }}>
                        Kembali
                    </Button>
                    <Box>
                        <Button variant="contained" onClick={() => reset()} disabled={submitting} color="error">
                            Reset
                        </Button>
                        <Button
                            variant="contained"
                            type="submit"
                            sx={{ bgcolor: "#008B47", ml: 2 }}
                            disabled={submitting}
                            startIcon={submitting && <CircularProgress size={20} />}
                        >
                            {submitting ? "Saving..." : editMode ? "Update" : "Buat"}
                        </Button>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Stack spacing={2}>
                        <GeneralInfoCard control={control} errors={errors} submitting={submitting} />
                    </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Stack spacing={2}>
                        <ThumbnailCard
                            editMode={editMode}
                            data={course}
                            thumbnailPreview={thumbnailPreview}
                            onSelectFile={setThumbnailFile}
                        />
                        <SettingsCard control={control} />
                        <CategoryLevelCard control={control} errors={errors} categories={categories} submitting={submitting} />
                    </Stack>
                </Grid>
            </Grid>
        </form>
    )
}
