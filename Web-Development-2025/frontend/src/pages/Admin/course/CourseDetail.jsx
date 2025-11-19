import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"
import useAlert from "../../../hooks/useAlert";
import { useLoading } from "../../../hooks/useLoading";
import { Box, Button, Card, CardContent, CardMedia, Grid, Stack, TextField, Typography } from "@mui/material";
import courseService from "../../../services/courseService";
import { capitalizeWords } from "../../../utils/formatedFont";
import { HiPencil, HiReply, HiTrash } from "react-icons/hi";
import InfoCourseDetail from "../../../components/Admin/course/InfoCourseDetail";
import ClassListCard from "../../../components/Admin/course/ClassListCard";
import { useConfirm } from "../../../hooks/useConfirm";

function CourseDetail() {
    const [course, setCourse] = useState(null);
    const { showLoading, hideLoading } = useLoading();
    const { showAlert } = useAlert();
    const [searchParams] = useSearchParams()
    const courseId = searchParams.get('courseId')
    const navigate = useNavigate()
    const confirm = useConfirm()

    const fetchCourse = async () => {
        if (!courseId) {
            showAlert("Id Course tidak ditemukan", "error")
            return;
        };
        showLoading();
        try {
            const res = await courseService.getCourseById(courseId);
            if (res.success) {
                setCourse(res.course);
            }
        } catch (error) {
            showAlert(error.message, "error");
        } finally {
            hideLoading();
        }
    };

    useEffect(() => {
        fetchCourse()
    }, []);

    const handleDeleteCourse = async (course) => {
        const confirmed = await confirm({
            title: course.deletedAt ? "Hapus Permanen" : "Hapus (Soft Delete)",
            message: `Yakin ingin hapus ${course.title}?`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'error'
        });

        if (confirmed) {
            showLoading();
            try {
                const res = await courseService.deleteCourse(course.id);
                if (res.success) {
                    showAlert(res.message, 'success');
                    fetchCourse()
                }
            } catch (error) {
                showAlert(error.message, 'error');
            } finally {
                hideLoading();
            }
        }
    };

    const handleRestoreCourse = async (course) => {
        const confirmed = await confirm({
            title: `Pulihkan Course`,
            message: `Pulihkan course ${course.name}?`,
            confirmText: 'Restore',
            cancelText: 'Cancel',
            type: 'warning'
        });

        if (confirmed) {
            showLoading();
            try {
                const res = await courseService.restoreCourse(course.id);
                if (res.success) {
                    showAlert(res.message, 'success');
                    fetchCourse()
                }
            } catch (error) {
                showAlert(error.message, 'error');
            } finally {
                hideLoading();
            }
        }
    };

    if (!course) {
        return (
            <Box>
                <Typography textAlign="center">Course tidak ditemukan</Typography>
            </Box>
        )
    }
    return (
        <Grid container spacing={2}>
            <Grid size={12} display="flex" justifyContent="space-between" alignItems="center">
                <Button startIcon={<HiReply />} variant="contained" color="inherit" onClick={() => { navigate("/admin/course"); window.scrollTo(0, 0) }}>
                    Kembali
                </Button>
                <Box>
                    {course.deletedAt ? (
                        <Button startIcon={<HiReply />} variant="contained" color="warning" onClick={() => handleRestoreCourse(course)}>
                            Restore
                        </Button>
                    ) : (
                        <Button startIcon={<HiPencil />} variant="contained" color="info" onClick={() => { navigate(`/admin/course/edit?courseId=${course.id}`); window.scrollTo(0, 0) }}>
                            Edit
                        </Button>
                    )}
                    <Button sx={{ ml: 2 }} startIcon={<HiTrash />} variant="contained" color="error" onClick={() => { handleDeleteCourse(course) }}>
                        Delete
                    </Button>
                </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
                <Stack spacing={2}>
                    <InfoCourseDetail course={course} />
                    <ClassListCard course={course} />
                </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <Stack spacing={2}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" mb={1}>Thumbnail</Typography>
                            <CardMedia
                                component="img"
                                image={course.thumbnail}
                                alt={course.title}
                                sx={{
                                    width: "100%",
                                    height: "200px",
                                    objectFit: "contain",
                                }}
                            />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" mb={1}>Kategori & Level</Typography>
                            <div>
                                <Typography className="text-lg font-bold font-poppins">Kategori</Typography>
                                <TextField
                                    id="course-category-name"
                                    fullWidth
                                    disabled
                                    value={capitalizeWords(course.category.name)}
                                />
                            </div>
                            <div className="mt-2">
                                <Typography className="text-lg font-bold font-poppins">Tingkatan</Typography>
                                <TextField
                                    id="course-category-name"
                                    fullWidth
                                    disabled
                                    value={capitalizeWords(course.level)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </Stack>
            </Grid>
        </Grid>
    )
}

export default CourseDetail
