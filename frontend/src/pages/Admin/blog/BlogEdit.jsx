import { useState } from "react";
import ManageBlog from "../../../components/Admin/blog/ManageBlog";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import useAlert from "../../../hooks/useAlert";
import { useLoading } from "../../../hooks/useLoading";
import blogService from "../../../services/blogService";


export default function BlogEdit() {
    const [blog, setBlog] = useState(null);
    const { showLoading, hideLoading } = useLoading();
    const { showAlert } = useAlert();
    const [searchParams] = useSearchParams()
    const blogId = searchParams.get('blogId')

    const fetchBlog = async () => {
        if (!blogId) {
            showAlert("Id Blog tidak ditemukan", "error")
            return;
        };

        console.log(blogId)
        showLoading();
        try {
            const res = await blogService.getBlogById({ blogId });
            if (res.success) {
                const blogData = res.blog;

                try {
                    const parsedTags = JSON.parse(blogData.tags);
                    blogData.tags = Array.isArray(parsedTags)
                        ? parsedTags.join(", ")
                        : blogData.tags;
                } catch {
                    blogData.tags = blogData.tags || "";
                }

                setBlog(blogData);
            }
        } catch (error) {
            showAlert(error.message, "error");
        } finally {
            hideLoading();
        }
    };

    useEffect(() => {
        fetchBlog()
    }, [])

    return (
        <>
            <ManageBlog
                editMode={true}
                blog={blog}
            />
        </>
    )
}
