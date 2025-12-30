import axiosInstance from "../libs/axiosInstance";

const lessonService = {
    createLesson: async (data) => {
        try {
            const formData = new FormData();

            Object.entries(data).forEach(([key, value]) => {
                if (value === null || value === undefined) return;

                if (Array.isArray(value)) {
                    value.forEach((item, index) => {
                        formData.append(`${key}[${index}]`, item);
                    });
                } else if (value instanceof File || value instanceof Blob) {
                    formData.append(key, value);
                } else {
                    formData.append(key, value);
                }
            });

            // Debug isi formData
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            const response = await axiosInstance.post(`/lesson`, formData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to create lesson');
        }
    },
    updateLesson: async (id, data) => {
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

            const response = await axiosInstance.put(`/lesson/${id}`, formData);

            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch methods');
        }
    },
    deleteLesson: async (lessonId) => {
        try {
            const response = await axiosInstance.delete(`/lesson/${lessonId}`)

            return response.data

        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete lesson');
        }
    },
    restoreLesson: async (id) => {
        try {
            const response = await axiosInstance.post(`/lesson/restore/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to restore lesson');
        }
    },
}

export default lessonService;