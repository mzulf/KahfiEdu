import { Box, Button, Card, CardContent, CircularProgress, Grid, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import useAlert from "../../../hooks/useAlert";
import { HiReply } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import blogService from "../../../services/blogService";
import { Controller, useForm } from "react-hook-form";
import ThumbnailCard from "../course/ThumbnailCard";
import GeneralInfoCard from "../course/GeneralInfoCard";
import SettingsCard from "../course/SettingCard";

export default function ManageBlog({ editMode, blog }) {
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
            tags: "",
            isPublish: false,
            isFeatured: false,
        },
    });

    useEffect(() => {
        resetForm();
    }, [editMode, blog]);

    const resetForm = () => {
        if (editMode && blog) {
            reset({
                title: blog.title || "",
                description: blog.description || "",
                tags: blog.tags || "",
                isPublish: blog.isPublish || false,
                isFeatured: blog.isFeatured || false,
            });
            setThumbnailFile(null);
            setThumbnailPreview(blog.thumbnail)
        } else {
            reset({
                title: "",
                description: "",
                tags: "",
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

            const parsedTags = data.tags
                ? data.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
                : [];

            const payload = {
                ...data,
                tags: parsedTags,
            };

            console.log("data yang dikirim", payload)

            const response = editMode
                ? await blogService.updateBlog(blog.id, payload, thumbnailFile)
                : await blogService.createBlog(payload, thumbnailFile);

            if (response.success) {
                showAlert(response.message, "success");
                navigate(`/admin/blog/detail?blogId=${response.blog.id}`)
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
                            data={blog}
                            thumbnailPreview={thumbnailPreview}
                            onSelectFile={setThumbnailFile}
                        />
                        <SettingsCard control={control} />
                        <Card>
                            <CardContent>
                                <Controller
                                    name="tags"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Tags (pisahkan dengan koma)"
                                            variant="outlined"
                                            fullWidth
                                            placeholder="contoh: belajar, muslim, tajhuid"
                                        />
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>
            </Grid>
        </form>
    )
}
