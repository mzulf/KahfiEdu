import PaymentMethod from "../utils/classes/PaymentMethodClass";
import axiosInstance from "../libs/axiosInstance";

const paymentMethodService = {
    getMethods: async () => {
        try {
            const response = await axiosInstance.get(`/payment-methods`, {
                params: {
                    status: "all"
                }
            });
            return {
                ...response.data,
                paymentMethods: response.data.paymentMethods.map(pm => new PaymentMethod(pm))
            };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch methods');
        }
    },
    createMethod: async (data) => {
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

            const response = await axiosInstance.post(`/payment-method`, formData);
            console.log(response.data)
            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch methods');
        }
    },
    updateMethod: async (id, data) => {
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

            const response = await axiosInstance.put(`/payment-method/${id}`, formData);

            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch methods');
        }
    },
    deleteMethod: async (id) => {
        try {
            const response = await axiosInstance.delete(`/payment-method/${id}`)

            return response.data

        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete method');
        }
    },
    restoreMethod: async (id) => {
        try {
            const response = await axiosInstance.post(`/payment-method/restore/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to restore method');
        }
    },

}

export default paymentMethodService