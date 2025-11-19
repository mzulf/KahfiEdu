import { Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, IconButton, Menu, MenuItem, Stack, Typography } from "@mui/material";
import { HiDotsVertical, HiEye } from "react-icons/hi";
import { capitalizeWords } from "../../../utils/formatedFont";
import { useState } from "react";
import { useConfirm } from "../../../hooks/useConfirm";
import useAlert from "../../../hooks/useAlert";
import { useLoading } from "../../../hooks/useLoading";
import courseService from "../../../services/courseService";
import { getBadges } from "../../../utils/badgeUtils";
import { useNavigate } from "react-router-dom";
import { stripHtml } from "../../../utils/scriptHtml";

export default function CardCourse({ course, refreshData }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const { showAlert } = useAlert();
    const { showLoading, hideLoading } = useLoading();
    const open = Boolean(anchorEl);
    const confirm = useConfirm();
    const navigate = useNavigate()


    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

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
                    refreshData();
                }
            } catch (error) {
                showAlert(error.message, 'error');
            } finally {
                hideLoading();
            }
        }
    };

    const handleToDetail = (courseId) => {
        navigate(`/admin/course/detail?courseId=${courseId}`);
        window.scrollTo(0, 0); // scroll ke atas setelah navigasi
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
                    refreshData();
                }
            } catch (error) {
                showAlert(error.message, 'error');
            } finally {
                hideLoading();
            }
        }
    };

    const courseBadges = getBadges("course", course);

    return (
        <Card
            sx={{
                position: "relative",
                boxShadow: 3,
                overflow: "hidden",
            }}
        >
            {courseBadges.length > 0 && (
                <Box
                    sx={{
                        position: "absolute",
                        display: "flex",
                        gap: 1,
                        zIndex: 2,
                    }}
                >
                    {courseBadges.map((badge, idx) => (
                        <Box
                            key={idx}
                            sx={{
                                backgroundColor: badge.color,
                                color: "white",
                                px: 1,
                                py: 0.5,
                                fontSize: "0.75rem",
                                fontWeight: "bold",
                                boxShadow: 1,
                            }}
                        >
                            {badge.label}
                        </Box>
                    ))}
                </Box>
            )}

            <Box
                sx={{
                    position: "absolute",
                    display: "flex",
                    top: 2,
                    right: 2,
                    zIndex: 2,
                }}
            >
                <IconButton onClick={handleMenuClick}>
                    <HiDotsVertical color="white" />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                    {course.deletedAt ?
                        <MenuItem onClick={() => { handleClose(); handleRestoreCourse(course) }}>Restore</MenuItem>
                        : <MenuItem onClick={() => { handleClose(); navigate(`/admin/course/edit?courseId=${course.id}`); window.scrollTo(0, 0) }}>Edit</MenuItem>
                    }
                    <MenuItem onClick={() => { handleClose(); handleDeleteCourse(course) }}>Hapus</MenuItem>
                </Menu>
            </Box>

            {/* Gambar Thumbnail */}
            <Box sx={{ position: "relative", height: 250, overflow: "hidden" }}>
                {/* Gambar */}
                <CardMedia
                    component="img"
                    image={course.thumbnail}
                    alt={course.title}
                    sx={{
                        transition: "transform 0.3s ease",
                        width: "100%",
                        height: "100%",
                        objectFit: "fit",
                        "&:hover": {
                            transform: "scale(1.03)",
                        },
                    }}
                />
                {/* Overlay gelap */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.25)", // atur tingkat kegelapan
                    }}
                />
            </Box>
            <CardContent>
                <Stack spacing={1}>
                    <Box>
                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            sx={{ fontFamily: "Poppins" }}
                        >
                            {course.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {course.formattedCreatedAt}
                        </Typography>
                    </Box>
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: "0.8rem",
                            textAlign: "justify",
                            maxHeight: 100,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 5,
                            WebkitBoxOrient: "vertical",
                        }}
                        dangerouslySetInnerHTML={{ __html: course.description }}
                    />
                    <Typography variant="caption" color="text.secondary">
                        {capitalizeWords(course.category?.name)} — {course.level}
                    </Typography>
                </Stack>
                <Box display="flex" justifyContent="end">
                    <Button
                        size="small"
                        startIcon={
                            <HiEye />
                        }
                        onClick={() => handleToDetail(course.id)}
                    >
                        Preview
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}
