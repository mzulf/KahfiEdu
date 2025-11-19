import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import blogService from "../../services/blogService";
import { set } from "react-hook-form";
import { Box, Chip, Container, Stack, Typography } from "@mui/material";
import { HiChevronLeft, HiShare, HiTag } from "react-icons/hi";

export default function BlogDetail() {
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const blogId = searchParams.get('blogId');
    const navigate = useNavigate();

    const fetchBlog = async () => {
        setLoading(true);
        if (!blogId) {
            console.error("Blog ID tidak ditemukan");
            return;
        }
        try {
            const res = await blogService.getBlogById({ blogId });
            if (res.success) {
                setBlog(res.blog);
            }
        } catch (error) {
            console.error("Gagal mengambil data blog:", error.message);
        } finally {
            setLoading(false);
        }
    }
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: blog?.title,
                    text: blog?.description,
                    url: window.location.href,
                });
            } catch (error) {
                console.error("Gagal membagikan:", error);
            }
        } else {
            alert("Fitur share tidak didukung di perangkat ini.");
        }
    };


    useEffect(() => {
        fetchBlog();
    }, [blogId]);

    const handleBack = () => {
        navigate(-1);
    }

    if (loading) {
        return <Typography variant="body1" fontWeight="semibold" textAlign="center">
            Memuat data blog...
        </Typography>;
    }
    return (
        <Container className="mt-10">
            <Typography variant="body1" fontWeight="semibold" gutterBottom>
                Blog {">"} {blog?.title}
            </Typography>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                {blog?.title}
            </Typography>
            <Typography variant="body1" fontWeight="semibold" gutterBottom>
                Oleh <span className="text-kahf-green">Kahfi</span> {"|"} {blog?.formattedCreatedAt}
            </Typography>
            <img src={blog?.thumbnail} alt={blog?.title} className="w-full h-[500px] my-4 object-cover rounded-lg" />
            <Typography fontSize={20} fontWeight={300} gutterBottom>
                {blog?.description}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                {JSON.parse(blog.tags).map((tag, i) => (
                    <Chip
                        key={i}
                        label={tag.replace(/^\w/, (c) => c.toUpperCase())}
                        size="small"
                        sx={{
                            fontSize: 18,
                            bgcolor: "#d2f7e6",
                            color: "#1b5e20",
                            fontWeight: 500,
                            px: 2,
                            py: 0.5,
                        }}
                    />
                ))}
            </Stack>

            <Box display={"flex"} justifyContent="space-between" alignItems="center" mt={4}>
                <Typography fontSize={20} className="flex items-center space-x-2 hover:text-kahf-green" variant="body1" fontWeight="semibold">
                    <HiChevronLeft size={20} />
                    <span className="cursor-pointer " onClick={handleBack}>
                        Kembali ke Blog
                    </span>
                </Typography>
                <Typography fontSize={20} className="flex items-center space-x-2 hover:text-kahf-green" variant="body1" fontWeight="semibold">
                    <HiShare size={20} />
                    <span className="cursor-pointer " onClick={handleShare}>
                        Bagikan
                    </span>
                </Typography>
            </Box>

        </Container>
    )
}
