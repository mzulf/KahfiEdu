import axiosInstance from "../libs/axiosInstance";
import Class from "../utils/classes/Class";

const classService = {
    createClass: async (data) => {
        try {
            const formData = new FormData();

            Object.entries(data).forEach(([key, value]) => {
                if (
                    value === null ||
                    value === undefined
                ) {
                    return;
                }
                formData.append(key, String(value));
            });

            const response = await axiosInstance.post(`/class`, formData);
            console.log(response.data)
            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to create class');
        }
    },
    getClasses: async ({ page, limit, search, status, teacherId, courseId }) => {
        try {
            const response = await axiosInstance.get(`/classes`,
                {
                    params: {
                        page,
                        limit,
                        status,
                        search,
                        teacherId,
                        courseId
                    }
                }
            );
            return {
                ...response.data,
                classes: response.data.classes.map(cl => new Class(cl))
            };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch Blogs');
        }
    },
    getClassById: async (classId) => {
        try {
            const response = await axiosInstance.get(`/class/${classId}`);
            return {
                ...response.data,
                class: new Class(response.data.class)
            };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch classs');
        }
    },
    updateClass: async (id, data) => {
        try {
            const formData = new FormData();

            Object.entries(data).forEach(([key, value]) => {
                if (
                    value === null ||
                    value === undefined ||
                    value === ""
                ) {
                    return;
                }
                formData.append(key, String(value));
            });

            const response = await axiosInstance.put(`/class/${id}`, formData);

            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update class');
        }
    },
    deleteClass: async (classId) => {
        try {
            const response = await axiosInstance.delete(`/class/${classId}`)

            return response.data

        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete class');
        }
    },
    restoreClass: async (id) => {
        try {
            const response = await axiosInstance.post(`/class/restore/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to restore class');
        }
    },
}

export default classService;