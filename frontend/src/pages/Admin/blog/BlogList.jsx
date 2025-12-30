import {
    Typography,
    IconButton,
    Button,
    Drawer,
    Box,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Chip,
    Pagination,
    Stack,
    Menu,
    MenuItem,
    CardActions,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterBlog from '../../../components/Admin/blog/FIlterBlog';
import blogService from '../../../services/blogService';
import { HiDotsVertical, HiEye } from 'react-icons/hi';
import { useLoading } from '../../../hooks/useLoading';
import useAlert from '../../../hooks/useAlert';
import { useConfirm } from '../../../hooks/useConfirm';
import { getBadges } from '../../../utils/badgeUtils';

const BlogListAdmin = () => {
    const [blogs, setBlogs] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);
    const [totalRows, setTotalRows] = useState(0);
    const [filters, setFilters] = useState({ search: "", tags: [] });
    const [status, setStatus] = useState("all");
    const [isFeatured, setIsFeatured] = useState(null);
    const [isPublish, setIsPublish] = useState(null);
    const [availableTags, setAvailableTags] = useState([]);
    const { showLoading, hideLoading } = useLoading();
    const { showAlert } = useAlert();
    const confirm = useConfirm();
    const navigate = useNavigate();
    const [menuAnchorEls, setMenuAnchorEls] = useState({});

    const fetchBlogs = async () => {
        showLoading();
        try {
            const res = await blogService.getBlogs({
                page: page + 1,
                limit: rowsPerPage,
                status,
                search: filters.search,
                tags: filters.tags.join(","),
                isFeatured,
                isPublish,
            });
            if (res.success) {
                setBlogs(res.blogs);
                setTotalRows(res.meta?.total || 0);
            }
        } catch (error) {
            showAlert(error.message, "error");
        } finally {
            hideLoading();
        }
    };

    const fetchTags = async () => {
        try {
            const res = await blogService.getTags();
            if (res.success) {
                setAvailableTags(res.tags || []);
            }
        } catch (error) {
            console.error("Gagal mengambil tags:", error);
        }
    };

    useEffect(() => {
        fetchTags();
        fetchBlogs();
    }, [page, rowsPerPage, filters, status, isFeatured, isPublish]);

    const handleResetFilter = () => {
        setFilters({ search: "", tags: [] });
        setStatus("all");
        setIsFeatured(null);
        setIsPublish(null);
    };

    const handleRowsPerPageChange = (value) => {
        setRowsPerPage(value);
        setPage(0);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage - 1);
    };

    const navigateToCreate = () => {
        navigate("/admin/blog/create");
        window.scrollTo(0, 0);
    };

    const handleDeleteBlog = async (blog) => {
        const confirmed = await confirm({
            title: blog.deletedAt ? "Hapus Permanen" : "Hapus (Soft Delete)",
            message: `Yakin ingin hapus ${blog.title}?`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'error'
        });

        if (confirmed) {
            showLoading();
            try {
                const res = await blogService.deleteBlog(blog.id);
                if (res.success) {
                    showAlert(res.message, 'success');
                    fetchBlogs();
                }
            } catch (error) {
                showAlert(error.message, 'error');
            } finally {
                hideLoading();
            }
        }
    };

    const handleRestoreBlog = async (blog) => {
        const confirmed = await confirm({
            title: `Pulihkan Blog`,
            message: `Pulihkan blog ${blog.title}?`,
            confirmText: 'Restore',
            cancelText: 'Cancel',
            type: 'warning'
        });

        if (confirmed) {
            showLoading();
            try {
                const res = await blogService.restoreBlog(blog.id);
                if (res.success) {
                    showAlert(res.message, 'success');
                    fetchBlogs();
                }
            } catch (error) {
                showAlert(error.message, 'error');
            } finally {
                hideLoading();
            }
        }
    };


    const totalPages = Math.ceil(totalRows / rowsPerPage);

    return (
        <Box sx={{ minHeight: '100vh', p: 2 }}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Stack spacing={2}>
                        <FilterBlog
                            search={filters.search}
                            initialSelectedTags={filters.tags}
                            setFilters={setFilters}
                            tags={availableTags}
                            status={status}
                            setStatus={setStatus}
                            isFeatured={isFeatured}
                            setIsFeatured={setIsFeatured}
                            isPublish={isPublish}
                            setIsPublish={setIsPublish}
                            rowsPerPage={rowsPerPage}
                            setRowsPerPage={handleRowsPerPageChange}
                            handleResetFilter={handleResetFilter}
                        />
                        <Button fullWidth variant="contained" onClick={navigateToCreate}>
                            Tambah
                        </Button>
                    </Stack>
                </Grid>

                <Grid size={{ xs: 12, md: 9 }}>
                    <Grid container spacing={3} mb={3}>
                        {blogs.map((blog) => {
                            const courseBadges = getBadges("blog", blog);

                            const tags = Array.isArray(blog.tags) ? blog.tags : JSON.parse(blog.tags || '[]');
                            const open = Boolean(menuAnchorEls[blog.id]);

                            return (
                                <Grid size={{ xs: 12, md: 4 }} key={blog.id}>
                                    <Card
                                        sx={{ position: "relative", borderRadius: 2, boxShadow: 3, '&:hover': { boxShadow: 6 } }}
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
                                        <Box position="relative">
                                            <CardMedia
                                                component="img"
                                                height="192"
                                                image={blog.thumbnail}
                                                alt={blog.title}
                                            />
                                            <Box position="absolute" top={8} left={8}>
                                                <Chip label={blog.status} size="small" />
                                            </Box>
                                            <Box position="absolute" top={8} right={8}>
                                                <IconButton onClick={(e) => setMenuAnchorEls({ [blog.id]: e.currentTarget })}>
                                                    <HiDotsVertical color="white" />
                                                </IconButton>
                                                <Menu
                                                    anchorEl={menuAnchorEls[blog.id]}
                                                    open={open}
                                                    onClose={() => setMenuAnchorEls({})}
                                                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                                                >
                                                    {blog.deletedAt ? (
                                                        <MenuItem onClick={() => { setMenuAnchorEls({}); handleRestoreBlog(blog); }}>Restore</MenuItem>
                                                    ) : (
                                                        <MenuItem onClick={() => { setMenuAnchorEls({}); navigate(`/admin/blog/edit?blogId=${blog.id}`); }}>Edit</MenuItem>
                                                    )}
                                                    <MenuItem onClick={() => { setMenuAnchorEls({}); handleDeleteBlog(blog); }}>Hapus</MenuItem>
                                                </Menu>
                                            </Box>
                                        </Box>
                                        <CardContent>
                                            <Typography variant="h6" fontWeight="bold" mb={1}>{blog.title}</Typography>
                                            <Typography variant="body2" color="text.secondary" mb={1}>{blog.date}</Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    mb: 2,
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    lineHeight: '1.5rem',
                                                }}
                                            >
                                                {blog.description}
                                            </Typography>
                                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                                {tags.map((tag, idx) => (
                                                    <Chip key={idx} label={tag} size="small" sx={{ border: '1px solid', borderColor: 'grey.300' }} />
                                                ))}
                                            </Stack>
                                            <Box display="flex" justifyContent="end">
                                                <Button
                                                    size="small"
                                                    startIcon={
                                                        <HiEye />
                                                    }
                                                    onClick={() => navigate(`/admin/blog/detail?blogId=${blog.id}`)}

                                                >
                                                    Preview
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" color="text.secondary">
                            Rows per page: {rowsPerPage}
                        </Typography>
                        <Pagination
                            count={totalPages}
                            page={page + 1}
                            onChange={handlePageChange}
                            color="primary"
                            showFirstButton
                            showLastButton
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default BlogListAdmin;
