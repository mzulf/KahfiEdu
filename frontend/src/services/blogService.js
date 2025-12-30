import axiosInstance from "../libs/axiosInstance";
import Blog from "../utils/classes/BlogClass";

const blogService = {
    createBlog: async (data, thumbnailFile) => {
        try {
            const formData = new FormData();

            Object.entries(data).forEach(([key, value]) => {
                if (value === null || value === undefined) return;

                // Jika value adalah object (misal tags array), stringify
                if (Array.isArray(value) || typeof value === 'object') {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, String(value));
                }
            });

            if (thumbnailFile) {
                formData.append("thumbnail", thumbnailFile);
            }
            // 🔍 Log FormData
            for (let pair of formData.entries()) {
                console.log(`${pair[0]}:`, pair[1]);
            }

            const response = await axiosInstance.post(`/blog`, formData);
            console.log(response.data)
            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch methods');
        }
    },
    getBlogs: async ({ page, limit, search, status, tags, categoryId, isFeatured, isPublish }) => {
        try {
            const response = await axiosInstance.get(`/blogs`,
                {
                    params: {
                        page,
                        limit,
                        status,
                        search,
                        tags,
                        categoryId,
                        isFeatured,
                        isPublish
                    }
                }
            );
            return {
                ...response.data,
                blogs: response.data.blogs.map(b => new Blog(b))
            };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch Blogs');
        }
    },
    getBlogById: async ({ blogId }) => {
        try {
            const response = await axiosInstance.get(`/blog/${blogId}`);
            return {
                ...response.data,
                blog: new Blog(response.data.blog)
            };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch Blog');
        }
    },
    updateBlog: async (id, data, thumbnailFile) => {
        try {
            const formData = new FormData();

            Object.entries(data).forEach(([key, value]) => {
                if (value === null || value === undefined) return;

                // Jika value adalah object (misal tags array), stringify
                if (Array.isArray(value) || typeof value === 'object') {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, String(value));
                }
            });

            if (thumbnailFile) {
                formData.append("thumbnail", thumbnailFile);
            }

            const response = await axiosInstance.put(`/blog/${id}`, formData);

            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch methods');
        }
    },
    getTags: async () => {
        try {
            const response = await axiosInstance.get(`/tags/blog`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch Blogs');
        }
    },
    deleteBlog: async (blogId) => {
        try {
            const response = await axiosInstance.delete(`/blog/${blogId}`)

            return response.data

        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete blog');
        }
    },
    restoreBlog: async (id) => {
        try {
            const response = await axiosInstance.post(`/blog/restore/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to restore blog');
        }
    },
}

export default blogService;