import { useState, useEffect } from 'react';
import {
    Typography,
    Button,
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Stack,
    TextField,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TagIcon from '@mui/icons-material/Tag';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate, useSearchParams } from 'react-router-dom';
import blogService from '../../../services/blogService';
import { useLoading } from '../../../hooks/useLoading';
import useAlert from '../../../hooks/useAlert';

const BlogDetailAdmin = () => {
    const navigate = useNavigate();
    const { showLoading, hideLoading } = useLoading();
    const { showAlert } = useAlert();
    const [blogData, setBlogData] = useState(null);
    const [searchParams] = useSearchParams();
    const blogId = searchParams.get('blogId');

    const fetchBlog = async () => {
        if (!blogId) {
            showAlert("Id Blog tidak ditemukan", "error");
            return;
        }

        showLoading();
        try {
            const res = await blogService.getBlogById({ blogId });
            if (res.success) {
                setBlogData(res.blog);
            } else {
                showAlert("Blog tidak ditemukan", "error");
            }
        } catch (error) {
            showAlert(error.message || 'Terjadi kesalahan', "error");
        } finally {
            hideLoading();
        }
    };

    useEffect(() => {
        fetchBlog();
    }, []);

    const getStatusColor = (status) => {
        if (status) {
            return 'primary';
        } else {
            return 'error'
        }
    };

    const getPublishColor = (publish) => {
        if (publish) {
            return { backgroundColor: 'success.light', color: 'white' };
        } else {
            return { backgroundColor: 'grey.200', color: 'grey.800' };
        }
    };

    if (!blogData) return <Typography>Loading...</Typography>;

    return (
        <Box sx={{ minHeight: '100vh', p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Button
                    variant="contained"
                    sx={{ backgroundColor: 'grey.600', '&:hover': { backgroundColor: 'grey.700' } }}
                    startIcon={<ArrowBackIcon fontSize="small" />}
                    onClick={() => navigate("/admin/blog")}
                >
                    Back
                </Button>
                <Stack direction="row" spacing={1.5}>
                    <Button variant="contained" color="primary" onClick={() => navigate(`/admin/blog/edit?blogId=${blogData.id}`)} startIcon={<EditIcon fontSize="small" />}>Edit</Button>
                    <Button variant="contained" color="error" startIcon={<DeleteIcon fontSize="small" />}>Delete</Button>
                </Stack>
            </Box>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Stack spacing={3}>
                        <Card>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="h6">Image</Typography>
                                    <Box display="flex" alignItems="center" gap={1}>

                                        <Chip
                                            label={blogData?.isPublish ? "Publish" : "Draft"}
                                            color={getStatusColor(blogData.isPublish)}
                                            size="small"
                                        />
                                        {blogData.isFeatured &&

                                            <Chip
                                                label={blogData?.isFeatured ? "Di Fiturkan" : ""}
                                                color={getStatusColor(blogData.isFeatured)}
                                                size="small"
                                            />
                                        }
                                    </Box>
                                </Box>
                                <CardMedia
                                    component="img"
                                    height="192"
                                    image={blogData.thumbnail}
                                    alt="Blog"
                                    sx={{ borderRadius: 2, objectFit: 'cover' }}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent>
                                <Typography variant="h6" mb={2}>Basic Information</Typography>
                                <Stack spacing={2}>
                                    <TextField
                                        label="Title"
                                        value={blogData.title}
                                        InputProps={{ readOnly: true }}
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                    />
                                    {/* <TextField
                                        label="Slug"
                                        value={blogData.basicInfo.slug}
                                        InputProps={{ readOnly: true }}
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                    /> */}
                                </Stack>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent>
                                <Typography variant="h6" mb={2}>Status Information</Typography>
                                <Stack spacing={1.5}>
                                    {/* <Box display="flex" justifyContent="space-between">
                                        <Typography>Status</Typography>
                                        <Chip
                                            label={blogData.statusInfo.status}
                                            color={getStatusColor(blogData.statusInfo.status)}
                                            size="small"
                                        />
                                    </Box> */}
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography>Publish</Typography>
                                        <Chip
                                            label={blogData.isPublish ? "Publihs" : "Draft"}
                                            size="small"
                                            sx={getPublishColor(blogData.isPublish)}
                                        />
                                    </Box>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography>Di Fiturkan</Typography>
                                        <Chip
                                            label={blogData.isFeatured ? "Iya" : "Tidak"}
                                            size="small"
                                            sx={getPublishColor(blogData.isFeatured)}
                                        />
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent>
                                <Typography variant="h6" mb={2}>Date Information</Typography>
                                <Stack spacing={1.5}>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography display="flex" gap={1}><CalendarTodayIcon fontSize="small" />Created</Typography>
                                        <Typography>{blogData.formattedCreatedAt}</Typography>
                                    </Box>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography display="flex" gap={1}><AccessTimeIcon fontSize="small" />Updated</Typography>
                                        <Typography>{blogData.formattedUpdatedAt}</Typography>
                                    </Box>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography display="flex" gap={1}><DeleteIcon fontSize="small" />Deleted</Typography>
                                        <Typography>{blogData.formattedUpdatedAt}</Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent>
                                <Typography variant="h6" display="flex" alignItems="center" gap={1} mb={2}>
                                    <TagIcon fontSize="small" /> Tags
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                    {Array.isArray(blogData.tags)
                                        ? blogData.tags.map((tag, idx) => (
                                            <Chip
                                                key={idx}
                                                label={tag}
                                                size="small"
                                                sx={{ border: '1px solid', borderColor: 'grey.300' }}
                                            />
                                        ))
                                        : JSON.parse(blogData.tags || '[]').map((tag, idx) => (
                                            <Chip
                                                key={idx}
                                                label={tag}
                                                size="small"
                                                sx={{ border: '1px solid', borderColor: 'grey.300' }}
                                            />
                                        ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>

                <Grid size={{ xs: 12, md: 9 }}>
                    <Card>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" mb={2}>
                                <Box>
                                    <Typography variant="h4" fontWeight="bold" mb={1}>{blogData.title}</Typography>
                                    <Typography display="flex" alignItems="center" gap={0.5} color="grey.600">
                                        <CalendarTodayIcon fontSize="small" /> {blogData.formattedCreatedAt}
                                    </Typography>
                                </Box>
                                <CardMedia
                                    component="img"
                                    image={blogData.thumbnail}
                                    alt="Preview"
                                    sx={{ width: 128, height: 96, objectFit: 'cover', borderRadius: 2 }}
                                />
                            </Box>

                            <Typography variant="h6" mb={2}>Description</Typography>
                            <Typography textAlign="justify" sx={{ lineHeight: 1.75 }}>{blogData.description}</Typography>

                            <Box mt={3} pt={2} borderTop={1} borderColor="grey.200">
                                <Typography variant="body2" display="flex" alignItems="center" gap={1} mb={1}>
                                    <TagIcon fontSize="small" /> <Typography component="span" fontWeight="medium">Tags:</Typography>
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                    {Array.isArray(blogData.tags)
                                        ? blogData.tags.map((tag, idx) => (
                                            <Chip
                                                key={idx}
                                                label={tag}
                                                size="small"
                                                sx={{ border: '1px solid', borderColor: 'grey.300' }}
                                            />
                                        ))
                                        : JSON.parse(blogData.tags || '[]').map((tag, idx) => (
                                            <Chip
                                                key={idx}
                                                label={tag}
                                                size="small"
                                                sx={{ border: '1px solid', borderColor: 'grey.300' }}
                                            />
                                        ))}
                                </Stack>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default BlogDetailAdmin;