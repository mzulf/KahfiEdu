import axiosInstance from "../libs/axiosInstance";

const assignmentService = {
    createAssignment: async (data) => {
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

            const response = await axiosInstance.post(`/assignment`, formData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to create assignment');
        }
    },
    updateAssignment: async (id, data) => {
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

            const response = await axiosInstance.put(`/assignment/${id}`, formData);

            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch methods');
        }
    },
    deleteAssignment: async (assigmentId) => {
        try {
            const response = await axiosInstance.delete(`/assignment/${assigmentId}`)

            return response.data

        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete assigment');
        }
    },
    restoreAssignment: async (id) => {
        try {
            const response = await axiosInstance.post(`/assignment/restore/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to restore assigment');
        }
    },
}

export default assignmentService;