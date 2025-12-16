import axiosInstance from "../libs/axiosInstance";
import Materi from "../utils/classes/materiClass";

const materiService = {
    getMateri: async ({ search = "", status = "all", page = 1, limit = 10 } = {}) => {
        const response = await axiosInstance.get("/materi", {
            params: { search, status, page, limit },
        });

        return {
            ...response.data,
            data: response.data.data.map((item) => new Materi(item)),
        };
    },

    getMateriById: async (id) => {
        const response = await axiosInstance.get(`/materi/${id}`);
        return {
            ...response.data,
            data: new Materi(response.data.data),
        };
    },

    createMateri: async (formData) => {
        const response = await axiosInstance.post("/materi", formData);
        return {
            ...response.data,
            data: new Materi(response.data.data),
        };
    },

    updateMateri: async (id, formData) => {
        const response = await axiosInstance.put(`/materi/${id}`, formData);
        return {
            ...response.data,
            data: new Materi(response.data.data),
        };
    },

    deleteMateri: async (id) => {
        const response = await axiosInstance.delete(`/materi/${id}`);
        return response.data;
    },

    restoreMateri: async (id) => {
        const response = await axiosInstance.post(`/materi/restore/${id}`);
        return response.data;
    },

    // 🔥 HARD DELETE
    deleteMateriPermanent: async (id) => {
        const response = await axiosInstance.delete(`/materi/permanent/${id}`);
        return response.data;
    },
};

export default materiService;
