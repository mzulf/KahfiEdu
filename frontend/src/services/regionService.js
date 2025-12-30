import axiosInstance from "../libs/axiosInstance";

const regionService = {
    getRegions: async (params = {}) => {
        try {
            const response = await axiosInstance.get(`/regions`, { params });
            if (response.data.success) {
                return response.data;
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch regions');
        }
    },
}

export default regionService