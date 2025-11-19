import axiosInstance from "../libs/axiosInstance";
import Role from "../utils/classes/RoleClass";

const roleService = {
    getRoles: async () => {
        try {
            const response = await axiosInstance.get(`/roles`, {
                params: {
                    status: "all"
                }
            });
            return {
                ...response.data,
                roles: response.data.roles.map(role => new Role(role))
            };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch users');
        }
    },
}

export default roleService