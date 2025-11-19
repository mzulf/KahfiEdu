import axiosInstance from "../libs/axiosInstance";
import Category from "../utils/classes/CategoryClass";

const categoryService = {
    getCategories: async ({ isActive, search }) => {
        try {
            const response = await axiosInstance.get(`/categories`,
                {
                    params: {
                        isActive,
                        search
                    }
                }
            );
            return {
                ...response.data,
                categories: response.data.categories.map(category => new Category(category))
            };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch categories');
        }
    },
    getCategoryById: async (id) => {
        try {
            const response = await axiosInstance.get(`/category/${id}`);
            return {
                ...response.data,
                category: new Category(response.data.category)
            };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch categories');
        }
    },
    createCategory: async (data, avatarFile) => {
        try {
            const formData = new FormData();

            Object.entries(data).forEach(([key, value]) => {
                if (
                    value === null ||
                    value === undefined ||
                    (key === "avatar" && avatarFile)
                ) {
                    return;
                }
                formData.append(key, String(value));
            });

            if (avatarFile) {
                formData.append("avatar", avatarFile);
            }

            const response = await axiosInstance.post(`/category`, formData);
            return {
                ...response.data,
                category: new Category(response.data.category)
            };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch categories');
        }
    },
    updateCategory: async (categoryId, data, avatarFile) => {
        try {
            const formData = new FormData();

            Object.entries(data).forEach(([key, value]) => {
                if (
                    value === undefined ||
                    value === null ||
                    value === "" ||
                    (key === "avatar" && avatarFile)
                ) {
                    return;
                }
                formData.append(key, String(value));
            });

            if (avatarFile) {
                formData.append("avatar", avatarFile);
            }

            const response = await axiosInstance.put(`/category/${categoryId}`, formData);
            return {
                ...response.data,
                category: new Category(response.data.category)
            };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch categories');
        }
    },
    deleteCategory: async (id) => {
        try {
            const response = await axiosInstance.delete(`/category/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch categories');
        }
    },
    restoreCategory: async (id) => {
        try {
            const response = await axiosInstance.post(`/category/restore/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch categories');
        }
    },
    importCategories: async (formdata) => {
        try {
            const res = await axiosInstance.post('/import/categories', formdata)

            return res;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to import');
        }
    },
    exportCategories: async (format) => {
        try {
            const response = await axiosInstance.get(`/export/categories`, {
                params: { format },
                responseType: 'blob', // Important for file download
                headers: {
                    'Accept': format === 'xlsx' ?
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
                        'text/csv'
                }
            });

            // Create blob and download link
            const blob = new Blob([response.data], {
                type: format === 'xlsx' ?
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
                    'text/csv'
            });

            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `category_export_${Date.now()}.${format}`; // Set filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            return {
                success: true,
                message: 'Export successful'
            };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to export categories');
        }
    }
}

export default categoryService
