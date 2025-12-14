// src/services/materiService.js
import axiosInstance from "../libs/axiosInstance";
import Materi from "../utils/classes/materiClass";

const materiService = {
    // =====================================
    // GET LIST (ADMIN & USER)
    // =====================================
    getMateri: async ({
        search = "",
        status = "all", // admin: all | active | deleted
        page = 1,
        limit = 10,
    } = {}) => {
        try {
            const response = await axiosInstance.get("/materi", {
                params: { search, status, page, limit },
            });

            return {
                ...response.data,
                data: response.data.data.map(
                    (item) => new Materi(item)
                ),
            };
        } catch (error) {
            throw new Error(
                error.response?.data?.message ||
                "Gagal mengambil data materi"
            );
        }
    },

    // =====================================
    // GET DETAIL (USER PAGE)
    // =====================================
    getMateriById: async (id) => {
        try {
            const response = await axiosInstance.get(`/materi/${id}`);
            return {
                ...response.data,
                data: new Materi(response.data.data),
            };
        } catch (error) {
            throw new Error(
                error.response?.data?.message ||
                "Gagal mengambil detail materi"
            );
        }
    },

    // =====================================
    // CREATE (ADMIN) - multipart/form-data
    // fields:
    // title, desc, detail, image
    // =====================================
    createMateri: async (formData) => {
        try {
            const response = await axiosInstance.post(
                "/materi",
                formData
            );

            return {
                ...response.data,
                data: new Materi(response.data.data),
            };
        } catch (error) {
            throw new Error(
                error.response?.data?.message ||
                "Gagal menambahkan materi"
            );
        }
    },

    // =====================================
    // UPDATE (ADMIN) - multipart/form-data
    // =====================================
    updateMateri: async (id, formData) => {
        try {
            const response = await axiosInstance.put(
                `/materi/${id}`,
                formData
            );

            return {
                ...response.data,
                data: new Materi(response.data.data),
            };
        } catch (error) {
            throw new Error(
                error.response?.data?.message ||
                "Gagal memperbarui materi"
            );
        }
    },

    // =====================================
    // DELETE (SOFT DELETE)
    // =====================================
    deleteMateri: async (id) => {
        try {
            const response = await axiosInstance.delete(
                `/materi/${id}`
            );
            return response.data;
        } catch (error) {
            throw new Error(
                error.response?.data?.message ||
                "Gagal menghapus materi"
            );
        }
    },

    // =====================================
    // RESTORE
    // =====================================
    restoreMateri: async (id) => {
        try {
            const response = await axiosInstance.post(
                `/materi/restore/${id}`
            );
            return response.data;
        } catch (error) {
            throw new Error(
                error.response?.data?.message ||
                "Gagal merestore materi"
            );
        }
    },
};

export default materiService;
