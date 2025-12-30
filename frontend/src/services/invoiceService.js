import axiosInstance from "../libs/axiosInstance";
import Payment from "../utils/classes/PaymentClass";

const invoiceService = {
    createPayment: async (data, proof) => {
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

            if (thumbnailFile) {
                formData.append("payment_proof", proof);
            }

            const response = await axiosInstance.post(`/payment`, formData);
            console.log(response.data)
            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch methods');
        }
    },
    getPayments: async ({ page, limit, status, search, userId, classId }) => {
        try {
            const response = await axiosInstance.get(`/payments`,
                {
                    params: {
                        page,
                        limit,
                        status,
                        classId,
                        userId,
                        search
                    }
                }
            );
            return {
                ...response.data,
                payments: response.data.payments.map(c => new Payment(c))
            };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch payments');
        }
    },
    getPaymentById: async (paymentId) => {
        try {
            const response = await axiosInstance.get(`/payment/${paymentId}`);
            return {
                ...response.data,
                payment: new Payment(response.data.payment)
            };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch payments');
        }
    },
    updatePayment: async (id, status) => {
        try {

            const response = await axiosInstance.put(`/payment/${id}`, {
                status
            });

            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch methods');
        }
    },
    deletePayment: async (paymentId) => {
        try {
            const response = await axiosInstance.delete(`/payment/${paymentId}`)

            return response.data

        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete payment');
        }
    },
    restorePayment: async (id) => {
        try {
            const response = await axiosInstance.post(`/payment/restore/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to restore payment');
        }
    },
}

export default invoiceService