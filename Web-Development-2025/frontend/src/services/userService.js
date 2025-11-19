import axiosInstance from "../libs/axiosInstance";
import User from "../utils/classes/UserClass";

const userService = {
    getUsers: async ({ page, limit, search, status, roleId }) => {
        try {
            const response = await axiosInstance.get(`/users`,
                {
                    params: {
                        page,
                        limit,
                        search,
                        status,
                        roleId
                    }
                }
            );
            return {
                ...response.data,
                users: response.data.users.map(user => new User(user))
            };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch users');
        }
    },
    getUserById: async (id) => {
        try {
            const response = await axiosInstance.get(`/user/${id}`);
            return {
                ...response.data,
                user: new User(response.data.user)
            };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch users');
        }
    },
    getUserByRole: async ({ roleName }) => {
        try {
            const response = await axiosInstance.get(`/users/role`,
                {
                    params: {
                        roleName
                    }
                }
            );
            return {
                ...response.data,
                users: response.data.users.map(user => new User(user))
            };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch users');
        }
    },
    createUser: async (data, avatarFile) => {
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

            const response = await axiosInstance.post(`/user`, formData);
            return {
                ...response.data,
                user: new User(response.data.user)
            };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch users');
        }
    },
    updateUser: async (userId, data, avatarFile) => {
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

            const response = await axiosInstance.put(`/user/${userId}`, formData);
            return {
                ...response.data,
                user: new User(response.data.user)
            };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch users');
        }
    },
    deleteUser: async (id) => {
        try {
            const response = await axiosInstance.delete(`/user/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch users');
        }
    },
    restoreUser: async (id) => {
        try {
            const response = await axiosInstance.post(`/user/restore/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch users');
        }
    },
    importUsers: async (formdata) => {
        try {
            const res = await axiosInstance.post('/import/users', formdata)

            return res;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to import');
        }
    },
    exportUsers: async (format) => {
        try {
            const response = await axiosInstance.get(`/export/users`, {
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
            link.download = `user_export_${Date.now()}.${format}`; // Set filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            return {
                success: true,
                message: 'Export successful'
            };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to export users');
        }
    }
}

export default userService
