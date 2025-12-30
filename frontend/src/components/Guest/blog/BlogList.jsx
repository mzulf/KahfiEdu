import {
    Box,
    Chip,
    Stack,
    Typography,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { HiTag } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function BlogList({ blogs }) {
    const navigate = useNavigate();

    return (
        <Stack>
            {blogs.map((blog) => (
                <Box
                    key={blog.id}
                    onClick={() => navigate(`/blog/detail?blogId=${blog.id}`)}
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: 3,
                        borderRadius: 2,
                        p: 2,
                        transition: "background-color 0.2s ease",
                        "&:hover": {
                            backgroundColor: "#f0f0f0",
                            cursor: "pointer",
                        },
                    }}
                >
                    {/* Thumbnail */}
                    <Box
                        component="img"
                        src={blog.thumbnail}
                        alt={blog.title}
                        sx={{
                            width: { xs: "100%", md: 300 },
                            height: 200,
                            objectFit: "cover",
                            borderRadius: 2,
                        }}
                    />

                    {/* Blog Content */}
                    <Box sx={{ flex: 1, py: 2 }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                            {blog.title}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            mb={2}
                            sx={{
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {blog.description}
                        </Typography>

                        {/* Info */}
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="caption" fontWeight="bold">
                                    Kahfi Education
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <CalendarMonthIcon sx={{ fontSize: 16 }} className="text-green-600" />
                                <Typography variant="caption">
                                    {new Date(blog.createdAt).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </Typography>
                            </Stack>
                        </Stack>

                        {/* Tags */}
                        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                            <HiTag size={16} className="text-green-600" />
                            {JSON.parse(blog.tags).map((tag, i) => (
                                <Chip
                                    key={i}
                                    label={tag.replace(/^\w/, (c) => c.toUpperCase())}
                                    size="small"
                                    sx={{
                                        bgcolor: "#e0f2e9",
                                        color: "#1b5e20",
                                        fontWeight: 500,
                                    }}
                                />
                            ))}
                        </Stack>
                    </Box>
                </Box>
            ))}
        </Stack>
    );
}
