import axiosInstance from "../libs/axiosInstance";
import Job from "../utils/classes/JobClass";

const jobService = {
    createJob: async (data) => {
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

            const response = await axiosInstance.post(`/job`, formData);
            console.log(response.data)
            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch methods');
        }
    },
    getJobs: async ({ page, limit, search, status }) => {
        try {
            const response = await axiosInstance.get(`/jobs`, {
                params: {
                    page,
                    limit,
                    status,
                    search
                }
            });

            return {
                ...response.data,
                jobs: response.data.jobs.map(j => new Job(j))
            };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch jobs');
        }
    },

    updateJob: async (id, data) => {
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

            const response = await axiosInstance.put(`/job/${id}`, formData);

            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch methods');
        }
    },
    deleteJob: async (jobId) => {
        try {
            const response = await axiosInstance.delete(`/job/${jobId}`)

            return response.data

        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete job');
        }
    },
    restoreJob: async (id) => {
        try {
            const response = await axiosInstance.post(`/job/restore/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to restore job');
        }
    },
}

export default jobService